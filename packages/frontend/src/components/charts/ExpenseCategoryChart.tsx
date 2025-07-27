"use client";

import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { useTheme } from "@/components/ThemeProvider";
import { motion } from "framer-motion";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpenseAnalytics {
  totalExpenses: number;
  monthlyTotal: number;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  paymentTypeBreakdown: Array<{
    type: string;
    amount: number;
    percentage: number;
  }>;
  recentExpenses: number;
  categoriesCount: number;
}

interface ExpenseCategoryChartProps {
  data: ExpenseAnalytics;
}

export default function ExpenseCategoryChart({
  data,
}: ExpenseCategoryChartProps) {
  const { mode, colors } = useTheme();

  // Generate colors for categories
  const generateColors = (count: number) => {
    const baseColors = [
      mode === "light" ? colors.accent.primary : colors.accent.primary,
      mode === "light" ? colors.accent.secondary : colors.accent.secondary,
      mode === "light" ? "#F1BA88" : "#FB773C",
      mode === "light" ? "#81E7AF" : "#EB3678",
      mode === "light" ? "#03A791" : "#4F1787",
    ];

    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(baseColors[i % baseColors.length]);
    }
    return result;
  };

  const categoryData =
    data.categoryBreakdown?.length > 0
      ? data.categoryBreakdown
      : [
          { category: "Food & Dining", amount: 35, percentage: 0 },
          { category: "Transportation", amount: 20, percentage: 0 },
          { category: "Shopping", amount: 15, percentage: 0 },
          { category: "Entertainment", amount: 12, percentage: 0 },
          { category: "Bills & Utilities", amount: 10, percentage: 0 },
          { category: "Others", amount: 8, percentage: 0 },
        ];

  const categories = categoryData.map((item) => item.category);
  const values = categoryData.map((item) => item.amount);
  const backgroundColors = generateColors(categories.length);

  const chartData = {
    labels: categories,
    datasets: [
      {
        data: values,
        backgroundColor: backgroundColors,
        borderColor:
          mode === "light"
            ? colors.background.default
            : colors.background.default,
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: colors.text.primary,
          font: {
            size: 12,
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor:
          mode === "light" ? colors.background.paper : colors.background.paper,
        titleColor: colors.text.primary,
        bodyColor: colors.text.primary,
        borderColor:
          mode === "light" ? colors.accent.primary : colors.accent.primary,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${percentage}%`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: "easeInOutQuart",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      style={{ height: "300px", width: "100%" }}
    >
      <Doughnut data={chartData} options={options} />
    </motion.div>
  );
}
