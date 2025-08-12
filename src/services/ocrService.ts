import i18n from "../i18n";
import Tesseract, { type LoggerMessage, PSM, OEM } from "tesseract.js";
import { getDocument, type PDFDocumentProxy } from "pdfjs-dist";
import type { TextContent } from "pdfjs-dist/types/src/display/api";
// @ts-ignore

import { ExtractOptions } from "../types";
const DEFAULT_LANGS = ["por", "eng"];
let singletonWorker: Tesseract.Worker | null = null;
let workerLangKey = "";

function normalizeOcrParams(input: Record<string, string | number>) {
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(input)) {
    if (k === "tessedit_pageseg_mode" || k === "tessedit_ocr_engine_mode") {
      out[k] = Number(v);
    } else if (k === "preserve_interword_spaces" || k === "user_defined_dpi") {
      out[k] = String(v);
    } else {
      out[k] = v as any;
    }
  }
  return out;
}

async function getWorker(langs: string[], progress?: (m: LoggerMessage) => void) {
  const key = langs
    .slice()
    .sort((a, b) => a.localeCompare(b))
    .join("+");

  if (singletonWorker && workerLangKey === key) return singletonWorker;

  if (singletonWorker) {
    try {
      await singletonWorker.terminate();
    } catch {}
    singletonWorker = null;
  }

  const worker = await Tesseract.createWorker(langs, 1, {
    logger: (m) => progress?.(m),
  });

  workerLangKey = key;
  singletonWorker = worker;
  return worker;
}

async function imageToImageBitmap(fileOrBlob: Blob): Promise<ImageBitmap> {
  const bmp = await createImageBitmap(fileOrBlob);
  return bmp;
}

function releaseBitmap(bmp?: ImageBitmap) {
  try {
    bmp?.close();
  } catch {}
}

function createCanvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.floor(w));
  c.height = Math.max(1, Math.floor(h));
  return c;
}

