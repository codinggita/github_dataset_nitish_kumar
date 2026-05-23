const express = require('express');
const datasetController = require('../controllers/datasetController');

const router = express.Router();

// Define basic CRUD routes
router.route('/')
  .get(datasetController.getAllDatasets)
  .post(datasetController.createDataset);

// Bulk CRUD and check endpoints (placed before parameter routes to avoid collisions)
router.post('/bulk-create', datasetController.bulkCreateDatasets);
router.patch('/bulk-update', datasetController.bulkUpdateDatasets);
router.delete('/bulk-delete', datasetController.bulkDeleteDatasets);
router.get('/check/:id', datasetController.checkDatasetExistence);

router.route('/:id')
  .get(datasetController.getDatasetById)
  .put(datasetController.updateDataset)
  .patch(datasetController.updateDataset)
  .delete(datasetController.deleteDataset);

module.exports = router;
