const Dataset = require('../models/dataset');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const buildFilters = require('../utils/filterBuilder');

// Good to Have 1: API Response Standardization
const sendSuccess = (res, statusCode, data, message = 'Success') => {
  res.status(statusCode).json({
    success: true,
    message,
    results: Array.isArray(data) ? data.length : undefined,
    data
  });
};

// GET all datasets (basic fetch & dynamic queries)
exports.getAllDatasets = catchAsync(async (req, res, next) => {
  // Good to Have 12: Build filters dynamically from query parameters
  const query = buildFilters(req.query);
  
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

// Helper for fetching filtered query results with pagination (Good to Have 11: Reusable Pagination Utility)
const fetchAndSendDatasets = async (req, res, filterQuery, successMsg) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const skip = (page - 1) * limit;

  const datasets = await Dataset.find(filterQuery)
    .skip(skip)
    .limit(limit);

  sendSuccess(res, 200, datasets, successMsg);
};

// GET Datasets by Type parameter
exports.getDatasetsByType = catchAsync(async (req, res, next) => {
  const { type } = req.params;
  const query = { 'metadata.type': type, isDeleted: { $ne: true } };
  await fetchAndSendDatasets(req, res, query, `Datasets of type '${type}' retrieved successfully`);
});

// GET Datasets by Repo parameter (handles slashes dynamically)
exports.getDatasetsByRepo = catchAsync(async (req, res, next) => {
  // Capture repo parameter which could be the full route matched by wildcard *
  const repo = req.params.repo || req.params[0];
  if (!repo) {
    return next(new AppError('Repository parameter is missing', 400));
  }
  const query = { 'metadata.repo_name': repo, isDeleted: { $ne: true } };
  await fetchAndSendDatasets(req, res, query, `Datasets for repository '${repo}' retrieved successfully`);
});

// GET Datasets by Source parameter
exports.getDatasetsBySource = catchAsync(async (req, res, next) => {
  const { source } = req.params;
  const query = { 'metadata.source_type': source, isDeleted: { $ne: true } };
  await fetchAndSendDatasets(req, res, query, `Datasets with source type '${source}' retrieved successfully`);
});

// GET Datasets by Doc Type parameter
exports.getDatasetsByDocType = catchAsync(async (req, res, next) => {
  const docType = req.params.docType || req.params.doc;
  const query = { 'metadata.doc_type': docType, isDeleted: { $ne: true } };
  await fetchAndSendDatasets(req, res, query, `Datasets with document type '${docType}' retrieved successfully`);
});

// GET Datasets by Code Element parameter
exports.getDatasetsByCodeElement = catchAsync(async (req, res, next) => {
  const element = req.params.element || req.params.code;
  const query = { 'metadata.code_element': element, isDeleted: { $ne: true } };
  await fetchAndSendDatasets(req, res, query, `Datasets with code element '${element}' retrieved successfully`);
});

// GET README based datasets
exports.getReadmeDatasets = catchAsync(async (req, res, next) => {
  const query = { 'metadata.is_readme': true, isDeleted: { $ne: true } };
  await fetchAndSendDatasets(req, res, query, 'README-based datasets retrieved successfully');
});

// GET Function implementation datasets
exports.getFunctionDatasets = catchAsync(async (req, res, next) => {
  const query = {
    isDeleted: { $ne: true },
    $or: [
      { 'metadata.type': { $in: ['function', 'function_implementation'] } },
      { 'metadata.code_element': 'function' }
    ]
  };
  await fetchAndSendDatasets(req, res, query, 'Function implementation datasets retrieved successfully');
});

// GET Class implementation datasets
exports.getClassDatasets = catchAsync(async (req, res, next) => {
  const query = {
    isDeleted: { $ne: true },
    $or: [
      { 'metadata.type': { $in: ['class', 'class_implementation'] } },
      { 'metadata.code_element': 'class' }
    ]
  };
  await fetchAndSendDatasets(req, res, query, 'Class implementation datasets retrieved successfully');
});

// GET Documentation datasets
exports.getDocumentationDatasets = catchAsync(async (req, res, next) => {
  const query = {
    isDeleted: { $ne: true },
    $or: [
      { 'metadata.type': 'documentation' },
      { 'metadata.doc_type': { $exists: true } }
    ]
  };
  await fetchAndSendDatasets(req, res, query, 'Documentation datasets retrieved successfully');
});

// GET GitHub repository datasets
exports.getGithubDatasets = catchAsync(async (req, res, next) => {
  const query = { 'metadata.source_type': 'github_repository', isDeleted: { $ne: true } };
  await fetchAndSendDatasets(req, res, query, 'GitHub repository datasets retrieved successfully');
});

// GET Python related datasets
exports.getPythonDatasets = catchAsync(async (req, res, next) => {
  const query = {
    isDeleted: { $ne: true },
    $or: [
      { 'metadata.file_path': /\.py$/i },
      { 'metadata.repo_name': /python/i }
    ]
  };
  await fetchAndSendDatasets(req, res, query, 'Python-related datasets retrieved successfully');
});

// GET Machine learning datasets
exports.getMLDatasets = catchAsync(async (req, res, next) => {
  const query = {
    isDeleted: { $ne: true },
    $or: [
      { 'metadata.repo_name': /machine-learning|ml|classification|regression|scikit|sklearn|pandas|numpy/i },
      { instruction: /machine learning|classification|regression|dataset|supervised|unsupervised/i },
      { input: /machine learning|classification|regression|dataset|supervised|unsupervised/i }
    ]
  };
  await fetchAndSendDatasets(req, res, query, 'Machine learning datasets retrieved successfully');
});

// GET AI related datasets
exports.getAIDatasets = catchAsync(async (req, res, next) => {
  const query = {
    isDeleted: { $ne: true },
    $or: [
      { 'metadata.repo_name': /transformers|huggingface|llm|gpt|openai|llama|deepseek|keras|pytorch|tensorflow|atomic-agents/i },
      { instruction: /artificial intelligence|deep learning|neural network|llm|gpt|transformer|openai|ai/i },
      { input: /artificial intelligence|deep learning|neural network|llm|gpt|transformer|openai|ai/i }
    ]
  };
  await fetchAndSendDatasets(req, res, query, 'AI-related datasets retrieved successfully');
});

// GET Code generation datasets
exports.getCodeGenerationDatasets = catchAsync(async (req, res, next) => {
  const query = {
    isDeleted: { $ne: true },
    'metadata.type': { $in: ['function_implementation', 'class_implementation'] }
  };
  await fetchAndSendDatasets(req, res, query, 'Code generation datasets retrieved successfully');
});

// GET Docstring generation datasets
exports.getDocstringDatasets = catchAsync(async (req, res, next) => {
  const query = { 'metadata.type': 'docstring_generation', isDeleted: { $ne: true } };
  await fetchAndSendDatasets(req, res, query, 'Docstring generation datasets retrieved successfully');
});

// GET Datasets by Task parameter (heuristics regex search)
exports.getDatasetsByTask = catchAsync(async (req, res, next) => {
  const { task } = req.params;
  const regex = new RegExp(task, 'i');
  
  const query = {
    isDeleted: { $ne: true },
    $or: [
      { id: regex },
      { instruction: regex },
      { input: regex }
    ]
  };
  await fetchAndSendDatasets(req, res, query, `Datasets matching task '${task}' retrieved successfully`);
});

// GET Datasets by Model parameter (heuristics regex search)
exports.getDatasetsByModel = catchAsync(async (req, res, next) => {
  const { model } = req.params;
  const regex = new RegExp(model, 'i');

  const query = {
    isDeleted: { $ne: true },
    $or: [
      { 'metadata.repo_name': regex },
      { instruction: regex },
      { input: regex }
    ]
  };
  await fetchAndSendDatasets(req, res, query, `Datasets matching model '${model}' retrieved successfully`);
});

// GET Datasets by Framework parameter (heuristics regex search)
exports.getDatasetsByFramework = catchAsync(async (req, res, next) => {
  const { framework } = req.params;
  const regex = new RegExp(framework, 'i');

  const query = {
    isDeleted: { $ne: true },
    $or: [
      { 'metadata.repo_name': regex },
      { instruction: regex },
      { output: regex }
    ]
  };
  await fetchAndSendDatasets(req, res, query, `Datasets matching framework '${framework}' retrieved successfully`);
});

// GET Datasets by Library parameter (heuristics regex search)
exports.getDatasetsByLibrary = catchAsync(async (req, res, next) => {
  const { library } = req.params;
  const regex = new RegExp(library, 'i');

  const query = {
    isDeleted: { $ne: true },
    $or: [
      { 'metadata.repo_name': regex },
      { 'metadata.file_path': regex },
      { output: regex }
    ]
  };
  await fetchAndSendDatasets(req, res, query, `Datasets matching library '${library}' retrieved successfully`);
});

// GET Datasets by Language parameter (heuristics regex search)
exports.getDatasetsByLanguage = catchAsync(async (req, res, next) => {
  const { language } = req.params;
  
  let query = { isDeleted: { $ne: true } };
  
  if (language.toLowerCase() === 'python' || language.toLowerCase() === 'py') {
    query.$or = [
      { 'metadata.file_path': /\.py$/i },
      { 'metadata.repo_name': /python/i }
    ];
  } else if (language.toLowerCase() === 'markdown' || language.toLowerCase() === 'md') {
    query['metadata.doc_type'] = 'md';
  } else {
    const regex = new RegExp(language, 'i');
    query.$or = [
      { 'metadata.file_path': regex },
      { instruction: regex },
      { output: regex }
    ];
  }

  await fetchAndSendDatasets(req, res, query, `Datasets matching language '${language}' retrieved successfully`);
});

// GET Datasets by Category parameter (heuristics regex search)
exports.getDatasetsByCategory = catchAsync(async (req, res, next) => {
  const { category } = req.params;
  let query = { isDeleted: { $ne: true } };

  if (category.toLowerCase() === 'ai') {
    query.$or = [
      { 'metadata.repo_name': /transformers|huggingface|llm|gpt|openai|llama|deepseek|keras|pytorch|tensorflow|atomic-agents/i },
      { instruction: /artificial intelligence|deep learning|neural network|llm|gpt|transformer|openai|ai/i }
    ];
  } else if (category.toLowerCase() === 'ml') {
    query.$or = [
      { 'metadata.repo_name': /machine-learning|ml|classification|regression|scikit|sklearn|pandas|numpy/i },
      { instruction: /machine learning|classification|regression|dataset|supervised|unsupervised/i }
    ];
  } else {
    const regex = new RegExp(category, 'i');
    query.$or = [
      { 'metadata.type': regex },
      { 'metadata.code_element': regex },
      { instruction: regex }
    ];
  }

  await fetchAndSendDatasets(req, res, query, `Datasets matching category '${category}' retrieved successfully`);
});



