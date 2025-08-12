import React from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import "./pdfjs-setup";
import i18n from "./i18n";
import Home from "./pages/Home";
import "./assets/styles/index.css";
import AppThemeProvider from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <AppThemeProvider>
    <I18nextProvider i18n={i18n}>
      <NotificationProvider
        snackbarProps={{
          maxSnack: 3,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        }}
      >
        <Home />
      </NotificationProvider>
    </I18nextProvider>
  </AppThemeProvider>
);
