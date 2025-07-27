"use client";

import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Paper,
  Chip,
  Avatar,
} from "@mui/material";
import {
  FitnessCenter as WorkoutIcon,
  AccountBalance as ExpenseIcon,
  MonitorWeight as WeightIcon,
  Business as WholesaleIcon,
  TrendingUp,
  TrendingDown,
  Timeline,
  Analytics,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { apiClient } from "@/lib/api";
import WeightTrendChart from "@/components/charts/WeightTrendChart";
import ExpenseCategoryChart from "@/components/charts/ExpenseCategoryChart";
import WorkoutActivityChart from "@/components/charts/WorkoutActivityChart";

interface WorkoutStats {
  daysSinceStart: number;
  totalWorkouts: number;
  totalWorkoutDays: number;
  currentWeek: number;
  currentWeekWorkouts: number;
  weeklyProgress: number;
  completionRate: number;
  weeklyData?: { week: string; workouts: number }[];
}

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

interface BodyWeightAnalytics {
  totalEntries: number;
  averageWeight: number;
  latestWeight: number;
  weightTrend: number;
  minWeight: number;
  maxWeight: number;
  totalWeightChange: number;
  averageBodyFat?: number;
  averageMuscleMass?: number;
  averageBMI?: number;
  firstEntry?: {
    date: string;
    weight: number;
    unit: string;
  };
  latestEntry?: {
    date: string;
    weight: number;
    unit: string;
  };
}

interface WholesaleAnalytics {
  totalBatches: number;
  totalInvestment: number;
  totalPotentialProfit: number;
  averageInvestmentPerBatch: number;
  totalPotentialReturn: number;
  overallProfitMargin: string;
}

export default function Home() {
  const { mode, colors } = useTheme();
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats | null>(null);
  const [expenseAnalytics, setExpenseAnalytics] =
    useState<ExpenseAnalytics | null>(null);
  const [bodyWeightAnalytics, setBodyWeightAnalytics] =
    useState<BodyWeightAnalytics | null>(null);
  const [bodyWeightData, setBodyWeightData] = useState<
    Array<{
      _id: string;
      date: string;
      weight: number;
      bmi?: number;
      notes?: string;
    }>
  >([]);
  const [wholesaleAnalytics, setWholesaleAnalytics] =
    useState<WholesaleAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateWorkoutStats();
    loadExpenseAnalytics();
    loadBodyWeightAnalytics();
    loadBodyWeightData();
    loadWholesaleAnalytics();
  }, []);

  const calculateWorkoutStats = () => {
    const startDate = new Date("2024-08-19");
    const currentDate = new Date();

    // Calculate days since start
    const daysSinceStart = Math.floor(
      (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Calculate total workout days (4 days per week)
    const weeksSinceStart = daysSinceStart / 7;
    const totalWorkoutDays = Math.floor(weeksSinceStart * 4);

    // Calculate current week and weekly progress
    const currentWeek = Math.floor(weeksSinceStart) + 1;
    const daysInCurrentWeek = daysSinceStart % 7;
    const expectedWorkoutsThisWeek = Math.min(
      4,
      Math.floor((daysInCurrentWeek * 4) / 7)
    );
    const weeklyProgress = (expectedWorkoutsThisWeek / 4) * 100;

    // Calculate completion rate (assuming consistent 4 days/week)
    const expectedTotalWorkouts = Math.floor(weeksSinceStart) * 4;
    const completionRate =
      expectedTotalWorkouts > 0
        ? (totalWorkoutDays / expectedTotalWorkouts) * 100
        : 100;

    setWorkoutStats({
      daysSinceStart,
      totalWorkouts: totalWorkoutDays,
      totalWorkoutDays,
      currentWeek,
      currentWeekWorkouts: expectedWorkoutsThisWeek,
      weeklyProgress,
      completionRate,
    });
  };

  const loadExpenseAnalytics = async () => {
    try {
      const [summaryRes, , categoriesRes, statsRes] = await Promise.all([
        apiClient.expenses.analytics.getSummary("monthly"),
        apiClient.expenses.analytics.getTrends(3),
        apiClient.expenses.analytics.getTopCategories("monthly", 5),
        apiClient.expenses.analytics.getStats(),
      ]);

      // Process the analytics data
      const summary = (summaryRes.data as Record<string, unknown>)
        .data as Record<string, unknown>;
      const categories = (categoriesRes.data as Record<string, unknown>)
        .data as Record<string, unknown>;
      const stats = (statsRes.data as Record<string, unknown>).data as Record<
        string,
        unknown
      >;

      // Transform categories data to match expected format
      const categoryData =
        (
          categories as {
            categories?: Array<{
              category: string;
              total: number;
              count: number;
            }>;
          }
        )?.categories || [];
      const categoryBreakdown = categoryData.map((cat) => ({
        category: cat.category,
        amount: cat.total,
        percentage: 0, // Will be calculated if needed
      }));

      // Transform payment type data
      const paymentData =
        (
          summary as {
            paymentTypeBreakdown?: Array<{
              _id: string;
              total: number;
              count: number;
            }>;
          }
        )?.paymentTypeBreakdown || [];
      const paymentTypeBreakdown = paymentData.map((payment) => ({
        type: payment._id,
        amount: payment.total,
        percentage: 0, // Will be calculated if needed
      }));

      setExpenseAnalytics({
        totalExpenses:
          (stats as { overall?: { totalExpenses?: number } })?.overall
            ?.totalExpenses || 0,
        monthlyTotal:
          (summary as { summary?: { totalAmount?: number } })?.summary
            ?.totalAmount || 0,
        categoryBreakdown,
        paymentTypeBreakdown,
        recentExpenses:
          (summary as { summary?: { totalTransactions?: number } })?.summary
            ?.totalTransactions || 0,
        categoriesCount: categoryBreakdown.length,
      });
    } catch (error) {
      console.error("Error loading expense analytics:", error);
      setExpenseAnalytics({
        totalExpenses: 0,
        monthlyTotal: 0,
        categoryBreakdown: [],
        paymentTypeBreakdown: [],
        recentExpenses: 0,
        categoriesCount: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadBodyWeightAnalytics = async () => {
    try {
      const [summaryRes, statsRes] = await Promise.all([
        apiClient.bodyWeight.analytics.getSummary("monthly"),
        apiClient.bodyWeight.analytics.getStats(),
      ]);

      const summary = (summaryRes.data as Record<string, unknown>)
        .data as Record<string, unknown>;
      const stats = (statsRes.data as Record<string, unknown>).data as Record<
        string,
        unknown
      >;

      setBodyWeightAnalytics({
        totalEntries: (stats as { totalEntries?: number })?.totalEntries || 0,
        averageWeight:
          (stats as { averageWeight?: number })?.averageWeight || 0,
        latestWeight:
          (summary as { summary?: { latestWeight?: number } })?.summary
            ?.latestWeight || 0,
        weightTrend:
          (summary as { summary?: { weightTrend?: number } })?.summary
            ?.weightTrend || 0,
        minWeight: (stats as { minWeight?: number })?.minWeight || 0,
        maxWeight: (stats as { maxWeight?: number })?.maxWeight || 0,
        totalWeightChange:
          (stats as { totalWeightChange?: number })?.totalWeightChange || 0,
        averageBodyFat:
          (stats as { averageBodyFat?: number })?.averageBodyFat || undefined,
        averageMuscleMass:
          (stats as { averageMuscleMass?: number })?.averageMuscleMass ||
          undefined,
        averageBMI: (stats as { averageBMI?: number })?.averageBMI || undefined,
        firstEntry:
          (
            stats as {
              firstEntry?: { date: string; weight: number; unit: string };
            }
          )?.firstEntry || undefined,
        latestEntry:
          (
            stats as {
              latestEntry?: { date: string; weight: number; unit: string };
            }
          )?.latestEntry || undefined,
      });
    } catch (error) {
      console.error("Error loading body weight analytics:", error);
      setBodyWeightAnalytics({
        totalEntries: 0,
        averageWeight: 0,
        latestWeight: 0,
        weightTrend: 0,
        minWeight: 0,
        maxWeight: 0,
        totalWeightChange: 0,
      });
    }
  };

  const loadBodyWeightData = async () => {
    try {
      const response = await apiClient.bodyWeight.getAll();
      const data = (response.data as Record<string, unknown>).data as Array<{
        _id: string;
        date: string;
        weight: number;
        bmi?: number;
        notes?: string;
      }>;
      setBodyWeightData(data || []);
    } catch (error) {
      console.error("Error loading body weight data:", error);
      setBodyWeightData([]);
    }
  };

  const loadWholesaleAnalytics = async () => {
    try {
      const statsRes = await apiClient.wholesale.analytics.getStats();

      const stats = (statsRes.data as Record<string, unknown>).data as Record<
        string,
        unknown
      >;

      setWholesaleAnalytics({
        totalBatches: (stats as { totalBatches?: number })?.totalBatches || 0,
        totalInvestment:
          (stats as { totalInvestment?: number })?.totalInvestment || 0,
        totalPotentialProfit:
          (stats as { totalPotentialProfit?: number })?.totalPotentialProfit ||
          0,
        averageInvestmentPerBatch:
          (stats as { averageInvestmentPerBatch?: number })
            ?.averageInvestmentPerBatch || 0,
        totalPotentialReturn:
          (stats as { totalPotentialReturn?: number })?.totalPotentialReturn ||
          0,
        overallProfitMargin:
          (stats as { overallProfitMargin?: string })?.overallProfitMargin ||
          "0",
      });
    } catch (error) {
      console.error("Error loading wholesale analytics:", error);
      setWholesaleAnalytics({
        totalBatches: 0,
        totalInvestment: 0,
        totalPotentialProfit: 0,
        averageInvestmentPerBatch: 0,
        totalPotentialReturn: 0,
        overallProfitMargin: "0",
      });
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress size={60} />
        </motion.div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${colors.background.default} 0%, ${colors.background.paper} 100%)`,
        minHeight: "100vh",
        p: 3,
      }}
    >
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box mb={4}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight={700}
            sx={{
              background: `linear-gradient(45deg, ${colors.accent.primary}, ${colors.accent.secondary})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            MySphere Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ opacity: 0.8 }}>
            Welcome back! Track your fitness, expenses, body weight, and
            wholesale business.
          </Typography>
        </Box>
      </motion.div>

      {/* Comprehensive Analytics Overview */}
      <Box sx={{ mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            sx={{
              p: 4,
              background: `linear-gradient(135deg, ${colors.background.paper}, ${colors.background.widget})`,
              border: `1px solid ${
                colors.borders?.primary || colors.accent.quaternary
              }`,
            }}
          >
            <Typography variant="h4" fontWeight={700} gutterBottom>
              📊 Complete Analytics Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Comprehensive analysis of all your data across expenses, fitness,
              body weight, and wholesale business
            </Typography>

            {/* Overall Summary Stats */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 3,
                mb: 4,
              }}
            >
              <Box textAlign="center">
                <Typography variant="h3" color="primary" fontWeight={700}>
                  {expenseAnalytics?.totalExpenses || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Transactions
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h3" color="success.main" fontWeight={700}>
                  {workoutStats?.totalWorkouts || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Workout Sessions
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h3" color="info.main" fontWeight={700}>
                  {bodyWeightAnalytics?.totalEntries || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Weight Records
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h3" color="warning.main" fontWeight={700}>
                  {wholesaleAnalytics?.totalBatches || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Business Batches
                </Typography>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Box>

      {/* Main Dashboard Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
          gap: 4,
        }}
      >
        {/* Charts Section */}
        <Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
              mb: 3,
            }}
          >
            {/* Weight Trend Chart */}
            <Box>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: 400,
                    background: `linear-gradient(135deg, ${colors.background.paper} 0%, ${colors.background.surface} 100%)`,
                    border: `1px solid ${
                      mode === "light"
                        ? "rgba(0,0,0,0.1)"
                        : "rgba(255,255,255,0.1)"
                    }`,
                    borderRadius: 3,
                  }}
                >
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      sx={{
                        bgcolor: colors.accent.primary,
                        mr: 2,
                        width: 40,
                        height: 40,
                      }}
                    >
                      <Timeline />
                    </Avatar>
                    <Typography variant="h6" fontWeight={600}>
                      Weight Trends
                    </Typography>
                  </Box>
                  <WeightTrendChart data={bodyWeightData} />
                </Paper>
              </motion.div>
            </Box>

            {/* Expense Category Chart */}
            <Box>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: 400,
                    background: `linear-gradient(135deg, ${colors.background.paper} 0%, ${colors.background.surface} 100%)`,
                    border: `1px solid ${
                      mode === "light"
                        ? "rgba(0,0,0,0.1)"
                        : "rgba(255,255,255,0.1)"
                    }`,
                    borderRadius: 3,
                  }}
                >
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      sx={{
                        bgcolor: colors.accent.secondary,
                        mr: 2,
                        width: 40,
                        height: 40,
                      }}
                    >
                      <Analytics />
                    </Avatar>
                    <Typography variant="h6" fontWeight={600}>
                      Expense Categories
                    </Typography>
                  </Box>
                  <ExpenseCategoryChart
                    data={
                      expenseAnalytics || {
                        totalExpenses: 0,
                        monthlyTotal: 0,
                        recentExpenses: 0,
                        categoriesCount: 0,
                        categoryBreakdown: [],
                        paymentTypeBreakdown: [],
                      }
                    }
                  />
                </Paper>
              </motion.div>
            </Box>
          </Box>

          {/* Workout Activity Chart */}
          <Box>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: 400,
                  background: `linear-gradient(135deg, ${colors.background.paper} 0%, ${colors.background.surface} 100%)`,
                  border: `1px solid ${
                    mode === "light"
                      ? "rgba(0,0,0,0.1)"
                      : "rgba(255,255,255,0.1)"
                  }`,
                  borderRadius: 3,
                }}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    sx={{
                      bgcolor: colors.accent.primary,
                      mr: 2,
                      width: 40,
                      height: 40,
                    }}
                  >
                    <WorkoutIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight={600}>
                    Workout Activity
                  </Typography>
                </Box>
                <WorkoutActivityChart
                  data={
                    workoutStats || {
                      daysSinceStart: 0,
                      totalWorkouts: 0,
                      totalWorkoutDays: 0,
                      currentWeek: 0,
                      currentWeekWorkouts: 0,
                      weeklyProgress: 0,
                      completionRate: 0,
                    }
                  }
                />
              </Paper>
            </motion.div>
          </Box>
        </Box>

        {/* Stats Sidebar */}
        <Box>
          <Box sx={{ display: "grid", gap: 3 }}>
            {/* Quick Stats Cards */}
            <Box>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    background: `linear-gradient(135deg, ${colors.background.paper} 0%, ${colors.background.surface} 100%)`,
                    border: `1px solid ${
                      mode === "light"
                        ? "rgba(0,0,0,0.1)"
                        : "rgba(255,255,255,0.1)"
                    }`,
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h6" fontWeight={600} mb={3}>
                    Quick Stats
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 2,
                    }}
                  >
                    {/* Workout Stats */}
                    <Box>
                      <Box textAlign="center" p={2}>
                        <Avatar
                          sx={{
                            bgcolor: colors.accent.primary,
                            mx: "auto",
                            mb: 1,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <WorkoutIcon />
                        </Avatar>
                        <Typography
                          variant="h5"
                          fontWeight={600}
                          color={colors.accent.primary}
                        >
                          {workoutStats?.totalWorkoutDays || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total Workouts
                        </Typography>
                      </Box>
                    </Box>

                    {/* Expense Stats */}
                    <Box>
                      <Box textAlign="center" p={2}>
                        <Avatar
                          sx={{
                            bgcolor: colors.accent.secondary,
                            mx: "auto",
                            mb: 1,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <ExpenseIcon />
                        </Avatar>
                        <Typography
                          variant="h5"
                          fontWeight={600}
                          color={colors.accent.secondary}
                        >
                          ₹
                          {expenseAnalytics?.monthlyTotal?.toLocaleString() ||
                            0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Monthly Expenses
                        </Typography>
                      </Box>
                    </Box>

                    {/* Weight Stats */}
                    <Box>
                      <Box textAlign="center" p={2}>
                        <Avatar
                          sx={{
                            bgcolor: colors.accent.primary,
                            mx: "auto",
                            mb: 1,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <WeightIcon />
                        </Avatar>
                        <Typography
                          variant="h5"
                          fontWeight={600}
                          color={colors.accent.primary}
                        >
                          {bodyWeightAnalytics?.latestWeight?.toFixed(1) || 0}{" "}
                          kg
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Current Weight
                        </Typography>
                      </Box>
                    </Box>

                    {/* Wholesale Stats */}
                    <Box>
                      <Box textAlign="center" p={2}>
                        <Avatar
                          sx={{
                            bgcolor: colors.accent.secondary,
                            mx: "auto",
                            mb: 1,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <WholesaleIcon />
                        </Avatar>
                        <Typography
                          variant="h5"
                          fontWeight={600}
                          color={colors.accent.secondary}
                        >
                          {wholesaleAnalytics?.totalBatches || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Wholesale Batches
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            </Box>

            {/* Performance Metrics */}
            <Box>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    background: `linear-gradient(135deg, ${colors.background.paper} 0%, ${colors.background.surface} 100%)`,
                    border: `1px solid ${
                      mode === "light"
                        ? "rgba(0,0,0,0.1)"
                        : "rgba(255,255,255,0.1)"
                    }`,
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h6" fontWeight={600} mb={3}>
                    Performance Metrics
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {/* Workout Completion Rate */}
                    <Box mb={3}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Workout Completion
                        </Typography>
                        <Chip
                          label={`${
                            workoutStats?.completionRate?.toFixed(1) || 0
                          }%`}
                          size="small"
                          sx={{
                            bgcolor: colors.accent.primary,
                            color: mode === "light" ? "#000" : "#fff",
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          height: 8,
                          bgcolor:
                            mode === "light"
                              ? "rgba(0,0,0,0.1)"
                              : "rgba(255,255,255,0.1)",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${workoutStats?.completionRate || 0}%`,
                          }}
                          transition={{ duration: 1, delay: 0.6 }}
                          style={{
                            height: "100%",
                            background: `linear-gradient(90deg, ${colors.accent.primary}, ${colors.accent.secondary})`,
                            borderRadius: 4,
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Weight Change Indicator */}
                    <Box mb={3}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Weight Change
                        </Typography>
                        <Box display="flex" alignItems="center">
                          {(bodyWeightAnalytics?.totalWeightChange || 0) > 0 ? (
                            <TrendingUp
                              sx={{ color: colors.accent.secondary, mr: 0.5 }}
                            />
                          ) : (
                            <TrendingDown
                              sx={{ color: colors.accent.primary, mr: 0.5 }}
                            />
                          )}
                          <Typography variant="body2" fontWeight={600}>
                            {(bodyWeightAnalytics?.totalWeightChange || 0) > 0
                              ? "+"
                              : ""}
                            {bodyWeightAnalytics?.totalWeightChange?.toFixed(
                              1
                            ) || 0}{" "}
                            kg
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Wholesale Profit Margin */}
                    <Box>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Profit Margin
                        </Typography>
                        <Chip
                          label={`${
                            wholesaleAnalytics?.overallProfitMargin || "0"
                          }%`}
                          size="small"
                          sx={{
                            bgcolor: colors.accent.secondary,
                            color: mode === "light" ? "#000" : "#fff",
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          height: 8,
                          bgcolor:
                            mode === "light"
                              ? "rgba(0,0,0,0.1)"
                              : "rgba(255,255,255,0.1)",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(
                              parseFloat(
                                wholesaleAnalytics?.overallProfitMargin || "0"
                              ),
                              100
                            )}%`,
                          }}
                          transition={{ duration: 1, delay: 0.7 }}
                          style={{
                            height: "100%",
                            background: `linear-gradient(90deg, ${colors.accent.secondary}, ${colors.accent.primary})`,
                            borderRadius: 4,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Detailed Text Analytics Section */}
      <Box sx={{ mt: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 4 }}>
            📈 Detailed Analytics & Insights
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" },
              gap: 4,
            }}
          >
            {/* Expense Analytics */}
            <Paper
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${colors.background.paper}, ${colors.background.widget})`,
                border: `1px solid ${
                  colors.borders?.primary || colors.accent.quaternary
                }`,
              }}
            >
              <Typography variant="h5" fontWeight={600} gutterBottom>
                💰 Financial Analysis
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" color="primary" fontWeight={600}>
                  Monthly Overview
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Current month spending: ₹
                  {expenseAnalytics?.monthlyTotal?.toLocaleString() || 0}
                </Typography>
                <Typography variant="body2">
                  • Total transactions recorded:{" "}
                  {expenseAnalytics?.totalExpenses || 0}
                </Typography>
                <Typography variant="body2">
                  • Active spending categories:{" "}
                  {expenseAnalytics?.categoriesCount || 0}
                </Typography>
                <Typography variant="body2">
                  • Recent transactions: {expenseAnalytics?.recentExpenses || 0}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" color="success.main" fontWeight={600}>
                  Spending Patterns
                </Typography>
                {expenseAnalytics?.categoryBreakdown &&
                expenseAnalytics.categoryBreakdown.length > 0 ? (
                  expenseAnalytics.categoryBreakdown
                    .slice(0, 3)
                    .map((category, index) => (
                      <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                        • {category.category}: ₹
                        {category.amount.toLocaleString()} (
                        {category.percentage.toFixed(1)}%)
                      </Typography>
                    ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No spending data available yet
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography variant="h6" color="info.main" fontWeight={600}>
                  Payment Methods
                </Typography>
                {expenseAnalytics?.paymentTypeBreakdown &&
                expenseAnalytics.paymentTypeBreakdown.length > 0 ? (
                  expenseAnalytics.paymentTypeBreakdown.map(
                    (payment, index) => (
                      <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                        • {payment.type}: ₹{payment.amount.toLocaleString()}
                      </Typography>
                    )
                  )
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No payment data available yet
                  </Typography>
                )}
              </Box>
            </Paper>

            {/* Fitness Analytics */}
            <Paper
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${colors.background.paper}, ${colors.background.widget})`,
                border: `1px solid ${
                  colors.borders?.primary || colors.accent.quaternary
                }`,
              }}
            >
              <Typography variant="h5" fontWeight={600} gutterBottom>
                🏋️ Fitness Progress
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" color="primary" fontWeight={600}>
                  Workout Journey
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Days since starting: {workoutStats?.daysSinceStart || 0}
                </Typography>
                <Typography variant="body2">
                  • Total workout sessions: {workoutStats?.totalWorkouts || 0}
                </Typography>
                <Typography variant="body2">
                  • Current week: {workoutStats?.currentWeek || 0}
                </Typography>
                <Typography variant="body2">
                  • This week&apos;s workouts:{" "}
                  {workoutStats?.currentWeekWorkouts || 0}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" color="success.main" fontWeight={600}>
                  Performance Metrics
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Completion rate:{" "}
                  {workoutStats?.completionRate?.toFixed(1) || 0}%
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Weekly progress: {workoutStats?.weeklyProgress || 0}%
                </Typography>
                <Typography variant="body2">
                  • Consistency level:{" "}
                  {(workoutStats?.completionRate || 0) >= 80
                    ? "Excellent"
                    : (workoutStats?.completionRate || 0) >= 60
                    ? "Good"
                    : (workoutStats?.completionRate || 0) >= 40
                    ? "Fair"
                    : "Needs Improvement"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" color="info.main" fontWeight={600}>
                  Recommendations
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {(workoutStats?.completionRate || 0) >= 80
                    ? "🎉 Outstanding consistency! Keep up the excellent work."
                    : (workoutStats?.completionRate || 0) >= 60
                    ? "💪 Good progress! Try to maintain 4 workouts per week."
                    : "📈 Focus on consistency. Start with 3 workouts per week."}
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* Second Row - Body Weight & Wholesale Analytics */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" },
              gap: 4,
              mt: 4,
            }}
          >
            {/* Body Weight Analytics */}
            <Paper
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${colors.background.paper}, ${colors.background.widget})`,
                border: `1px solid ${
                  colors.borders?.primary || colors.accent.quaternary
                }`,
              }}
            >
              <Typography variant="h5" fontWeight={600} gutterBottom>
                ⚖️ Body Weight Analysis
              </Typography>

              {bodyWeightAnalytics?.totalEntries === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No weight data recorded yet. Start tracking to see detailed
                  analytics.
                </Typography>
              ) : (
                <>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" color="primary" fontWeight={600}>
                      Weight Journey
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Current weight:{" "}
                      {bodyWeightAnalytics?.latestWeight?.toFixed(1) || 0} kg
                    </Typography>
                    <Typography variant="body2">
                      • Total entries: {bodyWeightAnalytics?.totalEntries || 0}
                    </Typography>
                    <Typography variant="body2">
                      • Average weight:{" "}
                      {bodyWeightAnalytics?.averageWeight?.toFixed(1) || 0} kg
                    </Typography>
                    <Typography variant="body2">
                      • Weight range:{" "}
                      {bodyWeightAnalytics?.minWeight?.toFixed(1) || 0} -{" "}
                      {bodyWeightAnalytics?.maxWeight?.toFixed(1) || 0} kg
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      color="success.main"
                      fontWeight={600}
                    >
                      Progress Analysis
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      • Total change:{" "}
                      {(bodyWeightAnalytics?.totalWeightChange || 0) > 0
                        ? "+"
                        : ""}
                      {bodyWeightAnalytics?.totalWeightChange?.toFixed(1) || 0}{" "}
                      kg
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      • Trend:{" "}
                      {(bodyWeightAnalytics?.totalWeightChange || 0) > 2
                        ? "📈 Gaining"
                        : (bodyWeightAnalytics?.totalWeightChange || 0) < -2
                        ? "📉 Losing"
                        : "➡️ Stable"}
                    </Typography>
                    {bodyWeightAnalytics?.averageBMI && (
                      <Typography variant="body2">
                        • Average BMI:{" "}
                        {bodyWeightAnalytics.averageBMI.toFixed(1)}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="h6" color="info.main" fontWeight={600}>
                      Health Insights
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {Math.abs(bodyWeightAnalytics?.totalWeightChange || 0) < 1
                        ? "🎯 Weight is stable - great consistency!"
                        : (bodyWeightAnalytics?.totalWeightChange || 0) > 0
                        ? "📊 Monitor weight gain trends and adjust diet if needed."
                        : "💪 Weight loss progress - ensure it's healthy and sustainable."}
                    </Typography>
                  </Box>
                </>
              )}
            </Paper>

            {/* Wholesale Business Analytics */}
            <Paper
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${colors.background.paper}, ${colors.background.widget})`,
                border: `1px solid ${
                  colors.borders?.primary || colors.accent.quaternary
                }`,
              }}
            >
              <Typography variant="h5" fontWeight={600} gutterBottom>
                🏢 Wholesale Business
              </Typography>

              {wholesaleAnalytics?.totalBatches === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No wholesale data recorded yet. Add business batches to see
                  analytics.
                </Typography>
              ) : (
                <>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" color="primary" fontWeight={600}>
                      Business Overview
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Total investment: ₹
                      {wholesaleAnalytics?.totalInvestment?.toLocaleString() ||
                        0}
                    </Typography>
                    <Typography variant="body2">
                      • Total batches: {wholesaleAnalytics?.totalBatches || 0}
                    </Typography>
                    <Typography variant="body2">
                      • Average per batch: ₹
                      {wholesaleAnalytics?.averageInvestmentPerBatch?.toLocaleString() ||
                        0}
                    </Typography>
                    <Typography variant="body2">
                      • Potential profit: ₹
                      {wholesaleAnalytics?.totalPotentialProfit?.toLocaleString() ||
                        0}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      color="success.main"
                      fontWeight={600}
                    >
                      Profitability Analysis
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      • Profit margin:{" "}
                      {wholesaleAnalytics?.overallProfitMargin || 0}%
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      • Potential return: ₹
                      {wholesaleAnalytics?.totalPotentialReturn?.toLocaleString() ||
                        0}
                    </Typography>
                    <Typography variant="body2">
                      • Business status:{" "}
                      {parseFloat(
                        wholesaleAnalytics?.overallProfitMargin || "0"
                      ) > 20
                        ? "🟢 Highly Profitable"
                        : parseFloat(
                            wholesaleAnalytics?.overallProfitMargin || "0"
                          ) > 10
                        ? "🟡 Moderately Profitable"
                        : parseFloat(
                            wholesaleAnalytics?.overallProfitMargin || "0"
                          ) > 0
                        ? "🟠 Low Profit"
                        : "🔴 Review Required"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="h6" color="info.main" fontWeight={600}>
                      Business Recommendations
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {parseFloat(
                        wholesaleAnalytics?.overallProfitMargin || "0"
                      ) > 20
                        ? "🚀 Excellent margins! Consider scaling operations."
                        : parseFloat(
                            wholesaleAnalytics?.overallProfitMargin || "0"
                          ) > 10
                        ? "📈 Good profitability. Look for optimization opportunities."
                        : "🔍 Analyze costs and pricing to improve margins."}
                    </Typography>
                  </Box>
                </>
              )}
            </Paper>
          </Box>

          {/* Advanced Insights & Cross-Module Analysis */}
          <Box sx={{ mt: 4 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Typography
                variant="h4"
                fontWeight={700}
                gutterBottom
                sx={{ mb: 4 }}
              >
                🔍 Advanced Insights & Correlations
              </Typography>

              <Paper
                sx={{
                  p: 4,
                  background: `linear-gradient(135deg, ${colors.background.paper}, ${colors.background.widget})`,
                  border: `1px solid ${
                    colors.borders?.primary || colors.accent.quaternary
                  }`,
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "repeat(2, 1fr)",
                      lg: "repeat(3, 1fr)",
                    },
                    gap: 4,
                  }}
                >
                  {/* Health & Fitness Correlation */}
                  <Box>
                    <Typography
                      variant="h6"
                      color="primary"
                      fontWeight={600}
                      gutterBottom
                    >
                      🏃‍♂️ Health & Fitness Score
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Combined fitness and weight management analysis
                    </Typography>

                    {/* Calculate health score */}
                    {(() => {
                      const workoutScore =
                        Math.min((workoutStats?.completionRate || 0) / 100, 1) *
                        40;
                      const weightStability =
                        (bodyWeightAnalytics?.totalEntries || 0) > 0
                          ? Math.max(
                              0,
                              30 -
                                Math.abs(
                                  bodyWeightAnalytics?.totalWeightChange || 0
                                ) *
                                  5
                            )
                          : 15;
                      const consistencyScore =
                        (bodyWeightAnalytics?.totalEntries || 0) > 5 ? 30 : 15;
                      const totalHealthScore = Math.round(
                        workoutScore + weightStability + consistencyScore
                      );

                      return (
                        <>
                          <Typography
                            variant="h4"
                            color="success.main"
                            fontWeight={700}
                          >
                            {totalHealthScore}/100
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • Workout consistency: {Math.round(workoutScore)}/40
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • Weight stability: {Math.round(weightStability)}/30
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            • Tracking consistency:{" "}
                            {Math.round(consistencyScore)}/30
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {totalHealthScore >= 80
                              ? "🟢 Excellent health management!"
                              : totalHealthScore >= 60
                              ? "🟡 Good progress, keep improving"
                              : totalHealthScore >= 40
                              ? "🟠 Focus on consistency"
                              : "🔴 Start with small, consistent steps"}
                          </Typography>
                        </>
                      );
                    })()}
                  </Box>

                  {/* Financial Health */}
                  <Box>
                    <Typography
                      variant="h6"
                      color="warning.main"
                      fontWeight={600}
                      gutterBottom
                    >
                      💰 Financial Health Index
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Expense tracking and business profitability
                    </Typography>

                    {(() => {
                      const trackingScore =
                        (expenseAnalytics?.totalExpenses || 0) > 10
                          ? 40
                          : (expenseAnalytics?.totalExpenses || 0) > 5
                          ? 25
                          : 10;
                      const diversityScore =
                        (expenseAnalytics?.categoriesCount || 0) > 3
                          ? 30
                          : (expenseAnalytics?.categoriesCount || 0) > 1
                          ? 20
                          : 10;
                      const businessScore =
                        (wholesaleAnalytics?.totalBatches || 0) > 0
                          ? Math.min(
                              parseFloat(
                                wholesaleAnalytics?.overallProfitMargin || "0"
                              ) * 1.5,
                              30
                            )
                          : 0;
                      const totalFinancialScore = Math.round(
                        trackingScore + diversityScore + businessScore
                      );

                      return (
                        <>
                          <Typography
                            variant="h4"
                            color="warning.main"
                            fontWeight={700}
                          >
                            {totalFinancialScore}/100
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • Expense tracking: {Math.round(trackingScore)}/40
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • Category diversity: {Math.round(diversityScore)}
                            /30
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            • Business performance: {Math.round(businessScore)}
                            /30
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {totalFinancialScore >= 80
                              ? "🟢 Strong financial management!"
                              : totalFinancialScore >= 60
                              ? "🟡 Good financial awareness"
                              : totalFinancialScore >= 40
                              ? "🟠 Improve tracking habits"
                              : "🔴 Start tracking expenses regularly"}
                          </Typography>
                        </>
                      );
                    })()}
                  </Box>

                  {/* Overall Productivity Score */}
                  <Box>
                    <Typography
                      variant="h6"
                      color="info.main"
                      fontWeight={600}
                      gutterBottom
                    >
                      📈 Productivity Index
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Overall life management and consistency
                    </Typography>

                    {(() => {
                      const dataConsistency =
                        [
                          expenseAnalytics?.totalExpenses || 0,
                          workoutStats?.totalWorkouts || 0,
                          bodyWeightAnalytics?.totalEntries || 0,
                          wholesaleAnalytics?.totalBatches || 0,
                        ].filter((val) => val > 0).length * 15;

                      const activityLevel = Math.min(
                        ((workoutStats?.completionRate || 0) +
                          (expenseAnalytics?.totalExpenses || 0) * 2 +
                          (bodyWeightAnalytics?.totalEntries || 0) * 3) /
                          5,
                        40
                      );

                      const totalProductivityScore = Math.round(
                        dataConsistency + activityLevel
                      );

                      return (
                        <>
                          <Typography
                            variant="h4"
                            color="info.main"
                            fontWeight={700}
                          >
                            {totalProductivityScore}/100
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • Data consistency: {Math.round(dataConsistency)}/60
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            • Activity level: {Math.round(activityLevel)}/40
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {totalProductivityScore >= 80
                              ? "🟢 Highly organized lifestyle!"
                              : totalProductivityScore >= 60
                              ? "🟡 Well-managed routine"
                              : totalProductivityScore >= 40
                              ? "🟠 Building good habits"
                              : "🔴 Focus on one area at a time"}
                          </Typography>
                        </>
                      );
                    })()}
                  </Box>
                </Box>

                {/* Key Recommendations */}
                <Box
                  sx={{
                    mt: 4,
                    pt: 3,
                    borderTop: `1px solid ${
                      colors.borders?.primary || colors.accent.quaternary
                    }`,
                  }}
                >
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    🎯 Personalized Recommendations
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                      gap: 3,
                    }}
                  >
                    <Box>
                      <Typography variant="h6" color="primary" fontWeight={600}>
                        Priority Actions
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                        {(workoutStats?.completionRate || 0) < 60 && (
                          <Typography
                            component="li"
                            variant="body2"
                            sx={{ mb: 1 }}
                          >
                            🏋️ Increase workout frequency to 3-4 times per week
                          </Typography>
                        )}
                        {(expenseAnalytics?.totalExpenses || 0) < 10 && (
                          <Typography
                            component="li"
                            variant="body2"
                            sx={{ mb: 1 }}
                          >
                            💰 Start tracking daily expenses for better
                            financial awareness
                          </Typography>
                        )}
                        {(bodyWeightAnalytics?.totalEntries || 0) < 5 && (
                          <Typography
                            component="li"
                            variant="body2"
                            sx={{ mb: 1 }}
                          >
                            ⚖️ Record weight weekly for health monitoring
                          </Typography>
                        )}
                        {(wholesaleAnalytics?.totalBatches || 0) === 0 && (
                          <Typography
                            component="li"
                            variant="body2"
                            sx={{ mb: 1 }}
                          >
                            🏢 Consider tracking business investments for profit
                            analysis
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Box>
                      <Typography
                        variant="h6"
                        color="success.main"
                        fontWeight={600}
                      >
                        Achievements & Strengths
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                        {(workoutStats?.completionRate || 0) >= 80 && (
                          <Typography
                            component="li"
                            variant="body2"
                            sx={{ mb: 1 }}
                          >
                            🎉 Excellent workout consistency - you&apos;re a
                            fitness champion!
                          </Typography>
                        )}
                        {(expenseAnalytics?.categoriesCount || 0) >= 5 && (
                          <Typography
                            component="li"
                            variant="body2"
                            sx={{ mb: 1 }}
                          >
                            📊 Great expense categorization - you understand
                            your spending
                          </Typography>
                        )}
                        {Math.abs(bodyWeightAnalytics?.totalWeightChange || 0) <
                          2 &&
                          (bodyWeightAnalytics?.totalEntries || 0) > 5 && (
                            <Typography
                              component="li"
                              variant="body2"
                              sx={{ mb: 1 }}
                            >
                              🎯 Stable weight management - excellent health
                              control
                            </Typography>
                          )}
                        {parseFloat(
                          wholesaleAnalytics?.overallProfitMargin || "0"
                        ) > 15 && (
                          <Typography
                            component="li"
                            variant="body2"
                            sx={{ mb: 1 }}
                          >
                            💼 Strong business acumen - profitable wholesale
                            operations
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
