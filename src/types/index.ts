import { type ReactNode } from "react";
import { SnackbarProvider, type SnackbarKey, type OptionsObject } from "notistack";
import { type LoggerMessage } from "tesseract.js";

export type Stage = "intro" | "upload" | "result";

export interface FileUploadProps {
  selectedFile: File | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileUpload: () => void;
  loading: boolean;
}

export interface ExtractedTextProps {
  ocrText: string;
  loading: boolean;
  handleCopyToClipboard: () => void;
  handleNewItem: () => void;
}

export type Theme = "light" | "dark";

export interface ThemeContextProps {
  theme: Theme;
  toggleTheme: (newTheme: Theme) => void;
  isDarkTheme: boolean;
}

export interface NotifyApi {
  readonly notify: (message: ReactNode, options?: NotifyOptions) => SnackbarKey;
  readonly success: (message: ReactNode, options?: NotifyOptions) => SnackbarKey;
  readonly error: (message: ReactNode, options?: NotifyOptions) => SnackbarKey;
  readonly warning: (message: ReactNode, options?: NotifyOptions) => SnackbarKey;
  readonly info: (message: ReactNode, options?: NotifyOptions) => SnackbarKey;
  readonly default: (message: ReactNode, options?: NotifyOptions) => SnackbarKey;
  readonly close: (key?: SnackbarKey) => void;
  readonly closeAll: () => void;
  readonly promise: <T>(p: Promise<T>, messages?: PromiseMessages<T>) => Promise<T>;
}

export type NotifyVariant = "default" | "success" | "error" | "warning" | "info";

export type NotifyOptions = OptionsObject & { readonly key?: SnackbarKey };

export type PromiseMessages<T = unknown> = {
  readonly pending?: ReactNode | ((p: Promise<T>) => ReactNode);
  readonly success?: ReactNode | ((value: T) => ReactNode);
  readonly error?: ReactNode | ((err: unknown) => ReactNode);
  readonly options?: {
    readonly pending?: NotifyOptions;
    readonly success?: NotifyOptions;
    readonly error?: NotifyOptions;
  };
};

export type NotificationProviderProps = {
  readonly children: ReactNode;
  readonly snackbarProps?: Partial<React.ComponentProps<typeof SnackbarProvider>>;
};

export type ExtractOptions = {
  langs?: string[];
  preferTextForHtml?: boolean;
  forceOcrForHtml?: boolean;
  dpi?: number;
  pdfMaxPages?: number;
  maxConcurrency?: number;
  progress?: (msg: LoggerMessage) => void;
  ocrParams?: Partial<{
    tessedit_pageseg_mode: string | number;
    tessedit_ocr_engine_mode: string | number;
    preserve_interword_spaces: string | number;
    tessedit_char_whitelist: string;
    user_defined_dpi: string | number;
  }>;
};
