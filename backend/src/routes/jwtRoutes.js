const express = require('express');
const authController = require('../controllers/authController');
const datasetController = require('../controllers/datasetController');
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

// Apply auth rate limiter for generating/verifying/refreshing tokens
router.route('/generate-token')
  .post(authLimiter, authController.generateToken)
  .options(datasetController.optionsHelper(['POST', 'OPTIONS']));

router.route('/verify-token')
  .post(authLimiter, authController.verifyToken)
  .options(datasetController.optionsHelper(['POST', 'OPTIONS']));

router.route('/refresh-token')
  .post(authLimiter, authController.refreshToken)
  .options(datasetController.optionsHelper(['POST', 'OPTIONS']));

router.route('/revoke-token')
  .delete(authController.revokeToken)
  .options(datasetController.optionsHelper(['DELETE', 'OPTIONS']));

// Protected JWT Routes (Good to Have 17)
router.use(protect);

router.route('/profile')
  .get(authController.getProfile)
  .options(datasetController.optionsHelper(['GET', 'OPTIONS']));

router.route('/dashboard')
  .get((req, res) => {
    res.status(200).json({
      success: true,
      message: `Access granted to JWT dashboard for user: ${req.user.name}`
    });
  })
  .options(datasetController.optionsHelper(['GET', 'OPTIONS']));

router.route('/private-datasets')
  .get(datasetController.getAllDatasets)
  .options(datasetController.optionsHelper(['GET', 'OPTIONS']));

router.route('/private-analytics')
  .get(analyticsController.getTypeAnalysis)
  .options(datasetController.optionsHelper(['GET', 'OPTIONS']));

module.exports = router;
