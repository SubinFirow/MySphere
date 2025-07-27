"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { useTheme } from "@/components/ThemeProvider";
import { motion } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeightEntry {
  _id: string;
  date: string;
  weight: number;
  bmi?: number;
  notes?: string;
}

interface WeightTrendChartProps {
  data: WeightEntry[];
}

export default function WeightTrendChart({ data }: WeightTrendChartProps) {
  const { mode, colors } = useTheme();

  // Sort data by date and take last 10 entries
  const sortedData = data
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10);

  const chartData = {
    labels: sortedData.map((entry) =>
      new Date(entry.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        label: "Weight (kg)",
        data: sortedData.map((entry) => entry.weight),
        borderColor: mode === "light" ? colors.accent.primary : colors.accent.primary,
        backgroundColor: mode === "light" ? colors.accent.secondary : colors.accent.secondary,
        borderWidth: 3,
        pointBackgroundColor: mode === "light" ? colors.accent.primary : colors.accent.primary,
        pointBorderColor: mode === "light" ? colors.background.paper : colors.background.paper,
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: mode === "light" ? colors.background.paper : colors.background.paper,
        titleColor: colors.text.primary,
        bodyColor: colors.text.primary,
        borderColor: mode === "light" ? colors.accent.primary : colors.accent.primary,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => `Weight: ${context.parsed.y} kg`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: colors.text.secondary,
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: mode === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
        },
        ticks: {
          color: colors.text.secondary,
          font: {
            size: 12,
          },
          callback: (value) => `${value} kg`,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{ height: "300px", width: "100%" }}
    >
      <Line data={chartData} options={options} />
    </motion.div>
  );
}
