# 🚀 GitHub Dataset Premium Express Backend 

Welcome to the production-grade, enterprise-ready **Node.js / Express** MVC backend built to serve Nitish Kumar's GitHub Datasets API. This system connects to a remote MongoDB cluster containing over **115,011 dataset records** and exposes robust operations including dynamic compound filters, analytics pipelines, stats reporting, security rate-limiting, Bcrypt encryption, and JWT user authorization.

---

## 📂 Project Architecture & Directory Layout

The application strictly implements the clean, industry-standard **Model-View-Controller (MVC)** design pattern:

```text
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # Indexed Mongoose connection pool & error listeners
│   ├── controllers/
│   │   ├── analyticsController.js # MongoDB aggregation metrics generators
│   │   ├── authController.js      # User registration, token, and OTP auth controllers
│   │   ├── datasetController.js   # Main CRUD, dynamic param, utility, and options actions
│   │   └── statsController.js     # Ultra-fast O(1) inventory count monitors
│   ├── middlewares/
│   │   ├── authMiddleware.js      # Protect guards and role-based access controls (RBAC)
│   │   ├── errorMiddleware.js     # Global Cast, ValidationError, and JWT exception parser
│   │   └── rateLimiter.js         # express-rate-limit endpoint safety guards
│   ├── models/
│   │   ├── dataset.js             # Mongoose Dataset Schema with compound index arrays
│   │   └── user.js                # Encrypted User schema with secure pre-save hashing
│   ├── routes/
│   │   ├── analyticsRoutes.js     # Analytics endpoints mapping
│   │   ├── authRoutes.js          # Authentication endpoints mapping
│   │   ├── datasetRoutes.js       # Main CRUD routing mapping
│   │   ├── jwtRoutes.js           # JWT lifecycle endpoints mapping
│   │   ├── searchRoutes.js        # Search engine routing mapping
│   │   └── statsRoutes.js         # Stats counters endpoints mapping
│   ├── scripts/
│   │   ├── test-connection.js     # Fast database connectivity verifying helper
│   │   └── test-pr14.js           # Programmatic endpoint verification test suite
│   ├── utils/
│   │   ├── AppError.js            # Unified custom operational error class
│   │   ├── catchAsync.js          # Async wrapper eliminating boilerplate try-catch blocks
│   │   ├── filterBuilder.js       # Dynamic MongoDB regex combination filter utility
│   │   └── pagination.js          # Robust offset-based pagination controller
│   └── server.js                  # Main server boostrapper and app entrypoint
├── .env                           # Configured environment variables
├── .env.example                   # Local deployment template
├── package.json                   # Project details, dependencies, and script runners
└── postman_collection.json        # Exported workspace collection for Postman tests
```

---

## ⚡ Implemented "Good to Have" Production Features

We implemented **10 premium features** from the checklist to guarantee production reliability:
1. **API Response Standardization**: Standardized JSON shapes across all controllers (`{ success: true, message, results, data }`).
2. **Centralized Async Error Handler**: Reusable async promise wrappers that capture errors cleanly without repetitive try-catch blocks.
3. **Global Express Error Middleware**: Unified catch-all handler that parses database validation, duplicate field indices, and token expirations.
4. **Soft Delete Framework**: Supports `isDeleted` attributes so database documents are never hard deleted from active views.
5. **Timestamp Tracking System**: Schema-level timestamps tracking `createdAt` and `updatedAt` for administrative user records.
6. **Request Logging System**: Interactive morgan-driven request monitors tracking method, status, response times, and origin timestamps.
7. **API Versioning Structure**: Scalable folder structure and routing paths built strictly around the `/api/v1` format.
8. **Bcrypt Password Hashing**: Hashed secure pre-save Mongoose hooks utilizing Bcrypt on user registrations.
9. **JWT Token Expiry and Verification**: Full token lifecycle including verification, generation, refresh, and secure revocation.
10. **Custom API Rate Limiting**: Multiple route-specific limiters preventing brute-force login attempts and DDoS query floods.

---

## 🔐 Database Connection Details

The system connects to the remote MongoDB cluster:
* **Connection String**: `mongodb+srv://assignment:assignment12@cluster0.q17d6sn.mongodb.net/`
* **Target Database**: `githubDataSetDB`
* **Target Collection**: `datasets` (~115,011 records)

---

## ⚙️ Quick Setup & Running Locally

Follow these quick steps to boot up the backend:

1. **Install Project Dependencies**
   Navigate to the `backend/` directory and execute:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the `backend/` folder based on `.env.example`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb+srv://assignment:assignment12@cluster0.q17d6sn.mongodb.net/githubDataSetDB
   JWT_SECRET=super-secure-jwt-key-2026-nitish-kumar
   JWT_EXPIRES_IN=90d
   JWT_COOKIE_EXPIRES_IN=90
   ```

3. **Start the Development Server**
   Start the server with hot-reload enabled via nodemon:
   ```bash
   npm run dev
   ```

---

## 🛠️ Validation & Programmatic Route Tests

To run the custom test suite verifying all utility, head, and options endpoints:
```bash
node src/scripts/test-pr14.js
```

---

## 📬 Postman Workspace Integration

We have included a pre-assembled, fully documented Postman Collection workspace containing **250+ route permutations**:

### How to Import:
1. Open your **Postman** desktop application or web agent.
2. Click the **Import** button in the top left header.
3. Drag and drop the file `backend/postman_collection.json` from this repository.
4. Set up the collection variable `base_url` to match `http://localhost:5000/api/v1`.
5. Run your queries!
