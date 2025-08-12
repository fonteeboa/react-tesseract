import React, { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { SnackbarProvider, useSnackbar, type SnackbarKey } from "notistack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { NotifyVariant, NotifyOptions, NotifyApi, NotificationProviderProps } from "../types";

const DEFAULT_DURATIONS: Record<NotifyVariant, number | "persist"> = {
  default: 7000,
  success: 6000,
  info: 8000,
  warning: 9000,
  error: "persist",
};

function applyDuration(v: NotifyVariant, options?: NotifyOptions): NotifyOptions {
  if (options?.autoHideDuration !== undefined || options?.persist !== undefined) return options;
  const d = DEFAULT_DURATIONS[v];
  if (d === "persist") return { ...options, persist: true };
  return { ...options, autoHideDuration: d };
}

const NotifyContext = createContext<NotifyApi | null>(null);

export const useNotify = (): NotifyApi => {
  const ctx = useContext(NotifyContext);
  if (!ctx) throw new Error("useNotify must be used within <NotificationProvider>");
  return ctx;
};

// ---------------- Bridge ----------------
const NotifyBridge: React.FC<{ readonly children: ReactNode }> = ({ children }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const baseAction = useCallback(
    (key: SnackbarKey) => (
      <IconButton aria-label="dismiss" size="small" onClick={() => closeSnackbar(key)}>
        <CloseIcon fontSize="small" />
      </IconButton>
    ),
    [closeSnackbar]
  );

  const notify = useCallback<NotifyApi["notify"]>(
    (message, options) => {
      return enqueueSnackbar(message, {
        action: options?.action ?? ((key) => baseAction(key)),
        preventDuplicate: true,
        ...options,
        ...applyDuration("default", options),
      });
    },
    [enqueueSnackbar, baseAction]
  );

  const variant = useCallback(
    (v: NotifyVariant) => (message: ReactNode, options?: NotifyOptions) =>
      enqueueSnackbar(message, {
        action: options?.action ?? ((key) => baseAction(key)),
        preventDuplicate: true,
        variant: v,
        ...options,
        ...applyDuration("default", options),
      }),
    [enqueueSnackbar, baseAction]
  );

  const close = useCallback<NotifyApi["close"]>(
    (key) => {
      if (key) closeSnackbar(key);
      else closeSnackbar();
    },
    [closeSnackbar]
  );

  const closeAll = useCallback(() => closeSnackbar(), [closeSnackbar]);

  const tt = useCallback((key: string, fallback: string) => t(key, { defaultValue: fallback }), [t]);

  const promise = useCallback<NotifyApi["promise"]>(
    async (p, messages) => {
      const pendingOptions: NotifyOptions = applyDuration("info", {
        variant: "info",
        autoHideDuration: undefined,
        persist: true,
        ...messages?.options?.pending,
      });

      const pendingMsg =
        typeof messages?.pending === "function"
          ? messages.pending(p)
          : messages?.pending ?? t("notify.pending");

      const key = enqueueSnackbar(pendingMsg, pendingOptions);

      try {
        const value = await p;
        close(key);
        const successMsg =
          typeof messages?.success === "function"
            ? messages.success(value)
            : messages?.success ?? t("notify.success");
        enqueueSnackbar(successMsg, applyDuration("success", messages?.options?.success));
        return value;
      } catch (err) {
        close(key);
        const errorMsg =
          typeof messages?.error === "function"
            ? messages.error(err)
            : messages?.error ?? t("notify.error");
        enqueueSnackbar(errorMsg, applyDuration("error", messages?.options?.error));
        throw err;
      }
    },
    [enqueueSnackbar, close, tt]
  );

  const api = useMemo<NotifyApi>(
    () => ({
      notify,
      success: variant("success"),
      error: variant("error"),
      warning: variant("warning"),
      info: variant("info"),
      default: variant("default"),
      close,
      closeAll,
      promise,
    }),
    [notify, variant, close, closeAll, promise]
  );

  return <NotifyContext.Provider value={api}>{children}</NotifyContext.Provider>;
};

// ---------------- Provider ----------------
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children, snackbarProps }) => {
  return (
    <SnackbarProvider
      maxSnack={snackbarProps?.maxSnack ?? 3}
      autoHideDuration={snackbarProps?.autoHideDuration ?? 4000}
      anchorOrigin={snackbarProps?.anchorOrigin ?? { vertical: "bottom", horizontal: "right" }}
      hideIconVariant={snackbarProps?.hideIconVariant ?? false}
      preventDuplicate={snackbarProps?.preventDuplicate ?? true}
      dense={snackbarProps?.dense ?? false}
      {...snackbarProps}
    >
      <NotifyBridge>{children}</NotifyBridge>
    </SnackbarProvider>
  );
};
