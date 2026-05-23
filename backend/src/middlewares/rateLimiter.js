const rateLimit = require('express-rate-limit');

// 1. General API Rate Limiting Middleware (Good to Have 8)
exports.apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per minute
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after a minute'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

// 2. Stricter Rate Limiting for Auth Endpoints (Signup / Login) to prevent brute-force (Route 221-222)
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 login/register attempts per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// 3. Stricter Rate Limiting for search endpoints (Route 223)
exports.searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 search queries per minute
  message: {
    success: false,
    message: 'Too many search requests, please slow down'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// 4. Strict Admin Rate Limiting (Route 224)
exports.adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit admin requests
  message: {
    success: false,
    message: 'Strict limit reached for administrative endpoints. Try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// 5. Analytics APIs Protection (Route 225)
exports.analyticsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit analytic hits
  message: {
    success: false,
    message: 'Analytics query limit exceeded. Please limit your reporting calls to 30 requests every 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// 6. Export / Import Limits (Route 226-227)
exports.exportImportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Strict limit for heavy upload/download operations
  message: {
    success: false,
    message: 'File export/import rate limit exceeded. You can only perform this action 5 times every 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// 7. Random Endpoint Protection (Route 228)
exports.randomLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit random access
  message: {
    success: false,
    message: 'Too many requests to the random sample generator. Please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// 8. Stats APIs Protection (Route 229)
exports.statsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit stats hits
  message: {
    success: false,
    message: 'Statistics endpoint request limit exceeded. Slow down your queries.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

