"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface WorkoutStats {
  daysSinceStart: number;
  totalWorkouts: number;
  currentWeekWorkouts: number;
  completionRate: number;
  weeklyData?: { week: string; workouts: number }[];
}

interface WorkoutActivityChartProps {
  data: WorkoutStats;
}

export default function WorkoutActivityChart({ data }: WorkoutActivityChartProps) {
  const { mode, colors } = useTheme();

  // Generate weekly data if not provided
  const weeklyData = data.weeklyData || [
    { week: "Week 1", workouts: 3 },
    { week: "Week 2", workouts: 4 },
    { week: "Week 3", workouts: 2 },
    { week: "Week 4", workouts: 4 },
    { week: "Week 5", workouts: 3 },
    { week: "Week 6", workouts: 4 },
    { week: "Current", workouts: data.currentWeekWorkouts },
  ];

  const chartData = {
    labels: weeklyData.map((item) => item.week),
    datasets: [
      {
        label: "Workouts",
        data: weeklyData.map((item) => item.workouts),
        backgroundColor: weeklyData.map((item, index) =>
          index === weeklyData.length - 1
            ? mode === "light" ? colors.accent.primary : colors.accent.primary
            : mode === "light" ? colors.accent.secondary : colors.accent.secondary
        ),
        borderColor: mode === "light" ? colors.accent.primary : colors.accent.primary,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
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
          label: (context) => `Workouts: ${context.parsed.y}`,
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
        beginAtZero: true,
        max: 5,
        grid: {
          color: mode === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
        },
        ticks: {
          color: colors.text.secondary,
          font: {
            size: 12,
          },
          stepSize: 1,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
      delay: (context) => context.dataIndex * 100,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      style={{ height: "300px", width: "100%" }}
    >
      <Bar data={chartData} options={options} />
    </motion.div>
  );
}
