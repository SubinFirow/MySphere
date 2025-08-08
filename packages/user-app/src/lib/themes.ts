import { createTheme, Theme } from "@mui/material/styles";

// Modern Indigo Theme - Professional and vibrant
export const modernIndigoTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4F46E5", // Indigo-600
      light: "#7C3AED", // Violet-600
      dark: "#3730A3", // Indigo-800
    },
    secondary: {
      main: "#22D3EE", // Cyan-400
      light: "#67E8F9", // Cyan-300
      dark: "#0891B2", // Cyan-600
    },
    background: {
      default: "#F8FAFC", // Slate-50
      paper: "rgba(255, 255, 255, 0.8)",
    },
    text: {
      primary: "#0F172A", // Slate-900
      secondary: "#475569", // Slate-600
    },
    success: {
      main: "#10B981", // Emerald-500
    },
    warning: {
      main: "#FFB703", // Amber-500
    },
    error: {
      main: "#F43F5E", // Rose-500
    },
    info: {
      main: "#22D3EE", // Cyan-400
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", sans-serif',
    h1: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h3: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    body1: { fontFamily: '"Inter", sans-serif' },
    body2: { fontFamily: '"Inter", sans-serif' },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});

// Vibrant Rose Theme - Bold and energetic
export const vibrantRoseTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#F43F5E", // Rose-500
      light: "#FB7185", // Rose-400
      dark: "#E11D48", // Rose-600
    },
    secondary: {
      main: "#9333EA", // Purple-600
      light: "#A855F7", // Purple-500
      dark: "#7C2D12", // Purple-800
    },
    background: {
      default: "#FDF2F8", // Rose-50
      paper: "rgba(255, 255, 255, 0.8)",
    },
    text: {
      primary: "#0F172A",
      secondary: "#475569",
    },
    success: {
      main: "#10B981",
    },
    warning: {
      main: "#FFB703",
    },
    info: {
      main: "#22D3EE",
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", sans-serif',
    h1: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h3: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(244, 63, 94, 0.15)",
        },
      },
    },
  },
});

// Cyber Cyan Theme - Futuristic and tech-inspired
export const cyberCyanTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#22D3EE", // Cyan-400
      light: "#67E8F9", // Cyan-300
      dark: "#0891B2", // Cyan-600
    },
    secondary: {
      main: "#9333EA", // Purple-600
      light: "#A855F7", // Purple-500
      dark: "#6B21A8", // Purple-800
    },
    background: {
      default: "#F0F9FF", // Sky-50
      paper: "rgba(255, 255, 255, 0.8)",
    },
    text: {
      primary: "#0F172A",
      secondary: "#475569",
    },
    success: {
      main: "#10B981",
    },
    warning: {
      main: "#FFB703",
    },
    error: {
      main: "#F43F5E",
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", sans-serif',
    h1: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h3: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
  },
  shape: {
    borderRadius: 24,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(34, 211, 238, 0.2)",
          boxShadow: "0 8px 32px rgba(34, 211, 238, 0.15)",
        },
      },
    },
  },
});

// Amber Energy Theme - Warm and energetic
export const amberEnergyTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#FFB703", // Amber-500
      light: "#FCD34D", // Amber-300
      dark: "#D97706", // Amber-600
    },
    secondary: {
      main: "#4F46E5", // Indigo-600
      light: "#6366F1", // Indigo-500
      dark: "#3730A3", // Indigo-800
    },
    background: {
      default: "#FFFBEB", // Amber-50
      paper: "rgba(255, 255, 255, 0.8)",
    },
    text: {
      primary: "#0F172A",
      secondary: "#475569",
    },
    success: {
      main: "#10B981",
    },
    warning: {
      main: "#FFB703",
    },
    error: {
      main: "#F43F5E",
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", sans-serif',
    h1: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h3: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 183, 3, 0.2)",
          boxShadow: "0 8px 32px rgba(255, 183, 3, 0.15)",
        },
      },
    },
  },
});

