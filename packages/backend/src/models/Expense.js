const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Expense title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative'],
    validate: {
      validator: function(value) {
        return Number.isFinite(value) && value >= 0;
      },
      message: 'Amount must be a valid positive number'
    }
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR'],
    required: true
  },
  paymentType: {
    type: String,
    required: [true, 'Payment type is required'],
    enum: {
      values: ['cash', 'card', 'upi'],
      message: 'Payment type must be either cash, card, or upi'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
        'food',
        'transportation',
        'entertainment',
        'shopping',
        'bills',
        'healthcare',
        'education',
        'travel',
        'groceries',
        'fuel',
        'rent',
        'utilities',
        'insurance',
        'investment',
        'charity',
        'other'
      ],
      message: 'Please select a valid category'
    }
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now,
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'Date cannot be in the future'
    }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringType: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: function() {
      return this.isRecurring;
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // For now, we'll make this optional since we don't have user auth yet
    // required: [true, 'User ID is required']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ paymentType: 1 });
expenseSchema.index({ createdBy: 1, date: -1 });

// Virtual for formatted amount
expenseSchema.virtual('formattedAmount').get(function() {
  return `₹${this.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
});

// Virtual for month/year grouping
expenseSchema.virtual('monthYear').get(function() {
  const date = new Date(this.date);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
});

// Static methods for analytics
expenseSchema.statics.getMonthlyTotal = function(year, month, userId = null) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  
  const matchQuery = {
    date: { $gte: startDate, $lte: endDate }
  };
  
  if (userId) {
    matchQuery.createdBy = userId;
  }
  
  return this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        avgAmount: { $avg: '$amount' }
      }
    }
  ]);
};

expenseSchema.statics.getCategoryWiseExpenses = function(startDate, endDate, userId = null) {
  const matchQuery = {
    date: { $gte: startDate, $lte: endDate }
  };
  
  if (userId) {
    matchQuery.createdBy = userId;
  }
  
  return this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        avgAmount: { $avg: '$amount' }
      }
    },
    { $sort: { total: -1 } }
  ]);
};

expenseSchema.statics.getPaymentTypeAnalysis = function(startDate, endDate, userId = null) {
  const matchQuery = {
    date: { $gte: startDate, $lte: endDate }
  };
  
  if (userId) {
    matchQuery.createdBy = userId;
  }
  
  return this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$paymentType',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { total: -1 } }
  ]);
};

// Pre-save middleware
expenseSchema.pre('save', function(next) {
  // Ensure amount is rounded to 2 decimal places
  if (this.amount) {
    this.amount = Math.round(this.amount * 100) / 100;
  }
  next();
});

module.exports = mongoose.model('Expense', expenseSchema);
