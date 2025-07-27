import { createTheme } from "@mui/material/styles";

// Light Mode Color Palette
export const lightColors = {
  background: {
    default: "#ffffff",
    paper: "#f6f6f6",
    surface: "#f3f3f3",
    secondary: "#fdffff",
    tertiary: "#fdfdfd",
    quaternary: "#f9f9f9",
    widget: "#e7e8ea",
  },
  borders: {
    primary: "#e3e3e3",
    secondary: "#e7e8ea",
  },
  accent: {
    primary: "#000000",
    secondary: "#c1b5bf",
    tertiary: "#e3e3e3",
    quaternary: "#f3f3f3",
  },
  text: {
    primary: "#000000",
    secondary: "#c1b5bf",
    disabled: "#c1b5bf",
  },
};

// Dark Mode Color Palette
export const darkColors = {
  background: {
    default: "#2a2e31",
    paper: "#1b232c",
    surface: "#1a232c",
    secondary: "#1c232d",
    tertiary: "#1b232b",
    quaternary: "#111517",
    widget: "#1b232c",
  },
  borders: {
    primary: "#907854",
    secondary: "#d0a362",
  },
  accent: {
    primary: "#fbecca",
    secondary: "#f4d791",
    tertiary: "#d0a362",
    quaternary: "#907854",
  },
  text: {
    primary: "#ffffff",
    secondary: "#ffffff",
    disabled: "#c1b5bf",
  },
};

// Common color configuration for both themes
export const getCommonColors = (mode: "light" | "dark") => ({
  primary: {
    main: mode === "light" ? "#000000" : "#fbecca",
    light: mode === "light" ? "#c1b5bf" : "#f4d791",
    dark: mode === "light" ? "#000000" : "#d0a362",
  },
  secondary: {
    main: mode === "light" ? "#c1b5bf" : "#f4d791",
    light: mode === "light" ? "#e3e3e3" : "#fbecca",
    dark: mode === "light" ? "#000000" : "#907854",
  },
  success: {
    main: mode === "light" ? "#4caf50" : "#fbecca",
    light: mode === "light" ? "#81c784" : "#f4d791",
    dark: mode === "light" ? "#388e3c" : "#d0a362",
  },
  warning: {
    main: mode === "light" ? "#ff9800" : "#f4d791",
    light: mode === "light" ? "#ffb74d" : "#fbecca",
    dark: mode === "light" ? "#f57c00" : "#907854",
  },
  error: {
    main: mode === "light" ? "#f44336" : "#ff6b6b",
    light: mode === "light" ? "#e57373" : "#ff8a80",
    dark: mode === "light" ? "#d32f2f" : "#d32f2f",
  },
  info: {
    main: mode === "light" ? "#2196f3" : "#fbecca",
    light: mode === "light" ? "#64b5f6" : "#f4d791",
    dark: mode === "light" ? "#1976d2" : "#d0a362",
  },
});

// Light theme configuration
const lightCommonColors = getCommonColors("light");
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: lightCommonColors.primary,
    secondary: lightCommonColors.secondary,
    success: lightCommonColors.success,
    warning: lightCommonColors.warning,
    error: lightCommonColors.error,
    info: lightCommonColors.info,
    background: {
      default: lightColors.background.default,
      paper: lightColors.background.paper,
    },
    text: {
      primary: lightColors.text.primary,
      secondary: lightColors.text.secondary,
      disabled: lightColors.text.disabled,
    },
    divider: lightColors.borders.primary,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      letterSpacing: "-0.025em",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      letterSpacing: "-0.025em",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          border: `1px solid ${lightColors.borders.primary}`,
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          backgroundImage: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
          borderRight: `1px solid ${lightColors.borders.primary}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// Dark theme configuration
const darkCommonColors = getCommonColors("dark");
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: darkCommonColors.primary,
    secondary: darkCommonColors.secondary,
    success: darkCommonColors.success,
    warning: darkCommonColors.warning,
    error: darkCommonColors.error,
    info: darkCommonColors.info,
    background: {
      default: darkColors.background.default,
      paper: darkColors.background.paper,
    },
    text: {
      primary: darkColors.text.primary,
      secondary: darkColors.text.secondary,
      disabled: darkColors.text.disabled,
    },
    divider: darkColors.accent.quaternary,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      letterSpacing: "-0.025em",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      letterSpacing: "-0.025em",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
          border: `1px solid ${darkColors.accent.quaternary}`,
          backgroundImage: "none",
          backgroundColor: darkColors.background.widget,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          backgroundImage: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
          borderRight: `1px solid ${darkColors.accent.quaternary}`,
          backgroundColor: darkColors.background.paper,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// Export themes
export const theme = darkTheme; // Default theme for backward compatibility
