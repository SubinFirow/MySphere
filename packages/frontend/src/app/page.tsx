"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Button,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  CheckCircle,
  Cancel,
  Code,
  Web,
} from "@mui/icons-material";
import { useTheme } from "@/components/ThemeProvider";
import { apiClient } from "@/lib/api";

export default function Home() {
  const { mode, toggleTheme } = useTheme();
  const [backendStatus, setBackendStatus] = useState<string>("Checking...");
  const [backendData, setBackendData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await apiClient.health();
        setBackendStatus("Connected");
        setBackendData(response.data);
        setIsConnected(true);
      } catch (error) {
        setBackendStatus("Disconnected");
        setIsConnected(false);
        console.error("Backend connection failed:", error);
      }
    };

    checkBackend();
  }, []);

  return (
    <>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MySphere
          </Typography>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to MySphere
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            A modern monorepo with Express.js backend and Next.js frontend
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Backend Status Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Code sx={{ mr: 1 }} />
                  <Typography variant="h5" component="h2">
                    Backend Status
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Chip
                    icon={isConnected ? <CheckCircle /> : <Cancel />}
                    label={backendStatus}
                    color={isConnected ? "success" : "error"}
                    variant="outlined"
                  />
                </Box>
                {backendData && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Uptime:</strong> {Math.floor(backendData.uptime)}{" "}
                      seconds
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Timestamp:</strong>{" "}
                      {new Date(backendData.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Frontend Info Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Web sx={{ mr: 1 }} />
                  <Typography variant="h5" component="h2">
                    Frontend Info
                  </Typography>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                  <Chip label="Next.js 15" color="primary" variant="outlined" />
                  <Chip
                    label="Material-UI"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip label="TypeScript" color="primary" variant="outlined" />
                  <Chip label="Axios" color="primary" variant="outlined" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Modern React framework with server-side rendering and
                  Material-UI components
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Tech Stack Card */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Tech Stack Overview
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Backend Technologies
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography variant="body2">
                        • Express.js - Web framework
                      </Typography>
                      <Typography variant="body2">
                        • MongoDB - Database
                      </Typography>
                      <Typography variant="body2">• Mongoose - ODM</Typography>
                      <Typography variant="body2">
                        • JWT - Authentication
                      </Typography>
                      <Typography variant="body2">
                        • Helmet - Security
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Frontend Technologies
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography variant="body2">
                        • Next.js 15 - React framework
                      </Typography>
                      <Typography variant="body2">
                        • Material-UI - Component library
                      </Typography>
                      <Typography variant="body2">
                        • TypeScript - Type safety
                      </Typography>
                      <Typography variant="body2">
                        • Axios - HTTP client
                      </Typography>
                      <Typography variant="body2">
                        • ESLint - Code linting
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box textAlign="center" mt={6}>
          <Typography variant="body1" color="text.secondary" paragraph>
            Start building your application by editing the files in{" "}
            <code
              style={{
                backgroundColor: mode === "dark" ? "#333" : "#f5f5f5",
                padding: "2px 6px",
                borderRadius: "4px",
              }}
            >
              packages/backend
            </code>{" "}
            and{" "}
            <code
              style={{
                backgroundColor: mode === "dark" ? "#333" : "#f5f5f5",
                padding: "2px 6px",
                borderRadius: "4px",
              }}
            >
              packages/frontend
            </code>
          </Typography>
        </Box>
      </Container>
    </>
  );
}
