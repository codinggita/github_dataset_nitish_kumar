const express = require('express');
const statsController = require('../controllers/statsController');
const datasetController = require('../controllers/datasetController');
const { statsLimiter } = require('../middlewares/rateLimiter');

const router = Router = express.Router();

// Apply stats rate limiter globally to all stats paths
router.use(statsLimiter);

// Explicit HEAD / OPTIONS for /datasets/count (Route 241)
router.route('/datasets/count')
  .get(statsController.getTotalCount)
  .head((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).end();
  })
  .options(datasetController.optionsHelper(['GET', 'HEAD', 'OPTIONS']));

// Define all other stats routes
router.get('/datasets/functions', statsController.getFunctionsCount);
router.get('/datasets/classes', statsController.getClassesCount);
router.get('/datasets/documentation', statsController.getDocumentationCount);
router.get('/datasets/readme', statsController.getReadmeCount);
router.get('/datasets/repos', statsController.getReposCount);
router.get('/datasets/languages', statsController.getLanguagesCount);
router.get('/datasets/frameworks', statsController.getFrameworksCount);
router.get('/datasets/github', statsController.getGithubCount);
router.get('/datasets/ai', statsController.getAICount);

module.exports = router;
