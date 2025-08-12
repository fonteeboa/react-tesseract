import { GlobalWorkerOptions } from "pdfjs-dist";

// Sem import.meta, sem ESM import — usa string absoluta da mesma origem
GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL || ""}/pdf.worker.min.mjs`;
