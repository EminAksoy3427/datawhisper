# DataWhisper Development Plan

## MVP Goal

Allow small business users to:

1. Register/Login
2. Upload CSV or use demo data
3. View business summary
4. Ask business questions in Turkish
5. Receive AI insights and recommendations
6. View charts and Business Health Score

---

## Phase 1 — Project Setup

- Create frontend
- Create backend
- Create prodocs
- Prepare required documents

---

## Phase 2 — Backend Setup

Tasks:

- Set up FastAPI
- Configure CORS
- Add `/health`
- Create backend folder structure

---

## Phase 3 — Authentication

Tasks:

- Register endpoint
- Login endpoint
- JWT token
- Password hashing
- Protected routes

Endpoints:

- POST /auth/register
- POST /auth/login
- GET /auth/me

---

## Phase 4 — Data Layer

Tasks:

- Demo data
- CSV upload
- CSV parsing with Pandas
- Business metrics calculation

Endpoints:

- GET /demo-data
- POST /upload-csv

Metrics:

- Revenue
- Cost
- Profit
- Return rate
- Top products
- Risky products

---

## Phase 5 — AI Analysis

Tasks:

- Ask question endpoint
- OpenAI integration
- Structured AI response

Endpoint:

- POST /ask

Response:

- Summary
- Insight
- Recommendation
- Risk level

---

## Phase 6 — Frontend

Pages:

- Landing
- Register
- Login
- Dashboard

Components:

- CSV Upload
- Metrics Cards
- Question Box
- Charts
- Health Score

---

## Phase 7 — Testing & Deployment

Tasks:

- Test auth
- Test CSV flow
- Test AI flow
- Deploy frontend
- Deploy backend

---

## Core Demo Flow

Login → Demo Data → Business Summary → Ask Question → AI Insight