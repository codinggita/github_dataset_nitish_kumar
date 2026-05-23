const Dataset = require('../models/dataset');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Good to Have 1: API Response Standardization
const sendSuccess = (res, statusCode, data, message = 'Success') => {
  res.status(statusCode).json({
    success: true,
    message,
    results: Array.isArray(data) ? data.length : undefined,
    data
  });
};

// GET all datasets (basic fetch)
exports.getAllDatasets = catchAsync(async (req, res, next) => {
  // We only fetch non-deleted items
  const query = { isDeleted: { $ne: true } };
  
  // Basic query params (type, repo) if present
  if (req.query.type) {
    query['metadata.type'] = req.query.type;
  }
  if (req.query.repo) {
    query['metadata.repo_name'] = req.query.repo;
  }
  
  // Simple pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const skip = (page - 1) * limit;

  const datasets = await Dataset.find(query)
    .skip(skip)
    .limit(limit);

  sendSuccess(res, 200, datasets, 'Datasets retrieved successfully');
});

// GET dataset by ID
exports.getDatasetById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // We search by either custom id or Mongoose ObjectId
  let dataset;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    dataset = await Dataset.findOne({ _id: id, isDeleted: { $ne: true } });
  } else {
    dataset = await Dataset.findOne({ id: id, isDeleted: { $ne: true } });
  }

  if (!dataset) {
    return next(new AppError(`No dataset found with ID: ${id}`, 404));
  }

  sendSuccess(res, 200, dataset, 'Dataset retrieved successfully');
});

// POST create dataset
exports.createDataset = catchAsync(async (req, res, next) => {
  const { id, instruction, input, output, metadata } = req.body;

  // Basic validation (Error Handling Route 195)
  if (!id || !instruction || !output || !metadata) {
    return next(new AppError('Required fields: id, instruction, output, metadata are missing', 400));
  }

  // Check if id already exists
  const existing = await Dataset.findOne({ id });
  if (existing) {
    return next(new AppError(`Dataset with ID: ${id} already exists`, 400));
  }

  const newDataset = await Dataset.create({
    id,
    instruction,
    input: input || '',
    output,
    metadata,
    isDeleted: false
  });

  sendSuccess(res, 210, newDataset, 'Dataset created successfully');
});

// PUT/PATCH update dataset
exports.updateDataset = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let dataset;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    dataset = await Dataset.findOne({ _id: id, isDeleted: { $ne: true } });
  } else {
    dataset = await Dataset.findOne({ id: id, isDeleted: { $ne: true } });
  }

  if (!dataset) {
    return next(new AppError(`No dataset found with ID: ${id}`, 404));
  }

  // Good to Have 5: Custom Data Validation Layer
  const allowedFields = ['instruction', 'input', 'output', 'metadata'];
  allowedFields.forEach(el => {
    if (req.body[el] !== undefined) {
      if (el === 'metadata') {
        dataset.metadata = { ...dataset.metadata.toObject(), ...req.body.metadata };
      } else {
        dataset[el] = req.body[el];
      }
    }
  });

  await dataset.save();

  sendSuccess(res, 200, dataset, 'Dataset updated successfully');
});

// DELETE dataset (Soft delete)
exports.deleteDataset = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let dataset;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    dataset = await Dataset.findOne({ _id: id, isDeleted: { $ne: true } });
  } else {
    dataset = await Dataset.findOne({ id: id, isDeleted: { $ne: true } });
  }

  if (!dataset) {
    return next(new AppError(`No dataset found with ID: ${id}`, 404));
  }

  // Soft delete (Good to Have 6)
  dataset.isDeleted = true;
  await dataset.save();

  sendSuccess(res, 200, null, 'Dataset deleted successfully (soft delete)');
});

// POST Bulk Create Datasets
exports.bulkCreateDatasets = catchAsync(async (req, res, next) => {
  const datasets = Array.isArray(req.body) ? req.body : req.body.datasets;

  if (!datasets || !Array.isArray(datasets) || datasets.length === 0) {
    return next(new AppError('Please provide an array of dataset records', 400));
  }

  // Pre-validate that all records have required fields
  for (const item of datasets) {
    if (!item.id || !item.instruction || !item.output || !item.metadata) {
      return next(new AppError(`Record with ID ${item.id || 'unknown'} is missing required fields`, 400));
    }
    item.isDeleted = false;
  }

  const createdDocs = await Dataset.insertMany(datasets);
  sendSuccess(res, 210, createdDocs, `${createdDocs.length} datasets created successfully in bulk`);
});

// PATCH Bulk Update Datasets
exports.bulkUpdateDatasets = catchAsync(async (req, res, next) => {
  const { updates, filter, update } = req.body;

  if (updates && Array.isArray(updates)) {
    const bulkOps = updates.map(item => {
      const { id, ...updateFields } = item;
      return {
        updateOne: {
          filter: { id, isDeleted: { $ne: true } },
          update: { $set: updateFields }
        }
      };
    });

    const result = await Dataset.bulkWrite(bulkOps);
    return sendSuccess(res, 200, result, 'Bulk write operations completed successfully');
  }

  if (filter && update) {
    const result = await Dataset.updateMany(
      { ...filter, isDeleted: { $ne: true } },
      { $set: update }
    );
    return sendSuccess(res, 200, result, 'Bulk update matching documents completed successfully');
  }

  return next(new AppError('Provide either an "updates" array or "filter" and "update" objects', 400));
});

// DELETE Bulk Delete Datasets (Soft delete)
exports.bulkDeleteDatasets = catchAsync(async (req, res, next) => {
  const ids = req.body.ids || req.query.ids;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return next(new AppError('Please provide an array of dataset IDs in "ids"', 400));
  }

  const result = await Dataset.updateMany(
    { id: { $in: ids }, isDeleted: { $ne: true } },
    { $set: { isDeleted: true } }
  );

  sendSuccess(res, 200, result, `${result.modifiedCount} datasets deleted successfully in bulk`);
});

// GET Check Dataset Existence
exports.checkDatasetExistence = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let exists = false;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    exists = await Dataset.exists({ _id: id, isDeleted: { $ne: true } });
  } else {
    exists = await Dataset.exists({ id: id, isDeleted: { $ne: true } });
  }

  res.status(200).json({
    success: true,
    exists: !!exists,
    message: exists ? 'Dataset exists' : 'Dataset does not exist'
  });
});

