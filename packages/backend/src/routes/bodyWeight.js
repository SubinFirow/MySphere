const express = require('express');
const { body } = require('express-validator');
const {
  getAllBodyWeights,
  getBodyWeightById,
  createBodyWeight,
  updateBodyWeight,
  deleteBodyWeight,
  getRecentBodyWeights
} = require('../controllers/bodyWeightController');

const {
  getBodyWeightSummary,
  getBodyWeightTrends,
  getBodyWeightStats
} = require('../controllers/bodyWeightAnalyticsController');

const router = express.Router();

// Validation rules
const bodyWeightValidation = [
  body('weight')
    .isFloat({ min: 1, max: 1000 })
    .withMessage('Weight must be between 1 and 1000 kg'),
  body('unit')
    .optional()
    .isIn(['kg', 'lbs'])
    .withMessage('Unit must be either kg or lbs'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in valid ISO format')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('Date cannot be in the future');
      }
      return true;
    }),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
  body('bodyFatPercentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Body fat percentage must be between 0 and 100'),
  body('muscleMass')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Muscle mass must be a positive number'),
  body('bmi')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('BMI must be a positive number')
];

const updateBodyWeightValidation = [
  body('weight')
    .optional()
    .isFloat({ min: 1, max: 1000 })
    .withMessage('Weight must be between 1 and 1000 kg'),
  body('unit')
    .optional()
    .isIn(['kg', 'lbs'])
    .withMessage('Unit must be either kg or lbs'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in valid ISO format')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('Date cannot be in the future');
      }
      return true;
    }),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
  body('bodyFatPercentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Body fat percentage must be between 0 and 100'),
  body('muscleMass')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Muscle mass must be a positive number'),
  body('bmi')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('BMI must be a positive number')
];

// Analytics routes
router.get('/analytics/summary', getBodyWeightSummary);
router.get('/analytics/trends', getBodyWeightTrends);
router.get('/analytics/stats', getBodyWeightStats);

// CRUD routes
router.get('/recent', getRecentBodyWeights);
router.get('/', getAllBodyWeights);
router.get('/:id', getBodyWeightById);
router.post('/', bodyWeightValidation, createBodyWeight);
router.put('/:id', updateBodyWeightValidation, updateBodyWeight);
router.delete('/:id', deleteBodyWeight);

module.exports = router;
