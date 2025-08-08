"use client";

import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import ExpenseDetails from "@/components/ExpenseDetails";

const HomePage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Box sx={{ mb: 6, textAlign: "center", py: 4 }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                mb: 3,
                background:
                  "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #F43F5E 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-2px",
              }}
            >
              MySphere Dashboard
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "text.secondary",
                fontWeight: 400,
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Your comprehensive expense tracking and analytics
            </Typography>
          </motion.div>
        </Box>
      </motion.div>

      {/* Expense Details Component */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      >
        <ExpenseDetails />
      </motion.div>
    </Container>
  );
};

export default HomePage;
