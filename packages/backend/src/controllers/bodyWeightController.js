const BodyWeight = require('../models/BodyWeight');
const { validationResult } = require('express-validator');

// Get all body weight entries
const getAllBodyWeights = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'date', 
      sortOrder = 'desc',
      startDate,
      endDate,
      unit
    } = req.query;

    // Build query
    const query = {};
    
    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    // Unit filter
    if (unit) {
      query.unit = unit;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const bodyWeights = await BodyWeight.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await BodyWeight.countDocuments(query);

    res.json({
      success: true,
      data: bodyWeights,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching body weights:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching body weight entries',
      error: error.message
    });
  }
};

// Get single body weight entry
const getBodyWeightById = async (req, res) => {
  try {
    const bodyWeight = await BodyWeight.findById(req.params.id);
    
    if (!bodyWeight) {
      return res.status(404).json({
        success: false,
        message: 'Body weight entry not found'
      });
    }

    res.json({
      success: true,
      data: bodyWeight
    });
  } catch (error) {
    console.error('Error fetching body weight:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching body weight entry',
      error: error.message
    });
  }
};

// Create new body weight entry
const createBodyWeight = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const bodyWeight = new BodyWeight(req.body);
    await bodyWeight.save();

    res.status(201).json({
      success: true,
      message: 'Body weight entry created successfully',
      data: bodyWeight
    });
  } catch (error) {
    console.error('Error creating body weight:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating body weight entry',
      error: error.message
    });
  }
};

// Update body weight entry
const updateBodyWeight = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const bodyWeight = await BodyWeight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!bodyWeight) {
      return res.status(404).json({
        success: false,
        message: 'Body weight entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Body weight entry updated successfully',
      data: bodyWeight
    });
  } catch (error) {
    console.error('Error updating body weight:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating body weight entry',
      error: error.message
    });
  }
};

// Delete body weight entry
const deleteBodyWeight = async (req, res) => {
  try {
    const bodyWeight = await BodyWeight.findByIdAndDelete(req.params.id);

    if (!bodyWeight) {
      return res.status(404).json({
        success: false,
        message: 'Body weight entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Body weight entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting body weight:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting body weight entry',
      error: error.message
    });
  }
};

// Get recent body weight entries (last 7 days)
const getRecentBodyWeights = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const bodyWeights = await BodyWeight.find({
      date: { $gte: sevenDaysAgo }
    })
    .sort({ date: -1 })
    .limit(10)
    .lean();

    res.json({
      success: true,
      data: bodyWeights
    });
  } catch (error) {
    console.error('Error fetching recent body weights:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent body weight entries',
      error: error.message
    });
  }
};

module.exports = {
  getAllBodyWeights,
  getBodyWeightById,
  createBodyWeight,
  updateBodyWeight,
  deleteBodyWeight,
  getRecentBodyWeights
};
