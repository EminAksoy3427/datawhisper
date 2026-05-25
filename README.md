# DataWhisper

**DataWhisper** is an AI-powered business intelligence assistant that helps small businesses understand CSV sales data through Turkish natural language questions, charts, and actionable recommendations.

## Problem

Small e-commerce sellers, boutique manufacturers, and retailers often manage their business in Excel or CSV files but lack simple tools to turn that data into clear insights. Traditional BI tools are too complex, expensive, or English-heavy for non-technical owners.

## Target Users

- Small e-commerce sellers
- Boutique manufacturers
- Small retailers
- Business owners who work with Excel/CSV exports

## Core Features

- User registration and login (JWT)
- Demo SME business data (no login required)
- CSV / Excel (.csv, .xlsx, .xls) upload with automatic Turkish/English column detection
- Business summary analysis even when only some columns are present
- Dashboard metrics: revenue, profit, return rate, profit margin
- Top revenue and top returned product charts
- Category summary table
- Business Health Score (frontend-calculated, 0–100)
- Turkish natural language questions answered like a small-business analyst: headline, focus area, priority, main finding, why-it-matters, three recommended actions, expected impact, data-to-check checklist, and three follow-up question chips (clickable)

## Tech Stack

| Layer    | Technologies                                      |
| -------- | ------------------------------------------------- |
| Frontend | React, Vite, TypeScript, Tailwind CSS, Recharts |
| Backend  | FastAPI, Python, Pandas, SQLAlchemy              |
| Auth     | JWT (Bearer tokens)                               |
| AI       | OpenAI API                                        |
| Database | SQLite (development)                              |

## Folder Structure

```
datawhisper/
├── frontend/          # React + Vite app
├── backend/           # FastAPI app
├── prodocs/           # PRD, plan, design system, progress log
├── README.md
└── .env.example       # Points to backend/.env.example
```

## Local Setup

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- An OpenAI API key (for `/ask`)

### Environment Variables

**Backend** — copy `backend/.env.example` to `backend/.env` and set:

| Variable                     | Description                          |
| ---------------------------- | ------------------------------------ |
| `DATABASE_URL`               | SQLite URL (default in example)      |
| `JWT_SECRET_KEY`               | Secret for signing JWT tokens        |
| `ACCESS_TOKEN_EXPIRE_MINUTES`  | Token lifetime (minutes)             |
| `OPENAI_API_KEY`               | OpenAI API key for AI analysis       |
| `OPENAI_MODEL`                 | Model name (e.g. `gpt-4o-mini`)      |

**Frontend** — copy `frontend/.env.example` to `frontend/.env` and set:

| Variable              | Description                    |
| --------------------- | ------------------------------ |
| `VITE_API_BASE_URL`   | Backend URL (e.g. `http://127.0.0.1:8000`) |

> **Security:** Real `.env` files and API keys are **not** committed to Git. Use the `.env.example` files as templates only.

### Run the Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
# Edit .env with your secrets, then:
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

API docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Run the Frontend

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

App: [http://localhost:5173](http://localhost:5173)

## Demo Flow

1. Open the landing page and **Register** or **Login**.
2. Go to **Panel** (dashboard).
3. Click **Demo Veriyi Yükle** to load sample SME data, or upload your own `.csv`, `.xlsx`, or `.xls` file — Turkish headers such as *Ürün Adı*, *Kategori*, *Satış Adedi*, *Ciro*, *Maliyet*, *İade Adedi* are detected automatically.
4. Review **metrics**, **health score**, **category table**, and **charts**.
5. Type a Turkish business question (e.g. *“En çok iade edilen ürün hangisi?”*) and click **Soru Gönder**.
6. Read the AI **summary**, **insight**, **recommendation**, and **risk level** on the right.

## API Endpoints (summary)

| Method | Path           | Auth     | Description              |
| ------ | -------------- | -------- | ------------------------ |
| POST   | `/auth/register` | No     | Create account           |
| POST   | `/auth/login`    | No     | Login                    |
| GET    | `/auth/me`       | Bearer | Current user             |
| GET    | `/demo-data`     | No     | Sample business summary  |
| POST   | `/upload-csv`    | Bearer | Analyze uploaded CSV or Excel file (.csv/.xlsx/.xls) with flexible column detection |
| POST   | `/ask`           | Bearer | AI analysis (Turkish)    |

## Future Improvements

- Persistent saved analyses per user
- More chart types driven by `chart_suggestion`
- Export reports (PDF/Excel)
- Shopify / Trendyol integrations
- Password reset and email verification
- PostgreSQL for production deployment

## License

Educational / bootcamp MVP project.
