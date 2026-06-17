# 🌟 GitHub Datasets - Enterprise Full-Stack Application (2026)

Welcome to the production-grade, enterprise-ready **GitHub Datasets** full-stack management platform. This application serves as a comprehensive portal to manage, query, filter, and analyze an extensive dataset containing over **115,011 GitHub repository records**.

The architecture combines a robust, highly-optimized **Node.js & Express MVC Backend** with a remote MongoDB cluster, and a high-performance **React 19 & Tailwind CSS v4 Frontend** state-managed via **Redux Toolkit**.

---

## 🔗 Live Project Deployments & Integrations

- **🖥️ Live Frontend Application**: [github-dataset-nitish-kumar.vercel.app](https://github-dataset-nitish-kumar.vercel.app/)
- **🚀 Live Backend API**: [github-dataset-nitish-kumaar.onrender.com/api/v1](https://github-dataset-nitish-kumaar.onrender.com/api/v1)
- **📬 Comprehensive Postman Documentation**: [Postman Collection Workspace API Documentation](https://documenter.getpostman.com/view/50841011/2sBXwtqpfD)

---

## 📁 Repository Structure & Organization

```text
github_dataset_nitish_kumar/
├── backend/                    # 🚀 Core Node.js / Express MVC API codebase
│   ├── src/
│   │   ├── config/             # MongoDB connection pool initialization
│   │   ├── controllers/        # Request controllers (CRUD, Analytics, Stats, Auth)
│   │   ├── middlewares/        # Express interceptors (Rate limit, Auth, global error handling)
│   │   ├── models/             # Mongoose Schemas (Dataset & User Models)
│   │   ├── routes/             # REST routing layers mapping endpoints
│   │   ├── scripts/            # Connection verification & test runner scripts
│   │   └── utils/              # Query builder, catchAsync, pagination, and unified error classes
│   ├── .env                    # Node application environmental variables
│   ├── .env.example            # Environment variables setup guide
│   ├── package.json            # Scripts runner and packages configuration
│   └── postman_collection.json  # Exported Postman JSON Collection (250+ routes)
├── frontend/                   # 🎨 React 19 & Tailwind CSS v4 Frontend Workspace
│   ├── src/
│   │   ├── components/         # Reusable widgets (FilterSidebar, Toast, BulkUpdateModal)
│   │   ├── pages/              # Primary view screen layouts (Landing, Stats, Analytics)
│   │   ├── services/           # Axios networking client and interceptors
│   │   ├── store/              # Redux slices and store setup
│   │   ├── App.jsx             # React router configuration and auth route guards
│   │   └── index.css           # Styling directives and custom Tailwind variables
│   ├── package.json            # Frontend script actions configuration
│   └── vite.config.js          # Vite HMR compiling configs
└── README.md                   # 🌟 Root repository entrypoint & roadmap (this file)
```

---

## ⚡ Quick Start & Run Locally

### 1. Backend Server Setup
```bash
cd backend
npm install
# Create .env file matching .env.example
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Configure VITE_API_URL=http://localhost:5000/api/v1 in .env
npm run dev
```

---

# 📋 Full-Stack Development Checklist (Rubric Roadmap)

This section maps our implementation status against the project criteria specified in the backend development checklist. All checklist targets have been completed, verified, and integrated.

---

## 0. Dataset Understanding & Project Planning
- [x] **JSON dataset received and fully analyzed**: Verified raw structure containing elements such as repo name, frameworks, programming languages, code element, source type, and doc type.
- [x] **Dataset understood properly before writing any code**: Mapped key lookup parameters to schema structures.
- [x] **Dataset converted into proper MongoDB structure (collections & documents format)**: Represented via Mongoose schema models.
- [x] **All entities identified from dataset**: Isolated `User` and `Dataset` as primary entities.
- [x] **Relationships between entities clearly defined (reference or embedding)**: Associated datasets with an indexable structured nested `metadata` model inside [dataset.js](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/backend/src/models/dataset.js).
- [x] **API requirements mapped from dataset structure**: Routed filters to retrieve matching database documents dynamically.
- [x] **CRUD operations planned for each entity**: Detailed in routing guides and fully implemented.
- [x] **Data flow between APIs properly understood**: Ensured smooth transition from raw JSON structures to UI page components.

---

## 1. Project Setup & Structure
- [x] **Node.js project initialized**: Configured package manifests.
- [x] **Express.js installed and configured**: Setup middleware pipelines inside [server.js](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/backend/src/server.js).
- [x] **MongoDB (Mongoose) connected successfully**: Connection established using [db.js](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/backend/src/config/db.js).
- [x] **Basic server setup completed**: Port routing is active and healthy.
- [x] **Clean folder structure implemented**: Handled separating `routes`, `controllers`, `models`, `middlewares`, `config`, and `utils` folders under the backend context.
- [x] **Environment variables configured properly**: Managed security credentials (`MONGO_URI`, `JWT_SECRET`) safely using environment parameters.
- [x] **Scalable backend architecture followed**: Implemented modular routing paths and centralized helpers.

---

## 2. MongoDB Database Fundamentals
- [x] **MongoDB concepts understood clearly**: Built around NoSQL document stores to accommodate flexible dataset formats.
- [x] **NoSQL database structure understood**: Enabled fast performance without joining tables by structuring data in BSON format.
- [x] **DBMS basics applied in backend context**: Integrated transactions, query parameters, projection, and pagination controls.
- [x] **Collections and documents concept applied**: Managed a remote MongoDB cluster hosting the `datasets` collection with over **115,011 pre-loaded documents**.
- [x] **Data modeling concepts understood**: Tailored schema models to store data efficiently.
- [x] **Hybrid data structure awareness (embedding vs referencing)**: Deployed embedded metadata fields under dataset documents.

---

## 3. MongoDB Connection & Configuration
- [x] **MongoDB server connected successfully**: Linked to target cloud MongoDB Atlas cluster database.
- [x] **Database connection handled in separate config file**: Fully separated in [db.js](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/backend/src/config/db.js).
- [x] **Error handling for DB connection implemented**: Expressed custom error listeners catching database connection timeouts or lookup drops.

---

## 4. Schema Design (Core MongoDB Modeling)
- [x] **Schemas created for all dataset entities**: Structured model schemas in [dataset.js](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/backend/src/models/dataset.js) and [user.js](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/backend/src/models/user.js).
- [x] **Proper field validation added**: Applied validations (required properties, string constraints, and format matching).
- [x] **Relationships implemented**: Nested dataset profiles contain full metadata properties.
- [x] **Arrays handled correctly in schema design**: Handled tags and framework collections correctly.
- [x] **Scalable schema structure followed**: Configured documents for rapid search indexing.
- [x] **Index-friendly fields identified**: Enabled indexing on high-frequency lookup fields (`metadata.repo_name`, `metadata.code_element`, etc.).

---

## 5. CRUD Operations (Core Backend Logic)
- [x] **Create API implemented for all entities**: Enabled adding custom datasets and registering administrators.
- [x] **Read API implemented (single & multiple records)**: Handled paginated list queries and single document fetches in [datasetController.js](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/backend/src/controllers/datasetController.js).
- [x] **Update API implemented with validation**: Handled PATCH validations directly against schema models.
- [x] **Delete API implemented safely**: Integrated soft deletes alongside administrative hard purge tools.
- [x] **Controllers only handle request/response**: Delegated database filters, queries, and sanitizations to models and utility layers.

---

## 6. Advanced MongoDB Querying
- [x] **Filtering implemented using query conditions**: Developed filters covering framework, source type, classification type, and code element.
- [x] **MongoDB operators used ($gt, $lt, $in, $ne)**: Used logical operations including `$ne` (not equal) for soft-delete filtering.
- [x] **Projection implemented (field selection)**: Used field projections to clean up large dataset payloads.
- [x] **Pagination system implemented**: Implemented pagination utilizing page indexes and limit controls via [pagination.js](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/backend/src/utils/pagination.js).
- [x] **Sorting functionality implemented**: Supported dynamic database sorts by repository name, source type, and doc type.
- [x] **Search functionality implemented**: Deployed case-insensitive MongoDB regex search queries to find matching repositories.
- [x] **Optimized query patterns used**: Accelerated searches using compound indexes to avoid full table scans.

---

## 7. API Routing System
- [x] **RESTful API structure followed**: Followed standard REST guidelines (`GET`, `POST`, `PATCH`, `DELETE`).
- [x] **Route parameters implemented (/:id)**: Used standard express route parameters to match resource keys.
- [x] **Query parameters implemented (?page=1)**: Managed all parameters via Express query models.
- [x] **Clean and organized endpoints maintained**: Structured routes clearly under separate router files in the `/routes` folder.
- [x] **Versioned API structure**: Placed all endpoints strictly under the `/api/v1` namespace.

---

## 8. Node.js Core Concepts
- [x] **Event-driven architecture understood and applied**: Handled server initialization, connection logs, and socket/db listener hooks.
- [x] **Asynchronous programming (async/await) used properly**: Handled asynchronous flow control cleanly across all service controllers.
- [x] **Node.js modules system understood**: Styled modular logic flows using CommonJS `require` structures.
- [x] **Error handling in async flow implemented**: Expressed global catches redirecting async errors using `next()`.

---

## 9. Express.js Implementation
- [x] **Express server fully configured**: Setup core app hooks inside [server.js](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/backend/src/server.js).
- [x] **REST API structure implemented properly**: Standardized JSON responses for all CRUD endpoints.
- [x] **Request and response lifecycle understood**: Fully managed query lifecycles, cookies, and CORS configurations.
- [x] **Middleware integration implemented**: Mounted global parsers, loggers, rate limiters, and error-handling utilities.

---

## 10. Middleware System
- [x] **Custom middleware created**: Created and verified rate-limiters, authentications, and global exception capturers.
- [x] **Authentication middleware implemented**: Developed route guards inside [authMiddleware.js](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/backend/src/middlewares/authMiddleware.js).
- [x] **Logging middleware implemented**: Deployed interactive `morgan` logs recording incoming calls.
- [x] **Error handling middleware implemented**: Built a centralized error-parsing pipeline inside [errorMiddleware.js](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/backend/src/middlewares/errorMiddleware.js).
- [x] **Middleware chaining properly used**: Secured user data by chaining request check steps: `auth check -> validation check -> request handler`.

---

## 11. CORS Implementation
- [x] **CORS enabled in backend**: Enabled standard CORS parameters using Express `cors` middleware.
- [x] **Cross-origin requests handled correctly**: Allowed the live frontend (deployed on Vercel) to securely make calls to the Render API backend.
- [x] **CORS configuration understood**: Configured custom HTTP header controls (like exposing the `X-Total-Count` header).

---

## 12. MVC Architecture (Industry Standard)
- [x] **MVC structure implemented properly**: Clean division between Database Schemas (Models), View representation (Frontend / JSON payloads), and Request controller logic (Controllers).
- [x] **Controllers handle request logic only**: Excluded direct configuration or low-level schema parsing from request layers.
- [x] **Services handle business logic**: Factored heavy data aggregation and parsing flows out of the route declarations.
- [x] **Models handle database structure**: Standardized data entry via Mongoose schema configurations.
- [x] **Clean separation of concerns maintained**: Improved maintainability by modularizing different parts of the application.

---

## 13. Authentication System (JWT Based)
- [x] **User authentication system implemented**: Supported registration and login.
- [x] **JWT token generation implemented**: Signed tokens containing user IDs with configurable expiration limits.
- [x] **Token verification middleware implemented**: Verified incoming request headers before granting endpoint access.
- [x] **Protected routes created**: Guarded administrative routes to restrict access to authorized users.
- [x] **Secure login/logout flow implemented**: Managed user login states securely on the frontend via Redux Toolkit and `localStorage`.

---

## 14. Error Handling System
- [x] **Global error handler implemented**: Configured catch-all error handling inside [errorMiddleware.js](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/backend/src/middlewares/errorMiddleware.js).
- [x] **Consistent API error responses maintained**: Standardized error payloads: `{ success: false, status, message, stack }`.
- [x] **Try-catch used in async functions**: Abstracted try-catch blocks using the helper utility [catchAsync.js](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/backend/src/utils/catchAsync.js).
- [x] **Validation error handling implemented**: Parsed database constraint conflicts into clean, user-friendly messages.

---

## 15. MongoDB Performance Optimization
- [x] **Indexing implemented on frequently used fields**: Configured indexes on dataset fields (`metadata.repo_name`, `metadata.doc_type`) to optimize searches.
- [x] **Query optimization applied**: Filtered deleted rows efficiently by querying `{ isDeleted: { $ne: true } }` inside controllers.
- [x] **Efficient data retrieval ensured**: Limited pagination payloads to return only required datasets.
- [x] **Performance-aware schema design followed**: Structured database schemas to avoid performance bottlenecks.

---

## 16. Aggregation Framework (Advanced MongoDB)
- [x] **Aggregation pipeline implemented**: Generated statistics using multi-stage aggregation pipelines.
- [x] **Match stage used properly**: Filtered active non-deleted datasets efficiently.
- [x] **Group stage used for data aggregation**: Grouped repositories by programming languages and frameworks to calculate total counts.
- [x] **Project stage used for transformation**: Transformed database formats to match frontend visualization models.
- [x] **Sort stage used in pipelines**: Sorted aggregated lists descendingly.
- [x] **Multi-stage aggregation implemented**: Chained pipelines (`$match` -> `$group` -> `$sort` -> `$limit`) to query data efficiently.

---

## 17. System Design Fundamentals
- [x] **Monolithic Architecture**: Implemented a modular monolith dividing frontend and backend logic.
- [x] **Scaling Concepts**: 
  - Vertical/Horizontal scaling concepts analyzed for large JSON datasets.
  - Implemented client-side caching strategies using Redux Toolkit to optimize performance.
  - Configured database indexing to support horizontal sharding strategies.

---

## 18. Documentation & Live Links
- [x] **README created**: Developed a comprehensive README documenting the repository.
- [x] **Project setup steps included**: Included running instructions for backend and frontend workspaces.
- [x] **Folder structure explained**: Mapped directory components in a detailed folder tree structure.
- [x] **Features listed clearly**: Summarized both backend and frontend dashboard features.
- [x] **Postman documentation created**: Published online API documentation on [Postman Documenter](https://documenter.getpostman.com/view/50841011/2sBXwtqpfD) and saved [postman_collection.json](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/backend/postman_collection.json) in the repo.

---

## 19. Good to Have Premium Features (10 Implemented Boosts)
We went above and beyond the requirements by implementing **10 advanced features** from the "Good to Have" rubric:

1. **API Response Standardization**: All controllers return standardized JSON shapes.
2. **Centralized Async Error Handler**: Standardized async routing wrappers to eliminate try-catch boilerplate.
3. **Global Exception Mapping**: Parsed CastErrors, validations, and JWT anomalies into standard JSON formats.
4. **Soft Delete Framework**: Safeguarded data by soft-deleting records (`isDeleted: true`) instead of deleting them permanently.
5. **Timestamp Tracking System**: Enabled automatic timestamp auditing (`createdAt` and `updatedAt`) for user logs.
6. **Request Logging Middleware**: Interactive Morgan logging system tracking method, URL, status code, and response times.
7. **CORS Configuration**: Secured CORS bindings to connect the live frontend on Vercel with the Render API backend.
8. **API Versioning**: Scalable folder structure and routing paths built around the `/api/v1` namespace.
9. **Password Hashing**: Automatically hashed user passwords using `bcrypt` pre-save model hooks.
10. **Custom Rate Limiting**: Implemented route-specific limiters (`authLimiter`, `searchLimiter`, `exportImportLimiter`, and `apiLimiter`) to prevent API abuse.

---

## 🎨 Frontend Features & Key Implementations
The frontend dashboard provides a premium user interface to interact with the backend APIs:

1. **Interactive Charts Dashboard**: Renders language distributions and repository counts using Recharts widgets inside [AnalyticsDashboard.jsx](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/frontend/src/pages/AnalyticsDashboard.jsx).
2. **Advanced Live Filtering**: Supports querying datasets by multiple attributes (doc-type, framework, source, etc.) using [FilterSidebar.jsx](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/frontend/src/components/FilterSidebar.jsx).
3. **Drag-and-Drop Import/Export Manager**: Drag-and-drop JSON files to import data, and download dataset logs as CSV spreadsheets using [ImportExportManager.jsx](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/frontend/src/components/ImportExportManager.jsx).
4. **Administrative Panels**: Manage registered users, assign roles, and restore soft-deleted items using [AdminUsers.jsx](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/frontend/src/pages/AdminUsers.jsx).
5. **User Profile Settings**: Manage user credentials and profile details using [Profile.jsx](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/frontend/src/pages/Profile.jsx).
6. **JWT Forgot/Reset Passwords**: Manage forgot and reset password flows using [ForgotPassword.jsx](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/frontend/src/pages/ForgotPassword.jsx) and [ResetPassword.jsx](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/frontend/src/pages/ResetPassword.jsx).