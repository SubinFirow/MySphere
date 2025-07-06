"use client";

import { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Box,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import {
  FitnessCenter as WorkoutIcon,
  AccountBalance as ExpenseIcon,
  MonitorWeight as WeightIcon,
  TrendingUp,
  TrendingDown,
  CalendarToday,
  Timeline,
} from "@mui/icons-material";
import { apiClient } from "@/lib/api";
import StatsCard from "@/components/dashboard/StatsCard";

interface WorkoutStats {
  daysSinceStart: number;
  totalWorkoutDays: number;
  currentWeek: number;
  weeklyProgress: number;
  completionRate: number;
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

export default function Home() {
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats | null>(null);
  const [expenseAnalytics, setExpenseAnalytics] =
    useState<ExpenseAnalytics | null>(null);
  const [bodyWeightAnalytics, setBodyWeightAnalytics] =
    useState<BodyWeightAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateWorkoutStats();
    loadExpenseAnalytics();
    loadBodyWeightAnalytics();
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
      totalWorkoutDays,
      currentWeek,
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
      });
    } catch (error) {
      console.error("Error loading expense analytics:", error);
      setExpenseAnalytics({
        totalExpenses: 0,
        monthlyTotal: 0,
        categoryBreakdown: [],
        paymentTypeBreakdown: [],
        recentExpenses: 0,
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

  return (
    <Box>
      {/* Page Header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          MySphere Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Track your fitness, expenses, and body weight progress.
        </Typography>
      </Box>

      {/* Workout Tracking Section */}
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ mt: 4, mb: 2 }}
      >
        <WorkoutIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Workout Progress
      </Typography>

      <Box
        sx={{
          mb: 4,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        <StatsCard
          title="Days Since Start"
          value={workoutStats?.daysSinceStart?.toString() || "0"}
          icon={<CalendarToday />}
          color="primary"
        />

        <StatsCard
          title="Total Workouts"
          value={workoutStats?.totalWorkoutDays?.toString() || "0"}
          icon={<WorkoutIcon />}
          color="success"
        />

        <StatsCard
          title="Current Week"
          value={workoutStats?.currentWeek?.toString() || "0"}
          icon={<Timeline />}
          progress={workoutStats?.weeklyProgress || 0}
          color="info"
        />

        <StatsCard
          title="Completion Rate"
          value={`${Math.round(workoutStats?.completionRate || 0)}%`}
          icon={
            workoutStats?.completionRate &&
            workoutStats.completionRate >= 80 ? (
              <TrendingUp />
            ) : (
              <TrendingDown />
            )
          }
          trend={{
            value: workoutStats?.completionRate || 0,
            isPositive: (workoutStats?.completionRate || 0) >= 80,
          }}
          color={
            workoutStats?.completionRate && workoutStats.completionRate >= 80
              ? "success"
              : "warning"
          }
        />
      </Box>

      {/* Expense Analytics Section */}
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ mt: 4, mb: 2 }}
      >
        <ExpenseIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Expense Analytics
      </Typography>

      <Box
        sx={{
          mb: 4,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        <StatsCard
          title="Total Expenses"
          value={expenseAnalytics?.totalExpenses?.toString() || "0"}
          icon={<ExpenseIcon />}
          color="primary"
        />

        <StatsCard
          title="Monthly Total"
          value={`₹${expenseAnalytics?.monthlyTotal?.toLocaleString() || "0"}`}
          icon={<TrendingUp />}
          color="success"
        />

        <StatsCard
          title="Recent Expenses"
          value={expenseAnalytics?.recentExpenses?.toString() || "0"}
          icon={<Timeline />}
          color="info"
        />

        <StatsCard
          title="Categories"
          value={expenseAnalytics?.categoryBreakdown?.length?.toString() || "0"}
          icon={<ExpenseIcon />}
          color="warning"
        />
      </Box>

      {/* Category Breakdown */}
      {expenseAnalytics?.categoryBreakdown &&
        expenseAnalytics.categoryBreakdown.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Top Expense Categories
              </Typography>
              <Box sx={{ mt: 2 }}>
                {expenseAnalytics.categoryBreakdown
                  .slice(0, 5)
                  .map((category, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2">
                          {category.category}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          ₹{category.amount.toLocaleString()} (
                          {category.percentage.toFixed(1)}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={category.percentage}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  ))}
              </Box>
            </CardContent>
          </Card>
        )}

      {/* Payment Type Breakdown */}
      {expenseAnalytics?.paymentTypeBreakdown &&
        expenseAnalytics.paymentTypeBreakdown.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Payment Methods
              </Typography>
              <Box
                sx={{
                  mt: 1,
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(3, 1fr)",
                  },
                  gap: 2,
                }}
              >
                {expenseAnalytics.paymentTypeBreakdown.map((payment, index) => (
                  <Box
                    key={index}
                    sx={{
                      textAlign: "center",
                      p: 2,
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h6" color="primary">
                      ₹{payment.amount.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {payment.type.toUpperCase()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {payment.percentage.toFixed(1)}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

      {/* Body Weight Section */}
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ mt: 4, mb: 2 }}
      >
        <WeightIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Body Weight Tracking
      </Typography>

      <Box
        sx={{
          mb: 4,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        <StatsCard
          title="Total Entries"
          value={bodyWeightAnalytics?.totalEntries?.toString() || "0"}
          icon={<WeightIcon />}
          color="primary"
        />

        <StatsCard
          title="Current Weight"
          value={
            bodyWeightAnalytics?.latestWeight
              ? `${bodyWeightAnalytics.latestWeight.toFixed(1)} kg`
              : "0 kg"
          }
          icon={<TrendingUp />}
          color="success"
        />

        <StatsCard
          title="Weight Change"
          value={
            bodyWeightAnalytics?.totalWeightChange
              ? `${
                  bodyWeightAnalytics.totalWeightChange > 0 ? "+" : ""
                }${bodyWeightAnalytics.totalWeightChange.toFixed(1)} kg`
              : "0 kg"
          }
          icon={
            bodyWeightAnalytics?.totalWeightChange &&
            bodyWeightAnalytics.totalWeightChange > 0 ? (
              <TrendingUp />
            ) : (
              <TrendingDown />
            )
          }
          trend={{
            value: bodyWeightAnalytics?.totalWeightChange || 0,
            isPositive: (bodyWeightAnalytics?.totalWeightChange || 0) >= 0,
          }}
          color="info"
        />

        <StatsCard
          title="Average Weight"
          value={
            bodyWeightAnalytics?.averageWeight
              ? `${bodyWeightAnalytics.averageWeight.toFixed(1)} kg`
              : "0 kg"
          }
          icon={<Timeline />}
          color="warning"
        />
      </Box>

      {bodyWeightAnalytics?.totalEntries === 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              No Weight Data Yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start tracking your body weight to see analytics and progress
              here.
            </Typography>
          </CardContent>
        </Card>
      )}

      {bodyWeightAnalytics && bodyWeightAnalytics.totalEntries > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Weight Statistics
            </Typography>
            <Box
              sx={{
                mt: 2,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 2,
              }}
            >
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="primary">
                  {bodyWeightAnalytics.minWeight.toFixed(1)} kg
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Minimum Weight
                </Typography>
              </Box>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="primary">
                  {bodyWeightAnalytics.maxWeight.toFixed(1)} kg
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Maximum Weight
                </Typography>
              </Box>
              {bodyWeightAnalytics.averageBMI && (
                <Box
                  sx={{
                    textAlign: "center",
                    p: 2,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" color="primary">
                    {bodyWeightAnalytics.averageBMI.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average BMI
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}