function toGrayscaleAndBinarize(src: HTMLCanvasElement): HTMLCanvasElement {
  const dst = createCanvas(src.width, src.height);
  const sctx = src.getContext("2d")!;
  const dctx = dst.getContext("2d")!;
  const img = sctx.getImageData(0, 0, src.width, src.height);
  const data = img.data;
  let sum = 0;
  for (let i = 0; i < data.length; i += 4) {
    const g = (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
    data[i] = data[i + 1] = data[i + 2] = g;
    sum += g;
  }
  const mean = sum / (data.length / 4);
  const thr = mean * 0.9;
  for (let i = 0; i < data.length; i += 4) {
    const v = data[i] > thr ? 255 : 0;
    data[i] = data[i + 1] = data[i + 2] = v;
  }
  dctx.putImageData(img, 0, 0);
  return dst;
}

async function svgToCanvas(svgBlob: Blob): Promise<HTMLCanvasElement> {
  const url = URL.createObjectURL(svgBlob);
  try {
    const bmp = await fetch(url)
      .then((r) => r.blob())
      .then((b) => createImageBitmap(b));
    const canvas = createCanvas(bmp.width || 1200, bmp.height || 800);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0);
    releaseBitmap(bmp);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function extractPdfTextLayer(pdf: PDFDocumentProxy, limit?: number): Promise<string> {
  const { t } = i18n;
  const total = pdf.numPages;
  const upto = Math.min(total, limit ?? total);
  const chunks: string[] = [];
  for (let i = 1; i <= upto; i++) {
    const page = await pdf.getPage(i);
    const textContent: TextContent = await page.getTextContent();
    const pageStr = textContent.items
      .map((it: any) => ("str" in it ? it.str : ""))
      .join("\n")
      .trim();
    if (pageStr) {
      const header = t("pdf.section.header", {
        page: t("pdf.page", { index: i }),
        kind: t("pdf.native.text"),
      });
      chunks.push(`${header}\n${pageStr}`);
    }
    page.cleanup();
  }
  return chunks.join("\n\n").trim();
}

// --- HTML helpers ---
async function htmlToPlainText(file: File): Promise<string> {
  const txt = await file.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(txt, "text/html");
  doc.querySelectorAll("script,style,noscript").forEach((n) => n.remove());
  return (doc.body?.innerText || "").replace(/\s+\n/g, "\n").trim();
}

async function htmlToCanvasRudimentary(file: File, width = 1200): Promise<HTMLCanvasElement> {
  const html = await file.text();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}">
    <foreignObject x="0" y="0" width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font:16px sans-serif;padding:16px;background:#fff;">
        ${html}
      </div>
    </foreignObject>
  </svg>`;
  const blob = new Blob([svg], { type: "image/svg+xml" });
  return svgToCanvas(blob);
}

async function recognizeCanvas(
  canvas: HTMLCanvasElement,
  langs: string[],
  progress?: (m: LoggerMessage) => void,
  ocrParams?: ExtractOptions["ocrParams"]
): Promise<string> {
  const pre = toGrayscaleAndBinarize(canvas);
  const worker = await getWorker(langs, progress);

  const baseParams = {
    tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
    tessedit_ocr_engine_mode: OEM.LSTM_ONLY,
    preserve_interword_spaces: "1",
    user_defined_dpi: "300",
  };

  const params: any = { ...baseParams };
  if (ocrParams) Object.assign(params, normalizeOcrParams(ocrParams));

  await worker.setParameters(params);

  const {
    data: { text },
  } = await worker.recognize(pre);
  pre.width = 0;
  pre.height = 0;
  return (text || "").trim();
}

function guessLangsFromNameOrType(name: string, type: string, langs?: string[]): string[] {
  if (langs?.length) return langs;
  if (/pt[-_.]?br|portugu[eê]s|\.br\b/i.test(name)) return ["por", "eng"];
  if (/es|spa(nish)?|\.mx\b|\.es\b/i.test(name)) return ["spa", "eng"];
  return DEFAULT_LANGS;
}

export async function extractTextFromFile(file: File, opts: ExtractOptions = {}): Promise<string> {
  const {
    langs,
    preferTextForHtml = true,
    forceOcrForHtml = false,
    dpi = 160,
    pdfMaxPages,
    maxConcurrency = Math.max(1, Math.min(4, (navigator as any).hardwareConcurrency || 2)),
    progress,
    ocrParams,
  } = opts;

  const type = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();
  const chosenLangs = guessLangsFromNameOrType(name, type, langs);

  try {
    if (type === "application/pdf" || name.endsWith(".pdf")) {
      const data = await file.arrayBuffer();
      const pdf = await getDocument({ data }).promise;
      const nativeText = await extractPdfTextLayer(pdf, pdfMaxPages);
      if (nativeText) return nativeText;
      const total = pdf.numPages;
      const limit = Math.min(total, pdfMaxPages ?? total);
      const indices = Array.from({ length: limit }, (_, i) => i + 1);
      const results: string[] = [];
      let current = 0;

      const workerLoop = async (): Promise<void> => {
        while (true) {
          const i = current++;
          if (i >= indices.length) break;

          const pageIndex = indices[i];
          const page = await pdf.getPage(pageIndex);
          const viewport = page.getViewport({ scale: Math.max(1, dpi / 72) });

          const canvas = createCanvas(viewport.width, viewport.height);
          const ctx = canvas.getContext("2d")!;
          await page.render({ canvas, canvasContext: ctx, viewport, intent: "print" as any }).promise;
          page.cleanup();

          const pageText = await recognizeCanvas(canvas, chosenLangs, progress, ocrParams);
          canvas.width = 0;
          canvas.height = 0;

          if (pageText) results[pageIndex - 1] = `=== Página ${pageIndex} ===\n${pageText}`;
        }
      };

      const workers = Array.from({ length: maxConcurrency }, () => workerLoop());
      await Promise.all(workers);

      return results.filter(Boolean).join("\n\n").trim();
    }

    // --- Imagens bitmap ---
    if (type.startsWith("image/") && type !== "image/svg+xml") {
      const bmp = await imageToImageBitmap(file);
      const canvas = createCanvas(bmp.width, bmp.height);
      canvas.getContext("2d")!.drawImage(bmp, 0, 0);
      releaseBitmap(bmp);

      const text = await recognizeCanvas(canvas, chosenLangs, progress, ocrParams);
      canvas.width = 0;
      canvas.height = 0;
      return text;
    }

    // --- SVG ---
    if (type === "image/svg+xml" || name.endsWith(".svg")) {
      const canvas = await svgToCanvas(file);
      const text = await recognizeCanvas(canvas, chosenLangs, progress, ocrParams);
      canvas.width = 0;
      canvas.height = 0;
      return text;
    }

    // --- HTML ---
    if (type === "text/html" || name.endsWith(".html") || name.endsWith(".htm")) {
      if (preferTextForHtml && !forceOcrForHtml) {
        return await htmlToPlainText(file);
      } else {
        const canvas = await htmlToCanvasRudimentary(file);
        const text = await recognizeCanvas(canvas, chosenLangs, progress, ocrParams);
        canvas.width = 0;
        canvas.height = 0;
        return text;
      }
    }

    // --- Text-like (csv, txt, xml, etc.) ---
    if (type.startsWith("text/") || /\.(csv|txt|xml|svgz)$/i.test(name)) {
      return (await file.text()).trim();
    }

    // --- Fallback: tentar como imagem ---
    try {
      const bmp = await imageToImageBitmap(file);
      const canvas = createCanvas(bmp.width, bmp.height);
      canvas.getContext("2d")!.drawImage(bmp, 0, 0);
      releaseBitmap(bmp);

      const text = await recognizeCanvas(canvas, chosenLangs, progress, ocrParams);
      canvas.width = 0;
      canvas.height = 0;
      return text;
    } catch {
      return "";
    }
  } catch (err) {
    console.error("Error processing file:", err);
    return "";
  }
}

export async function disposeOcrWorker() {
  if (singletonWorker) {
    try {
      await singletonWorker.terminate();
    } catch {}
    singletonWorker = null;
    workerLangKey = "";
  }
}
