const mongoose = require('mongoose');

const bodyWeightSchema = new mongoose.Schema({
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [1, 'Weight must be at least 1 kg'],
    max: [1000, 'Weight cannot exceed 1000 kg'],
    validate: {
      validator: function(value) {
        return Number.isFinite(value) && value > 0;
      },
      message: 'Weight must be a valid positive number'
    }
  },
  unit: {
    type: String,
    default: 'kg',
    enum: ['kg', 'lbs'],
    required: true
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
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  bodyFatPercentage: {
    type: Number,
    min: [0, 'Body fat percentage cannot be negative'],
    max: [100, 'Body fat percentage cannot exceed 100%'],
    validate: {
      validator: function(value) {
        return value === undefined || value === null || (Number.isFinite(value) && value >= 0 && value <= 100);
      },
      message: 'Body fat percentage must be between 0 and 100'
    }
  },
  muscleMass: {
    type: Number,
    min: [0, 'Muscle mass cannot be negative'],
    validate: {
      validator: function(value) {
        return value === undefined || value === null || (Number.isFinite(value) && value >= 0);
      },
      message: 'Muscle mass must be a valid positive number'
    }
  },
  bmi: {
    type: Number,
    min: [0, 'BMI cannot be negative'],
    validate: {
      validator: function(value) {
        return value === undefined || value === null || (Number.isFinite(value) && value >= 0);
      },
      message: 'BMI must be a valid positive number'
    }
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
bodyWeightSchema.index({ date: -1 });
bodyWeightSchema.index({ createdBy: 1, date: -1 });

// Virtual for formatted weight
bodyWeightSchema.virtual('formattedWeight').get(function() {
  return `${this.weight.toFixed(1)} ${this.unit}`;
});

// Virtual for month/year grouping
bodyWeightSchema.virtual('monthYear').get(function() {
  const date = new Date(this.date);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
});

// Static methods for analytics
bodyWeightSchema.statics.getWeightTrend = function(startDate, endDate, userId = null) {
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
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          day: { $dayOfMonth: '$date' }
        },
        avgWeight: { $avg: '$weight' },
        minWeight: { $min: '$weight' },
        maxWeight: { $max: '$weight' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);
};

bodyWeightSchema.statics.getMonthlyAverage = function(year, month, userId = null) {
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
        avgWeight: { $avg: '$weight' },
        minWeight: { $min: '$weight' },
        maxWeight: { $max: '$weight' },
        count: { $sum: 1 },
        avgBodyFat: { $avg: '$bodyFatPercentage' },
        avgMuscleMass: { $avg: '$muscleMass' }
      }
    }
  ]);
};

bodyWeightSchema.statics.getWeightStats = function(userId = null) {
  const matchQuery = {};
  
  if (userId) {
    matchQuery.createdBy = userId;
  }
  
  return this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalEntries: { $sum: 1 },
        avgWeight: { $avg: '$weight' },
        minWeight: { $min: '$weight' },
        maxWeight: { $max: '$weight' },
        latestWeight: { $last: '$weight' },
        firstWeight: { $first: '$weight' }
      }
    }
  ]);
};

// Pre-save middleware
bodyWeightSchema.pre('save', function(next) {
  // Ensure weight is rounded to 1 decimal place
  if (this.weight) {
    this.weight = Math.round(this.weight * 10) / 10;
  }
  
  // Round body fat percentage to 1 decimal place
  if (this.bodyFatPercentage) {
    this.bodyFatPercentage = Math.round(this.bodyFatPercentage * 10) / 10;
  }
  
  // Round muscle mass to 1 decimal place
  if (this.muscleMass) {
    this.muscleMass = Math.round(this.muscleMass * 10) / 10;
  }
  
  // Round BMI to 1 decimal place
  if (this.bmi) {
    this.bmi = Math.round(this.bmi * 10) / 10;
  }
  
  next();
});

module.exports = mongoose.model('BodyWeight', bodyWeightSchema);
