const express = require('express');
const { body } = require('express-validator');
const wholesaleController = require('../controllers/wholesaleController');

const router = express.Router();

// Validation rules for wholesale batch
const wholesaleValidation = [
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  
  body('investment_amount')
    .isNumeric()
    .withMessage('Investment amount must be a number')
    .isFloat({ min: 0 })
    .withMessage('Investment amount must be positive'),
  
  body('boxes_purchased')
    .isInt({ min: 1 })
    .withMessage('Boxes purchased must be at least 1'),
  
  body('profit_per_box')
    .isNumeric()
    .withMessage('Profit per box must be a number')
    .isFloat({ min: 0 })
    .withMessage('Profit per box must be positive'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
    .trim()
];

// Routes

// GET /api/wholesale - Get all wholesale batches with pagination and filtering
router.get('/', wholesaleController.getAllWholesale);

// GET /api/wholesale/recent - Get recent wholesale batches
router.get('/recent', wholesaleController.getRecentWholesale);

// GET /api/wholesale/analytics/summary - Get wholesale analytics summary
router.get('/analytics/summary', wholesaleController.getWholesaleAnalytics);

// GET /api/wholesale/analytics/trends - Get wholesale trends
router.get('/analytics/trends', wholesaleController.getWholesaleTrends);

// GET /api/wholesale/analytics/stats - Get overall wholesale statistics
router.get('/analytics/stats', wholesaleController.getWholesaleStats);

// GET /api/wholesale/analytics/tips - Get profit tips
router.get('/analytics/tips', wholesaleController.getProfitTips);

// GET /api/wholesale/:id - Get single wholesale batch by ID
router.get('/:id', wholesaleController.getWholesaleById);

// POST /api/wholesale - Create new wholesale batch
router.post('/', wholesaleValidation, wholesaleController.createWholesale);

// PUT /api/wholesale/:id - Update wholesale batch
router.put('/:id', wholesaleValidation, wholesaleController.updateWholesale);

// DELETE /api/wholesale/:id - Delete wholesale batch
router.delete('/:id', wholesaleController.deleteWholesale);

module.exports = router;
