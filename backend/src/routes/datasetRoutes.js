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

// Static Filter Routes (Must be before generic route parameters like :id)
router.get('/readme', datasetController.getReadmeDatasets);
router.get('/functions', datasetController.getFunctionDatasets);
router.get('/classes', datasetController.getClassDatasets);
router.get('/documentation', datasetController.getDocumentationDatasets);
router.get('/github', datasetController.getGithubDatasets);
router.get('/python', datasetController.getPythonDatasets);
router.get('/ml', datasetController.getMLDatasets);
router.get('/ai', datasetController.getAIDatasets);
router.get('/code-generation', datasetController.getCodeGenerationDatasets);
router.get('/docstrings', datasetController.getDocstringDatasets);

// Dynamic Parameter-based Filter Routes
router.get('/type/:type', datasetController.getDatasetsByType);
router.get('/repo/*', datasetController.getDatasetsByRepo); // Wildcard matches slashes in repo names (e.g. ultralytics/yolov5)
router.get('/source/:source', datasetController.getDatasetsBySource);
router.get('/doc/:docType', datasetController.getDatasetsByDocType);
router.get('/doc-type/:docType', datasetController.getDatasetsByDocType);
router.get('/code/:element', datasetController.getDatasetsByCodeElement);
router.get('/code-element/:element', datasetController.getDatasetsByCodeElement);

// Advanced Parameter Heuristic Routes (Good to Have 12: Dynamic Filter Builder prep)
router.get('/task/:task', datasetController.getDatasetsByTask);
router.get('/model/:model', datasetController.getDatasetsByModel);
router.get('/framework/:framework', datasetController.getDatasetsByFramework);
router.get('/library/:library', datasetController.getDatasetsByLibrary);
router.get('/language/:language', datasetController.getDatasetsByLanguage);
router.get('/category/:category', datasetController.getDatasetsByCategory);

router.route('/:id')
  .get(datasetController.getDatasetById)
  .put(datasetController.updateDataset)
  .patch(datasetController.updateDataset)
  .delete(datasetController.deleteDataset);

module.exports = router;
