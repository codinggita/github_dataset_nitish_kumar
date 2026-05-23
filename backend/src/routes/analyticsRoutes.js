const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const datasetController = require('../controllers/datasetController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { analyticsLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

// Apply analytics rate limiter globally to all analytics paths in this router
router.use(analyticsLimiter);

// Admin analytics route (Route 161)
router.route('/admin/analytics')
  .get(protect, restrictTo('admin'), analyticsController.getTypeAnalysis)
  .options(datasetController.optionsHelper(['GET', 'OPTIONS']));

// Explicit HEAD / OPTIONS for /datasets/type-analysis (Route 242)
router.route('/datasets/type-analysis')
  .get(analyticsController.getTypeAnalysis)
  .head((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).end();
  })
  .options(datasetController.optionsHelper(['GET', 'HEAD', 'OPTIONS']));

// Define all other analytics routes
router.get('/datasets/repo-analysis', analyticsController.getRepoAnalysis);
router.get('/datasets/source-analysis', analyticsController.getSourceAnalysis);
router.get('/datasets/framework-analysis', analyticsController.getFrameworkAnalysis);
router.get('/datasets/language-analysis', analyticsController.getLanguageAnalysis);
router.get('/datasets/code-analysis', analyticsController.getCodeAnalysis);
router.get('/datasets/doc-analysis', analyticsController.getDocAnalysis);
router.get('/datasets/readme-analysis', analyticsController.getReadmeAnalysis);
router.get('/datasets/ml-analysis', analyticsController.getMLAnalysis);
router.get('/datasets/ai-analysis', analyticsController.getAIAnalysis);

module.exports = router;
