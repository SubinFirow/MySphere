const Expense = require('../models/Expense');

// Helper function to handle async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Helper function to get date ranges
const getDateRange = (period) => {
  const now = new Date();
  let startDate, endDate;

  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      break;
    case 'week':
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      startDate = weekStart;
      endDate = new Date(weekStart);
      endDate.setDate(weekStart.getDate() + 6);
      endDate.setHours(23, 59, 59);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      break;
    default:
      // Last 30 days
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
      endDate = now;
  }

  return { startDate, endDate };
};

// @desc    Get expense summary for dashboard
// @route   GET /api/expenses/analytics/summary
// @access  Public
const getExpenseSummary = asyncHandler(async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const { startDate, endDate } = getDateRange(period);

    // Get total expenses for the period
    const totalExpenses = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      }
    ]);

    // Get category-wise breakdown
    const categoryBreakdown = await Expense.getCategoryWiseExpenses(startDate, endDate);

    // Get payment type breakdown
    const paymentTypeBreakdown = await Expense.getPaymentTypeAnalysis(startDate, endDate);

    // Get daily expenses for the period (for charts)
    const dailyExpenses = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Calculate comparison with previous period
    const prevStartDate = new Date(startDate);
    const prevEndDate = new Date(endDate);
    const periodDiff = endDate - startDate;
    prevStartDate.setTime(startDate.getTime() - periodDiff);
    prevEndDate.setTime(endDate.getTime() - periodDiff);

    const prevPeriodTotal = await Expense.aggregate([
      {
        $match: {
          date: { $gte: prevStartDate, $lte: prevEndDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const currentTotal = totalExpenses[0]?.total || 0;
    const previousTotal = prevPeriodTotal[0]?.total || 0;
    const percentageChange = previousTotal > 0 
      ? ((currentTotal - previousTotal) / previousTotal) * 100 
      : 0;

    res.json({
      success: true,
      data: {
        period,
        dateRange: { startDate, endDate },
        summary: {
          totalAmount: currentTotal,
          totalTransactions: totalExpenses[0]?.count || 0,
          averageAmount: totalExpenses[0]?.avgAmount || 0,
          percentageChange: Math.round(percentageChange * 100) / 100
        },
        categoryBreakdown,
        paymentTypeBreakdown,
        dailyExpenses: dailyExpenses.map(item => ({
          date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
          total: item.total,
          count: item.count
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching expense summary',
      error: error.message
    });
  }
});

// @desc    Get monthly expense trends
// @route   GET /api/expenses/analytics/trends
// @access  Public
const getExpenseTrends = asyncHandler(async (req, res) => {
  try {
    const { months = 12 } = req.query;
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - parseInt(months) + 1, 1);

    const monthlyTrends = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        trends: monthlyTrends.map(item => ({
          month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
          total: item.total,
          count: item.count,
          average: item.avgAmount
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching expense trends',
      error: error.message
    });
  }
});

// @desc    Get top spending categories
// @route   GET /api/expenses/analytics/top-categories
// @access  Public
const getTopCategories = asyncHandler(async (req, res) => {
  try {
    const { period = 'month', limit = 10 } = req.query;
    const { startDate, endDate } = getDateRange(period);

    const topCategories = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      },
      {
        $sort: { total: -1 }
      },
      {
        $limit: parseInt(limit)
      }
    ]);

    res.json({
      success: true,
      data: {
        period,
        categories: topCategories.map(item => ({
          category: item._id,
          total: item.total,
          count: item.count,
          average: item.avgAmount
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching top categories',
      error: error.message
    });
  }
});

// @desc    Get expense statistics
// @route   GET /api/expenses/analytics/stats
// @access  Public
const getExpenseStats = asyncHandler(async (req, res) => {
  try {
    // Get overall statistics
    const totalExpenses = await Expense.countDocuments();
    const totalAmount = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Get this month's stats
    const thisMonth = getDateRange('month');
    const thisMonthStats = await Expense.getMonthlyTotal(
      thisMonth.startDate.getFullYear(),
      thisMonth.startDate.getMonth() + 1
    );

    // Get most used payment type
    const paymentTypeStats = await Expense.aggregate([
      {
        $group: {
          _id: '$paymentType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    // Get most expensive category
    const expensiveCategory = await Expense.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 1 }
    ]);

    res.json({
      success: true,
      data: {
        overall: {
          totalExpenses,
          totalAmount: totalAmount[0]?.total || 0
        },
        thisMonth: {
          total: thisMonthStats[0]?.total || 0,
          count: thisMonthStats[0]?.count || 0,
          average: thisMonthStats[0]?.avgAmount || 0
        },
        insights: {
          mostUsedPaymentType: paymentTypeStats[0]?._id || 'N/A',
          topSpendingCategory: expensiveCategory[0]?._id || 'N/A',
          topCategoryAmount: expensiveCategory[0]?.total || 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching expense statistics',
      error: error.message
    });
  }
});

module.exports = {
  getExpenseSummary,
  getExpenseTrends,
  getTopCategories,
  getExpenseStats
};
