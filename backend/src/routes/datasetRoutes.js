const express = require('express');
const datasetController = require('../controllers/datasetController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { apiLimiter, adminLimiter, exportImportLimiter, randomLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

// OPTIONS and HEAD for System Health (Route 244, 251)
router.get('/system/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});
router.head('/system/health', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).end();
});
router.options('/system/health', datasetController.optionsHelper(['GET', 'HEAD', 'OPTIONS']));

// Extra utility and advanced endpoints (PR 14 - Route 228, 232-235, 238, 245)
router.route('/random')
  .get(randomLimiter, datasetController.getRandomDataset)
  .head(randomLimiter, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).end();
  })
  .options(datasetController.optionsHelper(['GET', 'HEAD', 'OPTIONS']));

router.route('/trending')
  .get(datasetController.getTrendingDatasets)
  .options(datasetController.optionsHelper(['GET', 'OPTIONS']));

router.route('/recent')
  .get(datasetController.getRecentDatasets)
  .options(datasetController.optionsHelper(['GET', 'OPTIONS']));

router.route('/recommendations')
  .get(datasetController.getDatasetRecommendations)
  .options(datasetController.optionsHelper(['GET', 'OPTIONS']));

router.route('/export/csv')
  .get(exportImportLimiter, datasetController.exportCSV)
  .options(datasetController.optionsHelper(['GET', 'OPTIONS']));

router.route('/import-json')
  .post(exportImportLimiter, datasetController.importJSON)
  .options(datasetController.optionsHelper(['POST', 'OPTIONS']));

// Basic CRUD Collection Route (Route 3-8, 238, 245)
router.route('/')
  .get(apiLimiter, datasetController.getAllDatasets)
  .post(datasetController.createDataset)
  .head(datasetController.headDatasets)
  .options(datasetController.optionsDatasets);

// Admin and Protected API mappings (Route 160-164, 248)
router.route('/admin/datasets')
  .get(adminLimiter, protect, restrictTo('admin'), datasetController.getAllDatasets)
  .options(datasetController.optionsHelper(['GET', 'OPTIONS']));

router.post('/protected/datasets', protect, datasetController.createDataset);
router.patch('/protected/datasets/:id', protect, datasetController.updateDataset);
router.delete('/protected/datasets/:id', protect, datasetController.deleteDataset);
router.post('/protected/datasets/:id/restore', protect, restrictTo('admin'), datasetController.restoreDataset);

// Bulk CRUD and check endpoints (placed before parameter routes to avoid collisions)
router.post('/bulk-create', datasetController.bulkCreateDatasets);
router.patch('/bulk-update', datasetController.bulkUpdateDatasets);
router.delete('/bulk-delete', datasetController.bulkDeleteDatasets);
router.post('/bulk-restore', protect, restrictTo('admin'), datasetController.bulkRestoreDatasets);
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

// Hardcoded Filter Endpoints (GET /datasets/filter/...)
router.get('/filter/readme', datasetController.getReadmeDatasets);
router.get('/filter/functions', datasetController.getFunctionDatasets);
router.get('/filter/classes', datasetController.getClassDatasets);
router.get('/filter/documentation', datasetController.getDocumentationDatasets);
router.get('/filter/github', datasetController.getGithubDatasets);
router.get('/filter/python', datasetController.getPythonDatasets);
router.get('/filter/ml', datasetController.getMLDatasets);
router.get('/filter/ai', datasetController.getAIDatasets);
router.get('/filter/frameworks', datasetController.getAIDatasets);
router.get('/filter/docstrings', datasetController.getDocstringDatasets);

// Specialized Sorting Routes (Must be before generic route parameters to avoid collisions)
router.get('/sort/recent', datasetController.sortRecentDatasets);
router.get('/sort/name', datasetController.sortAlphabeticalDatasets);
router.get('/sort/type-desc', datasetController.sortTypeDescDatasets);
router.get('/sort/repo-desc', datasetController.sortRepoDescDatasets);

// Dynamic Parameter-based Filter Routes
router.get('/type/:type', datasetController.getDatasetsByType);

// Repo parameter wildcard (Wildcard matches slashes in repo names) (Route 240)
router.route('/repo/*')
  .get(datasetController.getDatasetsByRepo)
  .head(datasetController.headDatasetsByRepo)
  .options(datasetController.optionsHelper(['GET', 'HEAD', 'OPTIONS']));

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

// Member Routes (Route 4-8, 239, 246)
router.route('/:id')
  .get(datasetController.getDatasetById)
  .put(datasetController.updateDataset)
  .patch(datasetController.updateDataset)
  .delete(datasetController.deleteDataset)
  .head(datasetController.headDatasetById)
  .options(datasetController.optionsDatasetById);

module.exports = router;
