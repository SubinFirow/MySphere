"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { getTheme, applyFont } from "@/lib/themes";

interface ThemeContextType {
  currentTheme: string;
  currentFont: string;
  changeTheme: (themeName: string) => void;
  changeFont: (fontName: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("modernIndigo");
  const [currentFont, setCurrentFont] = useState("Inter + Poppins");

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("user-app-theme");
    const savedFont = localStorage.getItem("user-app-font");

    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
    if (savedFont) {
      setCurrentFont(savedFont);
    }
  }, []);

  const changeTheme = (themeName: string) => {
    setCurrentTheme(themeName);
    localStorage.setItem("user-app-theme", themeName);
  };

  const changeFont = (fontName: string) => {
    setCurrentFont(fontName);
    localStorage.setItem("user-app-font", fontName);
  };

  // Get the current theme with applied font
  const theme = applyFont(getTheme(currentTheme), currentFont);

  const contextValue: ThemeContextType = {
    currentTheme,
    currentFont,
    changeTheme,
    changeFont,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
