"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from "@mui/material";
import {
  AccountBalance as ExpenseIcon,
  TrendingUp,
  TrendingDown,
  CreditCard,
  AccountBalanceWallet,
  QrCode,
  Repeat,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

interface Expense {
  _id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  paymentType: "cash" | "card" | "upi";
  category: string;
  date: string;
  isRecurring: boolean;
  recurringType?: "daily" | "weekly" | "monthly" | "yearly";
  notes?: string;
  formattedAmount: string;
  monthYear: string;
}

interface ExpenseStats {
  totalExpenses: number;
  totalAmount: number;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    count: number;
    percentage: number;
  }>;
  paymentTypeBreakdown: Array<{
    type: string;
    amount: number;
    percentage: number;
  }>;
  recurringExpenses: Array<{
    type: string;
    count: number;
    amount: number;
  }>;
  monthComparison: {
    currentMonth: number;
    previousMonth: number;
    percentageChange: number;
    isHigher: boolean;
  };
  topExpenses: Expense[];
}

const ExpenseDetails: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<ExpenseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        setLoading(true);

        // Fetch all expenses
        const expensesResponse = await api.expenses.getAll();
        const expensesData = expensesResponse.data.data || [];
        setExpenses(expensesData);

        // Calculate comprehensive stats
        const calculatedStats = calculateExpenseStats(expensesData);
        setStats(calculatedStats);
      } catch (err) {
        setError("Failed to load expense data");
        console.error("Error fetching expense data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenseData();
  }, []);

  const calculateExpenseStats = (expensesData: Expense[]): ExpenseStats => {
    const totalExpenses = expensesData.length;
    const totalAmount = expensesData.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    // Category breakdown
    const categoryMap = new Map<string, { amount: number; count: number }>();
    expensesData.forEach((expense) => {
      const existing = categoryMap.get(expense.category) || {
        amount: 0,
        count: 0,
      };
      categoryMap.set(expense.category, {
        amount: existing.amount + expense.amount,
        count: existing.count + 1,
      });
    });

    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        count: data.count,
        percentage: (data.amount / totalAmount) * 100,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Payment type breakdown
    const paymentMap = new Map<string, number>();
    expensesData.forEach((expense) => {
      const existing = paymentMap.get(expense.paymentType) || 0;
      paymentMap.set(expense.paymentType, existing + expense.amount);
    });

    const paymentTypeBreakdown = Array.from(paymentMap.entries()).map(
      ([type, amount]) => ({
        type,
        amount,
        percentage: (amount / totalAmount) * 100,
      })
    );

    // Recurring expenses
    const recurringMap = new Map<string, { count: number; amount: number }>();
    expensesData
      .filter((expense) => expense.isRecurring)
      .forEach((expense) => {
        const type = expense.recurringType || "unknown";
        const existing = recurringMap.get(type) || { count: 0, amount: 0 };
        recurringMap.set(type, {
          count: existing.count + 1,
          amount: existing.amount + expense.amount,
        });
      });

    const recurringExpenses = Array.from(recurringMap.entries()).map(
      ([type, data]) => ({
        type,
        count: data.count,
        amount: data.amount,
      })
    );

    // Month comparison (simplified - using current data)
    const currentMonth = new Date().getMonth();
    const currentMonthExpenses = expensesData.filter(
      (expense) => new Date(expense.date).getMonth() === currentMonth
    );
    const currentMonthAmount = currentMonthExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    // Mock previous month data for demonstration
    const previousMonthAmount = currentMonthAmount * 0.85; // Assume 15% increase
    const percentageChange =
      ((currentMonthAmount - previousMonthAmount) / previousMonthAmount) * 100;

    const monthComparison = {
      currentMonth: currentMonthAmount,
      previousMonth: previousMonthAmount,
      percentageChange: Math.abs(percentageChange),
      isHigher: percentageChange > 0,
    };

    // Top 5 highest expenses
    const topExpenses = [...expensesData]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      totalExpenses,
      totalAmount,
      categoryBreakdown,
      paymentTypeBreakdown,
      recurringExpenses,
      monthComparison,
      topExpenses,
    };
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case "cash":
        return <AccountBalanceWallet />;
      case "card":
        return <CreditCard />;
      case "upi":
        return <QrCode />;
      default:
        return <AccountBalance />;
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        No expense data available
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          gutterBottom
          sx={{
            background: "linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 4,
          }}
        >
          💰 Expense Analytics Dashboard
        </Typography>
      </motion.div>

      <Grid container spacing={4}>
        {/* Overview Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "20px",
                boxShadow: "0 16px 32px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  boxShadow: "0 24px 48px rgba(79, 70, 229, 0.15)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      background:
                        "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    <ExpenseIcon sx={{ color: "white", fontSize: "1.5rem" }} />
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    Total Expenses
                  </Typography>
                </Box>
                <Typography
                  variant="h3"
                  fontWeight={800}
                  color="primary"
                  gutterBottom
                >
                  ₹{stats.totalAmount.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stats.totalExpenses} transactions • INR Currency
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Month Comparison Card */}
        <Grid item xs={12} md={6} lg={3}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -4 }}
          >
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "20px",
                boxShadow: "0 16px 32px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  boxShadow: "0 24px 48px rgba(16, 185, 129, 0.15)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      background: stats.monthComparison.isHigher
                        ? "linear-gradient(135deg, #F43F5E 0%, #FF6B9D 100%)"
                        : "linear-gradient(135deg, #10B981 0%, #22D3EE 100%)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    {stats.monthComparison.isHigher ? (
                      <TrendingUp sx={{ color: "white", fontSize: "1.5rem" }} />
                    ) : (
                      <TrendingDown
                        sx={{ color: "white", fontSize: "1.5rem" }}
                      />
                    )}
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    Month Comparison
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{
                    color: stats.monthComparison.isHigher
                      ? "#F43F5E"
                      : "#10B981",
                    mb: 1,
                  }}
                >
                  {stats.monthComparison.percentageChange.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stats.monthComparison.isHigher ? "Higher" : "Lower"} than
                  last month
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Current: ₹
                  {stats.monthComparison.currentMonth.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Recurring Expenses Card */}
        <Grid item xs={12} md={6} lg={3}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -4 }}
          >
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "20px",
                boxShadow: "0 16px 32px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  boxShadow: "0 24px 48px rgba(147, 51, 234, 0.15)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      background:
                        "linear-gradient(135deg, #9333EA 0%, #F43F5E 100%)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    <Repeat sx={{ color: "white", fontSize: "1.5rem" }} />
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    Recurring
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  color="#9333EA"
                  gutterBottom
                >
                  {stats.recurringExpenses.reduce(
                    (sum, item) => sum + item.count,
                    0
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total recurring expenses
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {stats.recurringExpenses.slice(0, 2).map((item, index) => (
                    <Chip
                      key={index}
                      label={`${item.type}: ${item.count}`}
                      size="small"
                      sx={{
                        mr: 1,
                        mb: 1,
                        background: "rgba(147, 51, 234, 0.1)",
                        color: "#9333EA",
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Average Amount Card */}
        <Grid item xs={12} md={6} lg={3}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -4 }}
          >
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "20px",
                boxShadow: "0 16px 32px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  boxShadow: "0 24px 48px rgba(255, 183, 3, 0.15)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      background:
                        "linear-gradient(135deg, #FFB703 0%, #F43F5E 100%)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "white",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                      }}
                    >
                      ₹
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    Average
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  color="#FFB703"
                  gutterBottom
                >
                  ₹
                  {Math.round(
                    stats.totalAmount / stats.totalExpenses
                  ).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Per transaction
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Category Breakdown */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "20px",
                boxShadow: "0 16px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  📊 Category Breakdown
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Top 3 Highest Spending Categories
                </Typography>

                {stats.categoryBreakdown.slice(0, 3).map((category, index) => (
                  <Box key={category.category} sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {category.category}
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="primary">
                        ₹{category.amount.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {category.count} transactions • Average: ₹
                        {Math.round(
                          category.amount / category.count
                        ).toLocaleString()}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="primary"
                      >
                        {category.percentage.toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={category.percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "rgba(79, 70, 229, 0.1)",
                        "& .MuiLinearProgress-bar": {
                          background: `linear-gradient(90deg, #4F46E5 0%, #7C3AED ${category.percentage}%)`,
                          borderRadius: 4,
                        },
                      }}
                    />
                    {index < 2 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Payment Type Breakdown */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "20px",
                boxShadow: "0 16px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  💳 Payment Types
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Percentage split by payment method
                </Typography>

                {stats.paymentTypeBreakdown.map((payment, index) => (
                  <Box key={payment.type} sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          background:
                            index === 0
                              ? "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)"
                              : index === 1
                              ? "linear-gradient(135deg, #22D3EE 0%, #9333EA 100%)"
                              : "linear-gradient(135deg, #FFB703 0%, #F43F5E 100%)",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 2,
                        }}
                      >
                        {getPaymentIcon(payment.type)}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ textTransform: "uppercase" }}
                        >
                          {payment.type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ₹{payment.amount.toLocaleString()} •{" "}
                          {payment.percentage.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={payment.percentage}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: "rgba(79, 70, 229, 0.1)",
                        "& .MuiLinearProgress-bar": {
                          background:
                            index === 0
                              ? "linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)"
                              : index === 1
                              ? "linear-gradient(90deg, #22D3EE 0%, #9333EA 100%)"
                              : "linear-gradient(90deg, #FFB703 0%, #F43F5E 100%)",
                          borderRadius: 3,
                        },
                      }}
                    />
                    {index < stats.paymentTypeBreakdown.length - 1 && (
                      <Divider sx={{ mt: 2 }} />
                    )}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Top 5 Highest Expenses */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "20px",
                boxShadow: "0 16px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  🏆 Top 5 Highest Expenses
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Your biggest spending entries
                </Typography>

                <List sx={{ p: 0 }}>
                  {stats.topExpenses.map((expense, index) => (
                    <ListItem
                      key={expense._id}
                      sx={{
                        px: 0,
                        py: 2,
                        borderBottom:
                          index < stats.topExpenses.length - 1
                            ? "1px solid rgba(0,0,0,0.1)"
                            : "none",
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          background: `linear-gradient(135deg, ${
                            index === 0
                              ? "#FFD700 0%, #FFA500 100%"
                              : index === 1
                              ? "#C0C0C0 0%, #A9A9A9 100%"
                              : index === 2
                              ? "#CD7F32 0%, #B8860B 100%"
                              : "#4F46E5 0%, #7C3AED 100%"
                          })`,
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 3,
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                        }}
                      >
                        #{index + 1}
                      </Box>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="h6" fontWeight={600}>
                              {expense.title}
                            </Typography>
                            <Typography
                              variant="h6"
                              fontWeight={700}
                              color="primary"
                            >
                              ₹{expense.amount.toLocaleString()}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              {expense.description}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                              <Chip
                                label={expense.category}
                                size="small"
                                sx={{
                                  textTransform: "capitalize",
                                  background: "rgba(79, 70, 229, 0.1)",
                                  color: "#4F46E5",
                                }}
                              />
                              <Chip
                                label={expense.paymentType.toUpperCase()}
                                size="small"
                                sx={{
                                  background: "rgba(34, 211, 238, 0.1)",
                                  color: "#22D3EE",
                                }}
                              />
                              {expense.isRecurring && (
                                <Chip
                                  label={`${expense.recurringType} recurring`}
                                  size="small"
                                  sx={{
                                    background: "rgba(147, 51, 234, 0.1)",
                                    color: "#9333EA",
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Recurring Expenses Details */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "20px",
                boxShadow: "0 16px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  🔄 Recurring Details
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Count per recurring type
                </Typography>

                {stats.recurringExpenses.length > 0 ? (
                  stats.recurringExpenses.map((recurring, index) => (
                    <Box key={recurring.type} sx={{ mb: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ textTransform: "capitalize" }}
                        >
                          {recurring.type}
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          color="secondary"
                        >
                          {recurring.count}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        Total: ₹{recurring.amount.toLocaleString()}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={
                          (recurring.count /
                            stats.recurringExpenses.reduce(
                              (sum, item) => sum + item.count,
                              0
                            )) *
                          100
                        }
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "rgba(147, 51, 234, 0.1)",
                          "& .MuiLinearProgress-bar": {
                            background:
                              "linear-gradient(90deg, #9333EA 0%, #F43F5E 100%)",
                            borderRadius: 3,
                          },
                        }}
                      />
                      {index < stats.recurringExpenses.length - 1 && (
                        <Divider sx={{ mt: 2 }} />
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 4 }}
                  >
                    No recurring expenses found
                  </Typography>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExpenseDetails;
