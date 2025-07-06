import { createTheme } from "@mui/material/styles";

// Global color configuration - easily customizable
export const appColors = {
  primary: {
    main: "#6366f1", // Indigo
    light: "#818cf8",
    dark: "#4f46e5",
  },
  secondary: {
    main: "#f59e0b", // Amber
    light: "#fbbf24",
    dark: "#d97706",
  },
  success: {
    main: "#10b981", // Emerald
    light: "#34d399",
    dark: "#059669",
  },
  warning: {
    main: "#f59e0b", // Amber
    light: "#fbbf24",
    dark: "#d97706",
  },
  error: {
    main: "#ef4444", // Red
    light: "#f87171",
    dark: "#dc2626",
  },
  info: {
    main: "#3b82f6", // Blue
    light: "#60a5fa",
    dark: "#2563eb",
  },
  background: {
    default: "#0f172a", // Slate 900
    paper: "#1e293b", // Slate 800
    surface: "#334155", // Slate 700
  },
  text: {
    primary: "#f8fafc", // Slate 50
    secondary: "#cbd5e1", // Slate 300
    disabled: "#64748b", // Slate 500
  },
};

// Dark-only theme configuration
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: appColors.primary,
    secondary: appColors.secondary,
    success: appColors.success,
    warning: appColors.warning,
    error: appColors.error,
    info: appColors.info,
    background: {
      default: appColors.background.default,
      paper: appColors.background.paper,
    },
    text: {
      primary: appColors.text.primary,
      secondary: appColors.text.secondary,
      disabled: appColors.text.disabled,
    },
    divider: "#475569", // Slate 600
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
          border: `1px solid ${appColors.background.surface}`,
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
          borderRight: `1px solid ${appColors.background.surface}`,
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

// Export the main theme (dark-only)
export const theme = darkTheme;
