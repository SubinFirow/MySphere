const BodyWeight = require('../models/BodyWeight');

// Get body weight summary analytics
const getBodyWeightSummary = async (req, res) => {
  try {
    const { period = 'monthly', startDate, endDate } = req.query;
    
    let dateRange = {};
    const now = new Date();
    
    // Set date range based on period
    switch (period) {
      case 'weekly':
        dateRange.startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateRange.endDate = now;
        break;
      case 'monthly':
        dateRange.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        dateRange.endDate = now;
        break;
      case 'yearly':
        dateRange.startDate = new Date(now.getFullYear(), 0, 1);
        dateRange.endDate = now;
        break;
      case 'custom':
        if (startDate && endDate) {
          dateRange.startDate = new Date(startDate);
          dateRange.endDate = new Date(endDate);
        } else {
          dateRange.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          dateRange.endDate = now;
        }
        break;
      default:
        dateRange.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        dateRange.endDate = now;
    }

    // Get current period data
    const currentPeriodData = await BodyWeight.aggregate([
      {
        $match: {
          date: { $gte: dateRange.startDate, $lte: dateRange.endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalEntries: { $sum: 1 },
          avgWeight: { $avg: '$weight' },
          minWeight: { $min: '$weight' },
          maxWeight: { $max: '$weight' },
          latestWeight: { $last: '$weight' },
          firstWeight: { $first: '$weight' },
          avgBodyFat: { $avg: '$bodyFatPercentage' },
          avgMuscleMass: { $avg: '$muscleMass' },
          avgBMI: { $avg: '$bmi' }
        }
      }
    ]);

    // Get previous period for comparison
    const periodLength = dateRange.endDate.getTime() - dateRange.startDate.getTime();
    const prevStartDate = new Date(dateRange.startDate.getTime() - periodLength);
    const prevEndDate = new Date(dateRange.startDate.getTime() - 1);

    const previousPeriodData = await BodyWeight.aggregate([
      {
        $match: {
          date: { $gte: prevStartDate, $lte: prevEndDate }
        }
      },
      {
        $group: {
          _id: null,
          avgWeight: { $avg: '$weight' },
          totalEntries: { $sum: 1 }
        }
      }
    ]);

    const current = currentPeriodData[0] || {
      totalEntries: 0,
      avgWeight: 0,
      minWeight: 0,
      maxWeight: 0,
      latestWeight: 0,
      firstWeight: 0,
      avgBodyFat: 0,
      avgMuscleMass: 0,
      avgBMI: 0
    };

    const previous = previousPeriodData[0] || { avgWeight: 0, totalEntries: 0 };

    // Calculate percentage change
    const weightChange = previous.avgWeight > 0 
      ? ((current.avgWeight - previous.avgWeight) / previous.avgWeight) * 100 
      : 0;

    // Calculate weight trend (gain/loss)
    const weightTrend = current.latestWeight - current.firstWeight;

    res.json({
      success: true,
      data: {
        period,
        dateRange,
        summary: {
          totalEntries: current.totalEntries,
          averageWeight: Math.round(current.avgWeight * 10) / 10,
          minWeight: Math.round(current.minWeight * 10) / 10,
          maxWeight: Math.round(current.maxWeight * 10) / 10,
          latestWeight: Math.round(current.latestWeight * 10) / 10,
          weightTrend: Math.round(weightTrend * 10) / 10,
          averageBodyFat: current.avgBodyFat ? Math.round(current.avgBodyFat * 10) / 10 : null,
          averageMuscleMass: current.avgMuscleMass ? Math.round(current.avgMuscleMass * 10) / 10 : null,
          averageBMI: current.avgBMI ? Math.round(current.avgBMI * 10) / 10 : null,
          percentageChange: Math.round(weightChange * 10) / 10
        }
      }
    });
  } catch (error) {
    console.error('Error getting body weight summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching body weight summary',
      error: error.message
    });
  }
};

