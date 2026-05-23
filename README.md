# 🌟 GitHub Datasets - Enterprise Full-Stack Project

Welcome to the ultimate, production-grade GitHub Datasets workspace! This repository contains a premium, highly optimized **Node.js / Express** MVC backend powered by a remote MongoDB cluster containing over **115,011 dataset records** and built using a strict, modern 15-Pull Request Git/GitHub workflow.

> [!NOTE]
> All core and "Good to Have" backend requirements are **100% complete, programmatically tested, and fully optimized**.

---

## 📁 Repository Structure

The workspace is organized into a modular monolithic architecture, dividing backend logic and configurations cleanly:

```text
github_dataset_nitish_kumar/
├── backend/                   # 🚀 Core Node.js / Express MVC API codebase
│   ├── src/
│   │   ├── config/            # MongoDB connection handlers and listeners
│   │   ├── controllers/       # Controller layer (CRUD, Analytics, Stats, Auth, Utils)
│   │   ├── middlewares/       # Rate limiting, Auth protection, and Error interceptors
│   │   ├── models/            # Mongoose schemas (Dataset & User Models)
│   │   ├── routes/            # Route routing layer mapping endpoints
│   │   ├── scripts/           # Programmatic endpoint verification test suites
│   │   └── utils/             # Query builders, pagination, and unified error classes
│   ├── README.md              # Detailed backend installation and setup guide
│   └── postman_collection.json # Exhaustive Postman workspace collection (250+ endpoints)
├── assginmentRule.md          # Project specification checklist
├── routes.md                  # Pre-mapped system routing catalog
└── README.md                  # 🌟 Main repository entrypoint (this file)
```

---

## ⚡ Implemented Premium Engineering Patterns

We built this project around **10 production-grade architectural patterns**:
1. **API Response Standardization**: All controllers return standardized JSON structures `{ success: true, message, results, data }`.
2. **Centralized Async Wrappers**: Removed messy try-catch blocks using reusable async handler wrappers.
3. **Global Exception Mapping**: Custom middleware translates Mongoose validations, CastErrors, and JWT anomalies into clear REST responses.
4. **Soft Delete System**: Implemented safe, non-destructive record deletions utilizing `isDeleted` query filters.
5. **Pre-Save Bcrypt Encryption**: Cryptographically hashes and secures user accounts prior to MongoDB saves.
6. **JWT Token Lifecycle Management**: Full authorization token generation, validation, refresh, and secure blacklist revocation.
7. **Custom Endpoint Rate Limiting**: Deployed route-specific flood protections (brute-force login blocks, search queries throttlers).
8. **Dynamic MongoDB Query Builder**: Converts query parameters dynamically into MongoDB-compatible compound operators.
9. **Performance-Tuned Aggregations**: Constructs fast aggregation metrics `$match`, `$group`, `$sort` pipeline streams.
10. **HTTP HEAD / OPTIONS Handshakes**: Direct preflight pre-allocation and rapid X-Total-Count header polling support.

---

## 🔐 Database Details & Environment Config

The backend is connected out-of-the-box to our production MongoDB cluster:
* **Host**: `ac-tebhsg0-shard-00-02.q17d6sn.mongodb.net`
* **Target Database**: `githubDataSetDB`
* **Main Collection**: `datasets` (~115,011 highly indexed documents)

---

## 🚀 Quick Start Guide

To launch the backend API server locally, run the following commands:

### 1. Initialize & Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment `.env`
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://assignment:assignment12@cluster0.q17d6sn.mongodb.net/githubDataSetDB
JWT_SECRET=super-secure-jwt-key-2026-nitish-kumar
JWT_EXPIRES_IN=90d
```

### 3. Run Server
```bash
npm run dev
```

### 4. Execute Programmatic Endpoint Tests
Validate all 250+ routes automatically:
```bash
node src/scripts/test-pr14.js
```

---

## 📬 Postman Workspace Integration

We have exported a complete Postman Collection containing pre-configured request payloads and authorization blocks:
1. Locate [postman_collection.json](file:///c:/Users/LOQ/OneDrive/Desktop/Full%20stack%20projects/github_dataset_nitish_kumar/backend/postman_collection.json).
2. Import the file directly into your **Postman** app.
3. Setup variables `base_url` to `http://localhost:5000/api/v1` and perform instant pings!