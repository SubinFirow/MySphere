"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Palette as ThemeIcon,
  TextFields as FontIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

interface HeaderProps {
  onThemeChange: (theme: string) => void;
  onFontChange: (font: string) => void;
  currentTheme: string;
  currentFont: string;
}

const Header: React.FC<HeaderProps> = ({
  onThemeChange,
  onFontChange,
  currentTheme,
  currentFont,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [themeMenuAnchor, setThemeMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [fontMenuAnchor, setFontMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setThemeMenuAnchor(null);
    setFontMenuAnchor(null);
  };

  const handleThemeMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setThemeMenuAnchor(event.currentTarget);
  };

  const handleFontMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setFontMenuAnchor(event.currentTarget);
  };

  const themes = [
    { name: "Modern Indigo", value: "modernIndigo" },
    { name: "Vibrant Rose", value: "vibrantRose" },
    { name: "Cyber Cyan", value: "cyberCyan" },
    { name: "Amber Energy", value: "amberEnergy" },
    { name: "Purple Gradient", value: "purpleGradient" },
    { name: "Dark Glass", value: "darkGlass" },
  ];

  const fonts = [
    { name: "Inter + Poppins", value: "Inter + Poppins" },
    { name: "Sora + Roboto", value: "Sora + Roboto" },
    { name: "Inter", value: "Inter" },
    { name: "Poppins", value: "Poppins" },
  ];

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 2 }}>
          {/* Brand Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  background:
                    "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                  color: "white",
                  boxShadow: "0 8px 32px rgba(79, 70, 229, 0.3)",
                  cursor: "pointer",
                }}
              >
                M
              </Box>
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  letterSpacing: "-1px",
                  background:
                    "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  cursor: "pointer",
                }}
              >
                MySphere
              </Typography>
            </Box>
          </motion.div>

          {/* Profile Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <IconButton
                onClick={handleProfileClick}
                sx={{
                  p: 0,
                  background:
                    "linear-gradient(135deg, #22D3EE 0%, #67E8F9 100%)",
                  borderRadius: "16px",
                  width: 48,
                  height: 48,
                  boxShadow: "0 8px 32px rgba(34, 211, 238, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #0891B2 0%, #22D3EE 100%)",
                    boxShadow: "0 12px 40px rgba(34, 211, 238, 0.4)",
                  },
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <PersonIcon sx={{ color: "white", fontSize: "1.5rem" }} />
              </IconButton>
            </motion.div>

            {/* Profile Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  mt: 2,
                  minWidth: 240,
                  borderRadius: "20px",
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                  "& .MuiMenuItem-root": {
                    borderRadius: "12px",
                    mx: 2,
                    my: 1,
                    px: 3,
                    py: 2,
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      background: "rgba(79, 70, 229, 0.1)",
                      transform: "translateX(4px)",
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleThemeMenuClick}>
                <ListItemIcon>
                  <ThemeIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Theme ({currentTheme})</ListItemText>
              </MenuItem>

              <MenuItem onClick={handleFontMenuClick}>
                <ListItemIcon>
                  <FontIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Font ({currentFont})</ListItemText>
              </MenuItem>

              <Divider sx={{ my: 1 }} />

              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>

              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>

            {/* Theme Submenu */}
            <Menu
              anchorEl={themeMenuAnchor}
              open={Boolean(themeMenuAnchor)}
              onClose={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  minWidth: 200,
                  borderRadius: "16px",
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 16px 32px rgba(0, 0, 0, 0.1)",
                  "& .MuiMenuItem-root": {
                    borderRadius: "10px",
                    mx: 1.5,
                    my: 0.5,
                    px: 2.5,
                    py: 1.5,
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      background: "rgba(79, 70, 229, 0.1)",
                      transform: "scale(1.02)",
                    },
                  },
                },
              }}
            >
              {themes.map((theme) => (
                <MenuItem
                  key={theme.value}
                  onClick={() => {
                    onThemeChange(theme.value);
                    handleClose();
                  }}
                  selected={currentTheme === theme.value}
                >
                  {theme.name}
                </MenuItem>
              ))}
            </Menu>

            {/* Font Submenu */}
            <Menu
              anchorEl={fontMenuAnchor}
              open={Boolean(fontMenuAnchor)}
              onClose={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  minWidth: 200,
                  borderRadius: "16px",
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 16px 32px rgba(0, 0, 0, 0.1)",
                  "& .MuiMenuItem-root": {
                    borderRadius: "10px",
                    mx: 1.5,
                    my: 0.5,
                    px: 2.5,
                    py: 1.5,
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      background: "rgba(34, 211, 238, 0.1)",
                      transform: "scale(1.02)",
                    },
                  },
                },
              }}
            >
              {fonts.map((font) => (
                <MenuItem
                  key={font.value}
                  onClick={() => {
                    onFontChange(font.value);
                    handleClose();
                  }}
                  selected={currentFont === font.value}
                  sx={{ fontFamily: font.value }}
                >
                  {font.name}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
};

export default Header;
