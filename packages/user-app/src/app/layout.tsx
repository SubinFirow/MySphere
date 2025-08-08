"use client";

// import type { Metadata } from "next";
import { Inter, Roboto, Poppins, Sora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/layout/Header";
import { useTheme } from "@/components/ThemeProvider";
import { Box } from "@mui/material";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { currentTheme, currentFont, changeTheme, changeFont } = useTheme();

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Header
        onThemeChange={changeTheme}
        onFontChange={changeFont}
        currentTheme={currentTheme}
        currentFont={currentFont}
      />
      <main>{children}</main>
    </Box>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>MySphere - Personal Dashboard</title>
        <meta
          name="description"
          content="Your personal dashboard for life management"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </head>
      <body
        className={`${inter.variable} ${roboto.variable} ${poppins.variable} ${sora.variable} antialiased`}
      >
        <ThemeProvider>
          <LayoutContent>{children}</LayoutContent>
        </ThemeProvider>
      </body>
    </html>
  );
}
