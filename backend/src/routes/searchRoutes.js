const express = require('express');
const datasetController = require('../controllers/datasetController');
const { searchLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

// Search routes matching: GET /api/v1/search/datasets?q=keyword
router.route('/datasets')
  .get(searchLimiter, datasetController.searchDatasets)
  .options(datasetController.optionsHelper(['GET', 'OPTIONS']));

module.exports = router;