// Get body weight trends over time
const getBodyWeightTrends = async (req, res) => {
  try {
    const { period = 'monthly', limit = 12 } = req.query;
    
    let groupBy = {};
    let sortBy = {};
    
    switch (period) {
      case 'daily':
        groupBy = {
          year: { $year: '$date' },
          month: { $month: '$date' },
          day: { $dayOfMonth: '$date' }
        };
        sortBy = { '_id.year': -1, '_id.month': -1, '_id.day': -1 };
        break;
      case 'weekly':
        groupBy = {
          year: { $year: '$date' },
          week: { $week: '$date' }
        };
        sortBy = { '_id.year': -1, '_id.week': -1 };
        break;
      case 'monthly':
        groupBy = {
          year: { $year: '$date' },
          month: { $month: '$date' }
        };
        sortBy = { '_id.year': -1, '_id.month': -1 };
        break;
      case 'yearly':
        groupBy = {
          year: { $year: '$date' }
        };
        sortBy = { '_id.year': -1 };
        break;
      default:
        groupBy = {
          year: { $year: '$date' },
          month: { $month: '$date' }
        };
        sortBy = { '_id.year': -1, '_id.month': -1 };
    }

    const trends = await BodyWeight.aggregate([
      {
        $group: {
          _id: groupBy,
          avgWeight: { $avg: '$weight' },
          minWeight: { $min: '$weight' },
          maxWeight: { $max: '$weight' },
          count: { $sum: 1 },
          avgBodyFat: { $avg: '$bodyFatPercentage' },
          avgMuscleMass: { $avg: '$muscleMass' },
          avgBMI: { $avg: '$bmi' }
        }
      },
      { $sort: sortBy },
      { $limit: parseInt(limit) }
    ]);

    // Format the response
    const formattedTrends = trends.reverse().map(trend => ({
      period: trend._id,
      averageWeight: Math.round(trend.avgWeight * 10) / 10,
      minWeight: Math.round(trend.minWeight * 10) / 10,
      maxWeight: Math.round(trend.maxWeight * 10) / 10,
      entryCount: trend.count,
      averageBodyFat: trend.avgBodyFat ? Math.round(trend.avgBodyFat * 10) / 10 : null,
      averageMuscleMass: trend.avgMuscleMass ? Math.round(trend.avgMuscleMass * 10) / 10 : null,
      averageBMI: trend.avgBMI ? Math.round(trend.avgBMI * 10) / 10 : null
    }));

    res.json({
      success: true,
      data: {
        period,
        trends: formattedTrends
      }
    });
  } catch (error) {
    console.error('Error getting body weight trends:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching body weight trends',
      error: error.message
    });
  }
};

// Get body weight statistics
const getBodyWeightStats = async (req, res) => {
  try {
    // Get overall statistics
    const overallStats = await BodyWeight.aggregate([
      {
        $group: {
          _id: null,
          totalEntries: { $sum: 1 },
          avgWeight: { $avg: '$weight' },
          minWeight: { $min: '$weight' },
          maxWeight: { $max: '$weight' },
          avgBodyFat: { $avg: '$bodyFatPercentage' },
          avgMuscleMass: { $avg: '$muscleMass' },
          avgBMI: { $avg: '$bmi' }
        }
      }
    ]);

    // Get first and latest entries
    const firstEntry = await BodyWeight.findOne().sort({ date: 1 });
    const latestEntry = await BodyWeight.findOne().sort({ date: -1 });

    // Get entries by unit
    const unitStats = await BodyWeight.aggregate([
      {
        $group: {
          _id: '$unit',
          count: { $sum: 1 },
          avgWeight: { $avg: '$weight' }
        }
      }
    ]);

    const stats = overallStats[0] || {
      totalEntries: 0,
      avgWeight: 0,
      minWeight: 0,
      maxWeight: 0,
      avgBodyFat: 0,
      avgMuscleMass: 0,
      avgBMI: 0
    };

    // Calculate total weight change
    const totalWeightChange = firstEntry && latestEntry 
      ? latestEntry.weight - firstEntry.weight 
      : 0;

    res.json({
      success: true,
      data: {
        totalEntries: stats.totalEntries,
        averageWeight: Math.round(stats.avgWeight * 10) / 10,
        minWeight: Math.round(stats.minWeight * 10) / 10,
        maxWeight: Math.round(stats.maxWeight * 10) / 10,
        totalWeightChange: Math.round(totalWeightChange * 10) / 10,
        averageBodyFat: stats.avgBodyFat ? Math.round(stats.avgBodyFat * 10) / 10 : null,
        averageMuscleMass: stats.avgMuscleMass ? Math.round(stats.avgMuscleMass * 10) / 10 : null,
        averageBMI: stats.avgBMI ? Math.round(stats.avgBMI * 10) / 10 : null,
        firstEntry: firstEntry ? {
          date: firstEntry.date,
          weight: firstEntry.weight,
          unit: firstEntry.unit
        } : null,
        latestEntry: latestEntry ? {
          date: latestEntry.date,
          weight: latestEntry.weight,
          unit: latestEntry.unit
        } : null,
        unitBreakdown: unitStats.map(unit => ({
          unit: unit._id,
          count: unit.count,
          averageWeight: Math.round(unit.avgWeight * 10) / 10
        }))
      }
    });
  } catch (error) {
    console.error('Error getting body weight stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching body weight statistics',
      error: error.message
    });
  }
};

module.exports = {
  getBodyWeightSummary,
  getBodyWeightTrends,
  getBodyWeightStats
};
