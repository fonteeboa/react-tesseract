import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Theme, ThemeContextProps } from "../types";

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const TOKENS = {
  light: {
    primary: "#00792D",
    background: {
      default: "#e8efdf",
      paper: "#FFFDF5",
    },
    text: {
      primary: "#1B232A",
      secondary: "#4B5563",
      button: "#FFFDF5",
      disabled: "rgba(27,35,42,0.38)",
    },
    common: {
      white: "#F5F5F5",
    },
    secondary: "#0E7C86",
    success: "#16A34A",
    warning: "#D97706",
    error: "#DC2626",
    info: "#2563EB",
    divider: "rgba(27,35,42,0.12)",
    action: {
      hover: "rgba(0,0,0,0.04)",
      selected: "rgba(0,0,0,0.08)",
      disabled: "rgba(0,0,0,0.26)",
      focus: "rgba(0,0,0,0.12)",
    },
    brand: {
      primary: "#00792D",
      onPrimary: "#1B232A",
      surface: "#E6FFF0",
      border: "#B2F5CC",
    },
    accent: {
      primary: "#10B981",
      subtle: "#ECFDF5",
      border: "#A7F3D0",
    },
  },

  dark: {
    primary: "#18DA16",
    background: {
      default: "#121212",
      paper: "#1A1A1A",
    },
    text: {
      primary: "#F5F5F5",
      secondary: "#E5E7EB",
      disabled: "rgba(245,245,245,0.38)",
    },
    common: {
      white: "#F5F5F5",
    },
    secondary: "#22D3EE",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#F87171",
    info: "#60A5FA",
    divider: "rgba(255,255,255,0.12)",
    action: {
      hover: "rgba(255,255,255,0.08)",
      selected: "rgba(255,255,255,0.16)",
      disabled: "rgba(255,255,255,0.3)",
      focus: "rgba(255,255,255,0.12)",
    },
    brand: {
      primary: "#18DA16",
      onPrimary: "#beffa8",
      surface: "#0B1A0B",
      border: "#244C24",
    },
    accent: {
      primary: "#34D399",
      subtle: "#062018",
      border: "#1C6C4F",
    },
  },
} as const;

const THEME_STORAGE_KEY = "react-tesseract-theme";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "dark";
  }

  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme as Theme;
    }
  } catch (error) {
    console.warn("Erro ao acessar localStorage:", error);
  }

  return "dark";
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const isDarkTheme = theme === "dark";

  const toggleTheme = useCallback((newTheme: Theme) => {

    setTheme(newTheme);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch (error) {
        console.warn("Erro ao salvar tema no localStorage:", error);
      }
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      theme,
      toggleTheme,
      isDarkTheme,
    }),
    [theme, toggleTheme, isDarkTheme]
  );

  const muiTheme = useMemo(() => {
    return createTheme({
      palette: {
        mode: isDarkTheme ? "dark" : "light",
        primary: {
          main: isDarkTheme ? TOKENS.dark.primary : TOKENS.light.primary,
        },
        background: {
          default: isDarkTheme ? TOKENS.dark.background.default : TOKENS.light.background.default,
          paper: isDarkTheme ? TOKENS.dark.background.paper : TOKENS.light.background.paper,
        },
        text: {
          primary: isDarkTheme ? TOKENS.dark.text.primary : TOKENS.light.text.primary,
          secondary: isDarkTheme ? TOKENS.dark.text.secondary : TOKENS.light.text.secondary,
          disabled: isDarkTheme ? TOKENS.dark.text.disabled : TOKENS.light.text.disabled,
        } as any,
        common: {
          white: isDarkTheme ? TOKENS.dark.common.white : TOKENS.light.common.white,
        }
      },
      
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              color: isDarkTheme ? TOKENS.dark.brand.onPrimary : TOKENS.light.brand.onPrimary,
            },
          },
        },
      },
    });
  }, [isDarkTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return context;
};

export default ThemeProvider;
