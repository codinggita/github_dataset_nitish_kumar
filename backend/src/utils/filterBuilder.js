/**
 * Dynamic Filter Builder Utility (Good to Have 12)
 * Converts Express query parameters into Mongoose/MongoDB query filters.
 */
const buildFilters = (queryParams) => {
  const query = { isDeleted: { $ne: true } };

  // 1. Direct Metadata Mappings
  if (queryParams.type) {
    query['metadata.type'] = queryParams.type;
  }
  if (queryParams.repo) {
    query['metadata.repo_name'] = queryParams.repo;
  }
  if (queryParams.source) {
    // Matches either source_type or source name
    query.$or = [
      { 'metadata.source_type': queryParams.source },
      { 'metadata.source': queryParams.source }
    ];
  }
  if (queryParams.docType) {
    query['metadata.doc_type'] = queryParams.docType;
  }
  if (queryParams.codeElement) {
    query['metadata.code_element'] = queryParams.codeElement;
  }
  if (queryParams.isReadme) {
    // Parse string to boolean
    query['metadata.is_readme'] = queryParams.isReadme === 'true';
  }

  // 2. Heuristic Heuristics Filters
  // Language filter
  if (queryParams.language) {
    const lang = queryParams.language.toLowerCase();
    if (lang === 'python' || lang === 'py') {
      query.$or = [
        { 'metadata.file_path': /\.py$/i },
        { 'metadata.repo_name': /python/i }
      ];
    } else if (lang === 'markdown' || lang === 'md') {
      query['metadata.doc_type'] = 'md';
    } else {
      const regex = new RegExp(queryParams.language, 'i');
      query.$or = [
        { 'metadata.file_path': regex },
        { instruction: regex },
        { output: regex }
      ];
    }
  }

  // Framework filter
  if (queryParams.framework) {
    const regex = new RegExp(queryParams.framework, 'i');
    query.$or = [
      { 'metadata.repo_name': regex },
      { instruction: regex },
      { output: regex }
    ];
  }

  // Task filter
  if (queryParams.task) {
    const regex = new RegExp(queryParams.task, 'i');
    query.$or = [
      { id: regex },
      { instruction: regex },
      { input: regex }
    ];
  }

  // Category filter
  if (queryParams.category) {
    const cat = queryParams.category.toLowerCase();
    if (cat === 'ai') {
      query.$or = [
        { 'metadata.repo_name': /transformers|huggingface|llm|gpt|openai|llama|deepseek|keras|pytorch|tensorflow/i },
        { instruction: /artificial intelligence|deep learning|neural network|llm|gpt|transformer|openai|ai/i }
      ];
    } else if (cat === 'ml') {
      query.$or = [
        { 'metadata.repo_name': /machine-learning|ml|classification|regression|scikit|sklearn|pandas|numpy/i },
        { instruction: /machine learning|classification|regression|dataset|supervised|unsupervised/i }
      ];
    } else {
      const regex = new RegExp(queryParams.category, 'i');
      query.$or = [
        { 'metadata.type': regex },
        { 'metadata.code_element': regex },
        { instruction: regex }
      ];
    }
  }

  // 3. Fuzzy Text Keyword Search
  if (queryParams.search) {
    const regex = new RegExp(queryParams.search, 'i'); // Good to Have 9: Regex case-insensitive search
    const searchConditions = [
      { id: regex },
      { instruction: regex },
      { input: regex },
      { output: regex },
      { 'metadata.repo_name': regex }
    ];
    
    // Combine search conditions with other queries safely
    if (query.$or) {
      // If we already have $or conditions, nest them inside $and to avoid overriding
      query.$and = [
        { $or: query.$or },
        { $or: searchConditions }
      ];
      delete query.$or;
    } else {
      query.$or = searchConditions;
    }
  }

  return query;
};

module.exports = buildFilters;
