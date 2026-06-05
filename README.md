# DataWhisper

<div align="center">

# 📊 DataWhisper

### AI-Powered Business Intelligence Assistant for SMEs

Transform CSV and Excel sales data into actionable business insights using AI, dashboards, and Turkish natural language questions.

![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-Code-3178C6?logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?logo=postgresql)
![OpenAI](https://img.shields.io/badge/OpenAI-AI-412991?logo=openai)
![Status](https://img.shields.io/badge/Status-Live-success)

### 🚀 Live Project

**Frontend:** https://datawhisper-alpha.vercel.app

**Backend API:** https://datawhisper-backend-xcgl.onrender.com

**API Documentation:** https://datawhisper-backend-xcgl.onrender.com/docs

</div>

---

## 📖 Overview

**DataWhisper** is an AI-powered Business Intelligence assistant designed for small and medium-sized businesses that rely on spreadsheets for sales, cost, inventory, and return tracking.

Instead of requiring business owners to learn complex BI tools, DataWhisper allows users to upload CSV or Excel files, view automatic dashboard insights, and ask business questions in Turkish.

The application analyzes uploaded business data, generates key performance indicators, visualizes product and category performance, and provides AI-generated recommendations for better decision-making.

---

## 🎯 Problem

Many small businesses manage their operations through Excel or CSV exports but struggle to turn raw data into meaningful decisions.

Common problems include:

- Manual and time-consuming reporting
- Limited access to affordable BI tools
- Difficulty understanding sales and return trends
- Lack of technical knowledge for Power BI or ERP systems
- Business decisions based on intuition instead of data
- Limited Turkish-language analytics support

Traditional BI platforms can be powerful, but they are often too complex, expensive, or technical for small business owners.

---

## 💡 Solution

DataWhisper provides a lightweight AI-powered analytics experience.

Users can:

- Upload CSV or Excel files
- Automatically detect sales-related columns
- Generate revenue, cost, profit, and return metrics
- View interactive dashboards and charts
- Ask Turkish natural language business questions
- Receive AI-generated insights and action recommendations

DataWhisper acts like a simple AI business analyst for SMEs.

---

## 🖼 Screenshots

### Landing Page

![Landing Page](docs/screenshots/landing.png)

### Authentication

![Authentication](docs/screenshots/auth.png)

### Dashboard Overview

![Dashboard](docs/screenshots/dashboard.png)

### CSV / Excel Upload

![Upload](docs/screenshots/upload.png)

### AI Business Analysis

![AI Analysis](docs/screenshots/ai-analysis.png)

---

## ✨ Features

### Authentication

- User registration
- Secure login
- JWT-based authentication
- Protected dashboard routes
- Persistent user session

### Smart Data Processing

- CSV upload support
- Excel `.xlsx` and `.xls` upload support
- Turkish and English column detection
- Flexible schema matching
- Fuzzy column recognition
- Partial dataset analysis
- Clear missing capability messages

### Business Dashboard

- Total revenue
- Total cost
- Estimated profit
- Profit margin
- Return rate
- Top revenue products
- Most returned products
- Category performance summary
- Business Health Score

### AI Business Assistant

Users can ask questions such as:

> Which products should I focus on?

> What are my biggest business risks?

> Which categories are underperforming?

> Give me three actionable recommendations.

The AI response includes:

- Executive summary
- Main finding
- Priority level
- Why it matters
- Recommended actions
- Expected business impact
- Follow-up questions

---

## 🏗 Architecture

~~~text
┌─────────────────────┐
│ React Frontend      │
│ Vercel              │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ FastAPI Backend     │
│ Render              │
└──────────┬──────────┘
           │
           ├──────────────► OpenAI API
           │
           ▼
┌─────────────────────┐
│ Supabase            │
│ PostgreSQL          │
└─────────────────────┘
~~~

The frontend does not communicate directly with OpenAI or Supabase. All requests are handled through the FastAPI backend.

---

## 🛠 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Backend | FastAPI, Python |
| Data Processing | Pandas |
| Database | Supabase PostgreSQL |
| Local Database | SQLite |
| ORM | SQLAlchemy |
| Authentication | JWT |
| AI | OpenAI API |
| Deployment | Vercel, Render |

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login and receive JWT token |
| GET | `/auth/me` | Bearer | Get current user |
| GET | `/demo-data` | No | Load demo business dataset |
| POST | `/upload-csv` | Bearer | Upload and analyze CSV/Excel data |
| POST | `/ask` | Bearer | Generate AI-powered business insights |

---

## 📁 Folder Structure

~~~text
datawhisper/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── db/
│   │   ├── routers/
│   │   ├── schemas/
│   │   └── services/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── lib/
│   ├── package.json
│   ├── vercel.json
│   └── .env.example
├── docs/
│   └── screenshots/
├── prodocs/
│   ├── PRD.md
│   ├── Plan.md
│   ├── DesignSystem.md
│   ├── tech-stack.md
│   └── Progress.md
└── README.md
~~~

---

## 🚀 Local Development

### Backend

~~~bash
cd backend

python -m venv .venv

# Windows PowerShell
.venv\Scripts\Activate.ps1

pip install -r requirements.txt

copy .env.example .env

uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
~~~

Backend runs on:

~~~text
http://127.0.0.1:8000
~~~

Swagger API docs:

~~~text
http://127.0.0.1:8000/docs
~~~

---

### Frontend

~~~bash
cd frontend

npm install

copy .env.example .env

npm run dev
~~~

Frontend runs on:

~~~text
http://localhost:5173
~~~

---

## 🔐 Environment Variables

### Backend

Create `backend/.env` from `backend/.env.example`.

~~~env
DATABASE_URL=
JWT_SECRET_KEY=
ACCESS_TOKEN_EXPIRE_MINUTES=
OPENAI_API_KEY=
OPENAI_MODEL=
~~~

Example local database:

~~~env
DATABASE_URL=sqlite:///./datawhisper.db
~~~

Example production database:

~~~env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME
~~~

### Frontend

Create `frontend/.env` from `frontend/.env.example`.

~~~env
VITE_API_BASE_URL=
~~~

Local example:

~~~env
VITE_API_BASE_URL=http://127.0.0.1:8000
~~~

Production example:

~~~env
VITE_API_BASE_URL=https://datawhisper-backend-xcgl.onrender.com
~~~

> ⚠️ Never commit real API keys, JWT secrets, database URLs, or `.env` files to GitHub.

---

## 🧪 Testing

Backend tests:

~~~bash
cd backend
python -m pytest
~~~

Frontend production build:

~~~bash
cd frontend
npm run build
~~~

---

## 🧭 Demo Flow

1. Open the landing page.
2. Register a new user or log in.
3. Go to the dashboard.
4. Load demo business data or upload a CSV/Excel file.
5. Review business metrics, charts, and health score.
6. Ask a Turkish business question.
7. Read the AI-generated insight and recommended actions.

Example questions:

~~~text
Hangi ürünlere odaklanmalıyım?
En büyük iş risklerim neler?
Bana 3 aksiyon öner.
En çok iade edilen ürünler hangileri?
~~~

---

## 🔒 Security Notes

- OpenAI API key is stored only on the backend.
- Supabase PostgreSQL credentials are stored only in backend environment variables.
- Frontend never receives private API keys or database credentials.
- JWT is used for protected API routes.
- Uploaded files are analyzed for insights and are not permanently stored in the MVP version.

---

## 📈 Roadmap

### Version 2

- User analysis history
- Saved reports
- PDF export
- Excel export
- AI conversation history
- Scheduled reports

### Version 3

- Shopify integration
- Trendyol integration
- Inventory forecasting
- Demand prediction
- Automated anomaly detection
- AI-powered growth suggestions

---

## ✅ Current Status

### MVP v1.0 Completed

- Authentication system
- Dashboard analytics
- CSV and Excel processing
- AI business recommendations
- Supabase PostgreSQL integration
- Render backend deployment
- Vercel frontend deployment
- Responsive design
- Mobile routing support

---

## 👨‍💻 Author

### Emin Aksoy

Management Information Systems Student

Interested in:

- Business Analytics
- Artificial Intelligence Products
- Data-Driven Decision Support Systems
- Product Development
- Full-Stack Web Applications

**LinkedIn:** https://www.linkedin.com/in/YOUR-LINKEDIN-USERNAME

**GitHub:** https://github.com/EminAksoy3427

---

## 📄 License

This project was developed as an educational, portfolio, and product development project.

Feel free to explore, learn from, and provide feedback.