// Purple Gradient Theme - Mystical and elegant
export const purpleGradientTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#9333EA", // Purple-600
      light: "#A855F7", // Purple-500
      dark: "#6B21A8", // Purple-800
    },
    secondary: {
      main: "#F43F5E", // Rose-500
      light: "#FB7185", // Rose-400
      dark: "#E11D48", // Rose-600
    },
    background: {
      default: "#FAF5FF", // Purple-50
      paper: "rgba(255, 255, 255, 0.8)",
    },
    text: {
      primary: "#0F172A",
      secondary: "#475569",
    },
    success: {
      main: "#10B981",
    },
    warning: {
      main: "#FFB703",
    },
    error: {
      main: "#F43F5E",
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", sans-serif',
    h1: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h3: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
  },
  shape: {
    borderRadius: 22,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(147, 51, 234, 0.2)",
          boxShadow: "0 8px 32px rgba(147, 51, 234, 0.15)",
        },
      },
    },
  },
});

// Dark Glassmorphism Theme - Modern dark with glass effects
export const darkGlassTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4F46E5", // Indigo-600
      light: "#6366F1", // Indigo-500
      dark: "#3730A3", // Indigo-800
    },
    secondary: {
      main: "#22D3EE", // Cyan-400
      light: "#67E8F9", // Cyan-300
      dark: "#0891B2", // Cyan-600
    },
    background: {
      default: "#0F172A", // Slate-900
      paper: "rgba(30, 41, 59, 0.7)", // Slate-800 with opacity
    },
    text: {
      primary: "#F8FAFC", // Slate-50
      secondary: "#CBD5E1", // Slate-300
    },
    success: {
      main: "#10B981",
    },
    warning: {
      main: "#FFB703",
    },
    error: {
      main: "#F43F5E",
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", sans-serif',
    h1: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h3: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(30, 41, 59, 0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(79, 70, 229, 0.3)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        },
      },
    },
  },
});

export const themes: Record<string, Theme> = {
  modernIndigo: modernIndigoTheme,
  vibrantRose: vibrantRoseTheme,
  cyberCyan: cyberCyanTheme,
  amberEnergy: amberEnergyTheme,
  purpleGradient: purpleGradientTheme,
  darkGlass: darkGlassTheme,
};

export const getTheme = (themeName: string): Theme => {
  return themes[themeName] || modernIndigoTheme;
};

// Modern font configurations
export const fonts = {
  Inter: '"Inter", sans-serif',
  Poppins: '"Poppins", sans-serif',
  "Inter + Poppins": '"Inter", "Poppins", sans-serif',
  "Sora + Roboto": '"Sora", "Roboto", sans-serif',
};

export const applyFont = (theme: Theme, fontName: string): Theme => {
  const fontFamily =
    fonts[fontName as keyof typeof fonts] || fonts["Inter + Poppins"];

  return createTheme({
    ...theme,
    typography: {
      ...theme.typography,
      fontFamily,
      h1: {
        ...theme.typography.h1,
        fontFamily: fontName.includes("Poppins")
          ? '"Poppins", sans-serif'
          : fontFamily,
      },
      h2: {
        ...theme.typography.h2,
        fontFamily: fontName.includes("Poppins")
          ? '"Poppins", sans-serif'
          : fontFamily,
      },
      h3: {
        ...theme.typography.h3,
        fontFamily: fontName.includes("Poppins")
          ? '"Poppins", sans-serif'
          : fontFamily,
      },
      h4: {
        ...theme.typography.h4,
        fontFamily: fontName.includes("Poppins")
          ? '"Poppins", sans-serif'
          : fontFamily,
      },
      h5: {
        ...theme.typography.h5,
        fontFamily: fontName.includes("Poppins")
          ? '"Poppins", sans-serif'
          : fontFamily,
      },
      h6: {
        ...theme.typography.h6,
        fontFamily: fontName.includes("Poppins")
          ? '"Poppins", sans-serif'
          : fontFamily,
      },
    },
  });
};
