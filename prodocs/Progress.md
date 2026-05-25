# DataWhisper Progress Log

## 2026-05-25 (flexible file upload)

### Completed

- `/upload-csv` now accepts `.csv`, `.xlsx`, and `.xls` files (extension-based detection, pandas `read_csv` / `read_excel`).
- Added `openpyxl` and `xlrd` to `backend/requirements.txt`.
- Replaced strict required-column validation with a Turkish/English column mapping (`product_name`, `category`, `supplier`, `date`, `sales_quantity`, `revenue`, `cost`, `return_quantity`, `return_reason`).
- Header matching is diacritic- and case-insensitive (e.g. `Ürün Adı`, `Satış Adedi`, `İade Adedi` all map to canonical keys).
- Analysis no longer fails when business columns are missing — missing metrics become `null`, missing breakdowns become empty arrays.
- Response now includes `detected_columns` and Turkish `missing_capabilities` messages.
- Frontend dashboard: upload copy switched to “CSV veya Excel”, file picker accepts `.csv,.xlsx,.xls`, detected columns and missing-capability warnings rendered after upload, metric/percent formatters tolerate `null`.
- `HealthScoreCard` shows a “Yeterli Veri Yok” state when essential metrics cannot be computed.

## 2026-05-24

### Completed

- Created `/frontend` with Vite, React 19, and TypeScript.
- Installed and configured Tailwind CSS v4 (`@tailwindcss/vite`) with DataWhisper design tokens.
- Added `react-router-dom`, `axios`, and `recharts`.
- Built placeholder pages: Landing, Login, Register, Dashboard; shared `Navbar` and `api/client.ts`.
- Wired routes: `/`, `/login`, `/register`, `/dashboard`.
- Connected auth to `POST /auth/register`, `POST /auth/login`, `GET /auth/me` via `AuthContext`, JWT in `localStorage`, protected `/dashboard`, logout in Navbar.

### Next Step

- Final demo rehearsal and deployment (optional).

## 2026-05-24 (MVP polish)

### Completed

- Polished dashboard copy, section labels, helper texts, empty/loading states, and Turkish error messages.
- Updated root `README.md` for setup, demo flow, and security notes.

## 2026-05-24 (dashboard data & AI)

### Completed

- Connected dashboard to `GET /demo-data`, `POST /upload-csv`, `POST /ask`.
- Added `MetricCard`, `ChartCard`, `QuestionBox`, `InsightCard`; metrics, category table, Recharts, Turkish errors.
- `business_summary` kept in state; question disabled until data is loaded.
- Added frontend Business Health Score (`HealthScoreCard`) from loaded summary metrics.

## 2026-05-22

### Completed

- Created `/backend` with FastAPI, `/health`, CORS, and verified local run.
- Implemented authentication (`/auth/register`, `/auth/login`, `/auth/me`).
- Added demo data and CSV analysis (`GET /demo-data`, `POST /upload-csv`).
- Created `csv_service`, `demo_data_service`, data schemas, and data router.
- Implemented AI analysis (`POST /ask`) with OpenAI and structured Turkish JSON response.
- Created `ai_service`, analysis schemas, and analysis router.
- Updated `requirements.txt`, `backend/.env.example`, and `backend/.gitignore`.

### Decisions

- SQLite database file stored as `datawhisper.db` in the backend folder.
- Register and login return user data plus a JWT bearer token.
- Demo and CSV upload return the same English-key business summary shape.
- CSV upload requires Bearer authentication; demo data is public.
- Auth errors in English; CSV and AI user errors in Turkish where applicable.
- `POST /ask` sends only `business_summary` to OpenAI, not raw CSV data.
- Use PowerShell-compatible command chaining (`;`) for local backend run scripts on Windows.

### Problems

- First server start attempt failed because PowerShell does not support `&&`; fixed by rerunning with `;`.

### Next Step

- Set up the React frontend dashboard.
- Connect frontend to auth, data summary, and `/ask` endpoints.

## 2026-05-21

### Completed

- Created the main project repository structure.
- Added required root files:
  - README.md
  - .gitignore
  - .env.example
- Created `/prodocs` folder.
- Added initial project documentation:
  - PRD.md
  - tech-stack.md
  - Plan.md
  - DesignSystem.md

### Decisions

- Project name selected as DataWhisper.
- The project will be built as a web application.
- Frontend and backend will be separated.
- Login/register will be included in the MVP for learning purposes.
- React, Vite, Tailwind, FastAPI, Pandas, JWT auth, and OpenAI API will be used.
- The product will focus on small businesses that use CSV/Excel data.

### Problems

- Empty folders were not visible on GitHub because Git does not track empty folders.
- This will be solved by adding actual files inside the folders during development.

### Next Step

- Set up the backend with FastAPI.
- Add `/health` endpoint.
- Prepare authentication structure.