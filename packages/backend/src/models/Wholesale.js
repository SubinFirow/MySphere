const mongoose = require('mongoose');

const wholesaleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  investment_amount: {
    type: Number,
    required: [true, 'Investment amount is required'],
    min: [0, 'Investment amount must be positive']
  },
  boxes_purchased: {
    type: Number,
    required: [true, 'Number of boxes is required'],
    min: [1, 'Must purchase at least 1 box']
  },
  profit_per_box: {
    type: Number,
    required: [true, 'Profit per box is required'],
    min: [0, 'Profit per box must be positive'],
    default: 20
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual fields for calculations
wholesaleSchema.virtual('cost_per_box').get(function() {
  return this.investment_amount / this.boxes_purchased;
});

wholesaleSchema.virtual('total_potential_profit').get(function() {
  return this.boxes_purchased * this.profit_per_box;
});

wholesaleSchema.virtual('profit_margin_percentage').get(function() {
  const costPerBox = this.cost_per_box;
  return ((this.profit_per_box / costPerBox) * 100).toFixed(2);
});

wholesaleSchema.virtual('selling_price_per_box').get(function() {
  return this.cost_per_box + this.profit_per_box;
});

wholesaleSchema.virtual('total_selling_value').get(function() {
  return this.boxes_purchased * this.selling_price_per_box;
});

// Indexes for better query performance
wholesaleSchema.index({ date: -1 });
wholesaleSchema.index({ investment_amount: 1 });
wholesaleSchema.index({ createdAt: -1 });

// Static methods for analytics
wholesaleSchema.statics.getAnalytics = async function(period = 'monthly') {
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'daily':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'weekly':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'yearly':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default: // monthly
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const pipeline = [
    {
      $match: {
        date: { $gte: startDate, $lte: now }
      }
    },
    {
      $group: {
        _id: null,
        totalInvestment: { $sum: '$investment_amount' },
        totalBoxes: { $sum: '$boxes_purchased' },
        totalPotentialProfit: { 
          $sum: { $multiply: ['$boxes_purchased', '$profit_per_box'] }
        },
        averageInvestment: { $avg: '$investment_amount' },
        averageProfitPerBox: { $avg: '$profit_per_box' },
        totalBatches: { $sum: 1 },
        maxInvestment: { $max: '$investment_amount' },
        minInvestment: { $min: '$investment_amount' }
      }
    }
  ];

  const result = await this.aggregate(pipeline);
  const summary = result[0] || {
    totalInvestment: 0,
    totalBoxes: 0,
    totalPotentialProfit: 0,
    averageInvestment: 0,
    averageProfitPerBox: 0,
    totalBatches: 0,
    maxInvestment: 0,
    minInvestment: 0
  };

  // Calculate additional metrics
  summary.averageCostPerBox = summary.totalBoxes > 0 ? 
    summary.totalInvestment / summary.totalBoxes : 0;
  summary.profitMarginPercentage = summary.totalInvestment > 0 ? 
    ((summary.totalPotentialProfit / summary.totalInvestment) * 100).toFixed(2) : 0;
  summary.totalSellingValue = summary.totalInvestment + summary.totalPotentialProfit;

  return {
    period,
    dateRange: { startDate, endDate: now },
    summary
  };
};

wholesaleSchema.statics.getTrends = async function(months = 6) {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - months, 1);

  const pipeline = [
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
        totalInvestment: { $sum: '$investment_amount' },
        totalBoxes: { $sum: '$boxes_purchased' },
        totalProfit: { 
          $sum: { $multiply: ['$boxes_purchased', '$profit_per_box'] }
        },
        batchCount: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ];

  return await this.aggregate(pipeline);
};

wholesaleSchema.statics.getProfitTips = async function() {
  const recentBatches = await this.find()
    .sort({ date: -1 })
    .limit(10)
    .lean();

  const tips = [];

  if (recentBatches.length > 0) {
    const avgProfitPerBox = recentBatches.reduce((sum, batch) => 
      sum + batch.profit_per_box, 0) / recentBatches.length;
    
    const avgCostPerBox = recentBatches.reduce((sum, batch) => 
      sum + (batch.investment_amount / batch.boxes_purchased), 0) / recentBatches.length;

    // Tip 1: Profit margin analysis
    const profitMargin = (avgProfitPerBox / avgCostPerBox) * 100;
    if (profitMargin < 20) {
      tips.push({
        type: 'warning',
        title: 'Low Profit Margin',
        message: `Current margin is ${profitMargin.toFixed(1)}%. Consider negotiating better prices or finding higher-margin products.`
      });
    } else if (profitMargin > 50) {
      tips.push({
        type: 'success',
        title: 'Excellent Profit Margin',
        message: `Great margin of ${profitMargin.toFixed(1)}%! Consider scaling up this profitable line.`
      });
    }

    // Tip 2: Volume analysis
    const avgBoxes = recentBatches.reduce((sum, batch) => 
      sum + batch.boxes_purchased, 0) / recentBatches.length;
    
    if (avgBoxes < 50) {
      tips.push({
        type: 'info',
        title: 'Scale Up Opportunity',
        message: 'Consider bulk purchasing to negotiate better rates and increase profit margins.'
      });
    }

    // Tip 3: Investment efficiency
    const maxInvestment = Math.max(...recentBatches.map(b => b.investment_amount));
    const minInvestment = Math.min(...recentBatches.map(b => b.investment_amount));
    
    if (maxInvestment > minInvestment * 3) {
      tips.push({
        type: 'info',
        title: 'Investment Consistency',
        message: 'Consider maintaining consistent investment amounts for better cash flow management.'
      });
    }
  }

  // General tips
  tips.push(
    {
      type: 'tip',
      title: 'Market Research',
      message: 'Regularly research market prices to ensure competitive profit margins.'
    },
    {
      type: 'tip',
      title: 'Supplier Relations',
      message: 'Build strong relationships with suppliers for better pricing and payment terms.'
    },
    {
      type: 'tip',
      title: 'Inventory Turnover',
      message: 'Track how quickly you sell inventory to optimize cash flow and reduce storage costs.'
    }
  );

  return tips;
};

module.exports = mongoose.model('Wholesale', wholesaleSchema);
