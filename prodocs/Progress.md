# DataWhisper Progress Log

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