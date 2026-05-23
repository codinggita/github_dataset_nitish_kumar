const express = require('express');
const authController = require('../controllers/authController');
const datasetController = require('../controllers/datasetController');
const { protect } = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

// Apply auth rate limiter for authentication endpoints (login, register, forgot-password, reset-password, send-otp)
router.route('/register')
  .post(authLimiter, authController.register)
  .options(datasetController.optionsHelper(['POST', 'OPTIONS']));

router.route('/login')
  .post(authLimiter, authController.login)
  .options(datasetController.optionsHelper(['POST', 'OPTIONS']));

router.route('/logout')
  .post(authController.logout)
  .options(datasetController.optionsHelper(['POST', 'OPTIONS']));

router.route('/forgot-password')
  .post(authLimiter, authController.forgotPassword)
  .options(datasetController.optionsHelper(['POST', 'OPTIONS']));

router.route('/reset-password')
  .post(authLimiter, authController.resetPassword)
  .options(datasetController.optionsHelper(['POST', 'OPTIONS']));

router.route('/send-otp')
  .post(authLimiter, authController.sendOTP)
  .options(datasetController.optionsHelper(['POST', 'OPTIONS']));

router.route('/verify-email')
  .post(authLimiter, authController.verifyEmail)
  .options(datasetController.optionsHelper(['POST', 'OPTIONS']));

// Profile endpoints (with HEAD & OPTIONS) (Route 175-176, 243)
router.route('/profile')
  .all(protect)
  .get(authController.getProfile)
  .patch(authController.updateProfile)
  .head((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).end();
  })
  .options(datasetController.optionsHelper(['GET', 'PATCH', 'HEAD', 'OPTIONS']));

router.post('/change-password', protect, authController.changePassword);

module.exports = router;
