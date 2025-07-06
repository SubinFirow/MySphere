const express = require('express');
const router = express.Router();

// Import controllers
const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');

const {
  getExpenseSummary,
  getExpenseTrends,
  getTopCategories,
  getExpenseStats
} = require('../controllers/expenseAnalyticsController');

// Validation middleware
const validateExpense = (req, res, next) => {
  const { title, amount, paymentType, category } = req.body;
  
  const errors = [];
  
  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (!amount || isNaN(amount) || amount <= 0) {
    errors.push('Amount must be a positive number');
  }
  
  if (!paymentType || !['cash', 'card', 'upi'].includes(paymentType)) {
    errors.push('Payment type must be cash, card, or upi');
  }
  
  const validCategories = [
    'food', 'transportation', 'entertainment', 'shopping', 'bills',
    'healthcare', 'education', 'travel', 'groceries', 'fuel',
    'rent', 'utilities', 'insurance', 'investment', 'charity', 'other'
  ];
  
  if (!category || !validCategories.includes(category)) {
    errors.push('Please select a valid category');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

// Analytics routes (should come before parameterized routes)
router.get('/analytics/summary', getExpenseSummary);
router.get('/analytics/trends', getExpenseTrends);
router.get('/analytics/top-categories', getTopCategories);
router.get('/analytics/stats', getExpenseStats);

// CRUD routes
router.route('/')
  .get(getExpenses)
  .post(validateExpense, createExpense);

router.route('/:id')
  .get(getExpenseById)
  .put(validateExpense, updateExpense)
  .delete(deleteExpense);

// Additional utility routes
router.get('/categories/list', (req, res) => {
  const categories = [
    { value: 'food', label: 'Food & Dining', icon: '🍽️' },
    { value: 'transportation', label: 'Transportation', icon: '🚗' },
    { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' },
    { value: 'bills', label: 'Bills & Utilities', icon: '📄' },
    { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
    { value: 'education', label: 'Education', icon: '📚' },
    { value: 'travel', label: 'Travel', icon: '✈️' },
    { value: 'groceries', label: 'Groceries', icon: '🛒' },
    { value: 'fuel', label: 'Fuel', icon: '⛽' },
    { value: 'rent', label: 'Rent', icon: '🏠' },
    { value: 'utilities', label: 'Utilities', icon: '💡' },
    { value: 'insurance', label: 'Insurance', icon: '🛡️' },
    { value: 'investment', label: 'Investment', icon: '📈' },
    { value: 'charity', label: 'Charity', icon: '❤️' },
    { value: 'other', label: 'Other', icon: '📦' }
  ];
  
  res.json({
    success: true,
    data: categories
  });
});

router.get('/payment-types/list', (req, res) => {
  const paymentTypes = [
    { value: 'cash', label: 'Cash', icon: '💵' },
    { value: 'card', label: 'Card', icon: '💳' },
    { value: 'upi', label: 'UPI', icon: '📱' }
  ];
  
  res.json({
    success: true,
    data: paymentTypes
  });
});

module.exports = router;
