import { useCallback, useMemo, useRef, useState } from "react";
import { extractTextFromFile } from "./ocrService";
import { useTranslation } from "react-i18next";
import { useNotify } from "../context/NotificationContext";
import { useTheme } from "../context/ThemeContext";

export const useHomeService = () => {
  const { theme, toggleTheme, isDarkTheme } = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isCheckedTheme, setIsCheckedTheme] = useState(false);

  const { t } = useTranslation();
  const notify = useNotify();

  const reqIdRef = useRef(0);
  const MAX_SIZE_BYTES = 50 * 1024 * 1024;

  const processFile = useCallback(
    async (file: File) => {
      const myReqId = ++reqIdRef.current;
      setLoading(true);

      try {
        const text = await notify.promise(extractTextFromFile(file), {
          pending: t("notify.pending"),
          success: t("notify.success.extract"),
          error: t("notify.error.extract"),
          options: {
            pending: { persist: true },
            success: { autoHideDuration: 2500 },
            error: { autoHideDuration: 4000 },
          },
        });

        if (reqIdRef.current === myReqId) {
          const safe = typeof text === "string" ? text : "";

          if (!safe.trim()) {
            notify.error(t("notify.empty.result"));
            setOcrText("");
            return;
          }
          setOcrText(safe);
        }
      } catch (error) {
        console.error(error);
        if (reqIdRef.current === myReqId) setOcrText("");
      } finally {
        if (reqIdRef.current === myReqId) setLoading(false);
      }
    },
    [notify, t]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.target;
      const file = input?.files?.[0];
      if (!file) return;

      if (file.size > MAX_SIZE_BYTES) {
        notify.warning(t("notify.file.too.large"));
        input.value = "";
        return;
      }

      setSelectedFile(file);
      notify.info(t("notify.file.selected", { name: file.name }), {
        autoHideDuration: 2500,
      });

      void processFile(file);
      input.value = "";
    },
    [notify, processFile, t]
  );

  const handleFileUpload = useCallback(async () => {
    if (!selectedFile) {
      notify.warning(t("notify.no.file"));
      return;
    }
    await processFile(selectedFile);
  }, [notify, processFile, selectedFile, t]);

  const handleCopyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(ocrText ?? "");
      notify.success(t("notify.copied"));
    } catch {
      notify.error(t("notify.copy.failed"));
    }
  }, [notify, ocrText, t]);

  const toggleThemeService = useCallback(() => {
    setIsCheckedTheme((prev) => !prev);
    toggleTheme(isDarkTheme ? "light" : "dark");
  }, [toggleTheme, isDarkTheme]);

  const resetExtraction = useCallback(() => {
    setSelectedFile(null);
    setOcrText("");
    notify.closeAll();
  }, [notify]);

  const hasText = useMemo(() => !!ocrText && ocrText.trim().length > 0, [ocrText]);

  return {
    selectedFile,
    ocrText,
    loading,
    theme,
    isCheckedTheme,
    hasText,
    handleFileChange,
    handleFileUpload,
    handleCopyToClipboard,
    toggleThemeService,
    resetExtraction,
  };
};
