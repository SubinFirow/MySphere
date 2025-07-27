const Wholesale = require("../models/Wholesale");
const { validationResult } = require("express-validator");

// Get all wholesale batches with pagination and filtering
exports.getAllWholesale = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    if (req.query.startDate && req.query.endDate) {
      filter.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    if (req.query.minInvestment) {
      filter.investment_amount = { $gte: parseFloat(req.query.minInvestment) };
    }

    if (req.query.maxInvestment) {
      filter.investment_amount = {
        ...filter.investment_amount,
        $lte: parseFloat(req.query.maxInvestment),
      };
    }

    // Get total count for pagination
    const totalItems = await Wholesale.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    // Get wholesale batches
    const wholesaleBatches = await Wholesale.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: wholesaleBatches,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching wholesale batches:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching wholesale batches",
      error: error.message,
    });
  }
};

// Get single wholesale batch by ID
exports.getWholesaleById = async (req, res) => {
  try {
    const wholesale = await Wholesale.findById(req.params.id);

    if (!wholesale) {
      return res.status(404).json({
        success: false,
        message: "Wholesale batch not found",
      });
    }

    res.json({
      success: true,
      data: wholesale,
    });
  } catch (error) {
    console.error("Error fetching wholesale batch:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching wholesale batch",
      error: error.message,
    });
  }
};

// Create new wholesale batch
exports.createWholesale = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const wholesale = new Wholesale(req.body);
    await wholesale.save();

    res.status(201).json({
      success: true,
      message: "Wholesale batch created successfully",
      data: wholesale,
    });
  } catch (error) {
    console.error("Error creating wholesale batch:", error);
    res.status(500).json({
      success: false,
      message: "Error creating wholesale batch",
      error: error.message,
    });
  }
};

// Update wholesale batch
exports.updateWholesale = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const wholesale = await Wholesale.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!wholesale) {
      return res.status(404).json({
        success: false,
        message: "Wholesale batch not found",
      });
    }

    res.json({
      success: true,
      message: "Wholesale batch updated successfully",
      data: wholesale,
    });
  } catch (error) {
    console.error("Error updating wholesale batch:", error);
    res.status(500).json({
      success: false,
      message: "Error updating wholesale batch",
      error: error.message,
    });
  }
};

// Delete wholesale batch
exports.deleteWholesale = async (req, res) => {
  try {
    const wholesale = await Wholesale.findByIdAndDelete(req.params.id);

    if (!wholesale) {
      return res.status(404).json({
        success: false,
        message: "Wholesale batch not found",
      });
    }

    res.json({
      success: true,
      message: "Wholesale batch deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting wholesale batch:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting wholesale batch",
      error: error.message,
    });
  }
};

// Get recent wholesale batches
exports.getRecentWholesale = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const recentBatches = await Wholesale.find()
      .sort({ date: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: recentBatches,
    });
  } catch (error) {
    console.error("Error fetching recent wholesale batches:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching recent wholesale batches",
      error: error.message,
    });
  }
};

// Get wholesale analytics summary
exports.getWholesaleAnalytics = async (req, res) => {
  try {
    const period = req.query.period || "monthly";
    const analytics = await Wholesale.getAnalytics(period);

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Error fetching wholesale analytics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching wholesale analytics",
      error: error.message,
    });
  }
};

// Get wholesale trends
exports.getWholesaleTrends = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const trends = await Wholesale.getTrends(months);

    res.json({
      success: true,
      data: trends,
    });
  } catch (error) {
    console.error("Error fetching wholesale trends:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching wholesale trends",
      error: error.message,
    });
  }
};

// Get profit tips
exports.getProfitTips = async (req, res) => {
  try {
    const tips = await Wholesale.getProfitTips();

    res.json({
      success: true,
      data: tips,
    });
  } catch (error) {
    console.error("Error fetching profit tips:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profit tips",
      error: error.message,
    });
  }
};

// Get overall wholesale statistics
exports.getWholesaleStats = async (req, res) => {
  try {
    const totalBatches = await Wholesale.countDocuments();
    const totalInvestment = await Wholesale.aggregate([
      { $group: { _id: null, total: { $sum: "$investment_amount" } } },
    ]);
    const totalPotentialProfit = await Wholesale.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: { $multiply: ["$boxes_purchased", "$profit_per_box"] },
          },
        },
      },
    ]);

    const stats = {
      totalBatches,
      totalInvestment: totalInvestment[0]?.total || 0,
      totalPotentialProfit: totalPotentialProfit[0]?.total || 0,
      averageInvestmentPerBatch:
        totalBatches > 0 ? (totalInvestment[0]?.total || 0) / totalBatches : 0,
    };

    stats.totalPotentialReturn =
      stats.totalInvestment + stats.totalPotentialProfit;
    stats.overallProfitMargin =
      stats.totalInvestment > 0
        ? ((stats.totalPotentialProfit / stats.totalInvestment) * 100).toFixed(
            2
          )
        : 0;

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching wholesale stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching wholesale stats",
      error: error.message,
    });
  }
};
