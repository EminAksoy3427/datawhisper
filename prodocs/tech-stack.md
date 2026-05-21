# DataWhisper Tech Stack

## 1. Overview

DataWhisper is a full-stack AI-powered web application.

The application is designed with a separate frontend and backend architecture. The frontend is responsible for the user interface, while the backend manages authentication, CSV processing, business data analysis, and AI integration.

This architecture makes the backend reusable for future platforms such as mobile apps or third-party integrations.

---

## 2. Frontend Stack

### React

React will be used to build the user interface.

Reasons for choosing React:

- It is widely used in modern web applications.
- It has a large ecosystem.
- It works well with reusable components.
- It is suitable for dashboard-style interfaces.
- It is easy to combine with chart libraries and API calls.

### Vite

Vite will be used as the frontend build tool.

Reasons for choosing Vite:

- Fast development server
- Simple project setup
- Better developer experience
- Easy deployment to Vercel or similar platforms

### Tailwind CSS

Tailwind CSS will be used for styling.

Reasons for choosing Tailwind CSS:

- Fast UI development
- Consistent design system
- Easy responsive design
- Good fit for MVP development
- Reduces the need for writing custom CSS files

### Recharts

Recharts will be used for data visualization.

Reasons for choosing Recharts:

- Works well with React
- Easy to create bar, line, and pie charts
- Suitable for business dashboards
- Simple enough for the MVP scope

### Axios or Fetch API

The frontend will communicate with the backend through HTTP requests.

Possible use cases:

- Register user
- Login user
- Upload CSV
- Request AI analysis
- Fetch demo data
- Fetch business health score

---

## 3. Backend Stack

### FastAPI

FastAPI will be used to build the backend API.

Reasons for choosing FastAPI:

- Fast and modern Python framework
- Easy to create REST APIs
- Automatic API documentation with Swagger UI
- Strong support for request validation
- Works well with AI and data processing workflows

### Python

Python will be used for backend development.

Reasons for choosing Python:

- Strong ecosystem for data analysis
- Easy integration with AI APIs
- Suitable for CSV processing
- Beginner-friendly and readable
- Works well with Pandas and FastAPI

### Pandas

Pandas will be used for CSV parsing and business data analysis.

Use cases:

- Read uploaded CSV files
- Clean and inspect data
- Calculate revenue, cost, profit, and return metrics
- Generate product-level summaries
- Prepare structured business summaries for AI prompts

### SQLAlchemy

SQLAlchemy will be used as the ORM layer.

Use cases:

- Define user model
- Store registered users
- Manage database operations
- Keep database logic organized

### SQLite for Development

SQLite will be used during local development.

Reasons for choosing SQLite:

- Simple setup
- No separate database server required
- Good for MVP and local testing
- Easy to use while learning authentication and backend logic

### PostgreSQL for Deployment, Optional

If needed, PostgreSQL can be used for production deployment.

Reasons for considering PostgreSQL:

- More suitable for deployed applications
- Better long-term scalability
- Works well with Render, Railway, Supabase, and similar services

For MVP, SQLite is acceptable if deployment constraints require simplicity.

---

## 4. Authentication Stack

### JWT Authentication

JWT-based authentication will be used for login sessions.

Flow:

1. User registers with email and password.
2. Backend hashes the password and stores the user.
3. User logs in with email and password.
4. Backend validates credentials.
5. Backend returns a JWT token.
6. Frontend stores the token.
7. Frontend sends the token with protected API requests.

### Password Hashing

Passwords must never be stored as plain text.

The backend will use password hashing through libraries such as:

- passlib
- bcrypt

Security rules:

- Store only hashed passwords.
- Keep JWT secret in environment variables.
- Do not commit `.env` files to GitHub.

---

## 5. AI Stack

### OpenAI API

OpenAI API will be used to generate business insights from structured data summaries.

The backend will not send the entire raw dataset to the AI model unless necessary. Instead, it will prepare a summarized version of the uploaded business data.

The AI will be used for:

- Answering Turkish business questions
- Explaining data insights in simple language
- Suggesting actions
- Identifying risks
- Creating business-friendly summaries

### AI Prompting Strategy

The backend will send the AI a structured prompt containing:

- User question
- Business data summary
- Key metrics
- Top products
- Return information
- Profit and cost indicators
- Required output format

Expected AI response format:

```json
{
  "summary": "Short summary of the situation",
  "insight": "Main business insight",
  "recommendation": "Actionable recommendation",
  "risk_level": "low | medium | high",
  "chart_suggestion": "bar | line | pie | table"
}