# DataWhisper PRD

## 1. Product Name

DataWhisper

## 2. One-Sentence Description

DataWhisper is an AI-powered business intelligence assistant that helps small businesses upload CSV data, ask business questions in Turkish, and receive charts, summaries, and actionable recommendations.

## 3. Problem Statement

Small e-commerce sellers, boutique manufacturers, and retailers often keep their sales, inventory, return, and cost data in Excel or CSV files.

Although they have valuable business data, they usually struggle to analyze it because tools like Power BI, Tableau, Looker, or ERP systems can be too complex, expensive, or technical for their daily needs.

These users need fast answers to practical business questions such as:

- Which products were returned the most last month?
- What is my total return cost?
- Which products have a declining profit margin?
- Which supplier or product category creates the most risk?
- What actions should I take this week?

## 4. Target Users

### Primary Users

- Small e-commerce sellers
- Boutique manufacturers
- Small retailers
- Small business owners using Excel or CSV files

### User Characteristics

- They are not technical users.
- They usually do not have a data analyst.
- They want simple and actionable business insights.
- They prefer Turkish explanations.
- They need practical recommendations, not complex dashboards.

## 5. Product Positioning

DataWhisper is not just a dashboard tool.

It is a Turkish AI business analyst for small businesses.

Instead of forcing users to create reports manually, DataWhisper lets them upload their CSV data and ask questions in natural language.

## 6. Core Value Proposition

DataWhisper helps small businesses understand their data without needing advanced BI tools or technical knowledge.

The user can:

1. Upload a CSV file or use demo data.
2. Ask a business question in Turkish.
3. Receive an AI-generated explanation.
4. View relevant charts.
5. Get actionable recommendations.

## 7. MVP Scope

The MVP will include the following features:

### 7.1 Landing Page

A simple landing page explaining:

- What DataWhisper does
- Who it is for
- What problem it solves
- How the user can start

### 7.2 Register

Users can create an account with:

- Name or business name
- Email
- Password

### 7.3 Login

Users can log in with:

- Email
- Password

### 7.4 User Session

After login, the user can access the dashboard.

Unauthenticated users should not access the main dashboard.

### 7.5 Demo Data Mode

Users can start with sample business data without uploading a file.

This helps demonstrate the product quickly during the demo video.

### 7.6 CSV Upload

Users can upload a CSV file containing business data such as:

- Product name
- Category
- Sales quantity
- Revenue
- Cost
- Return quantity
- Return reason
- Supplier
- Date

### 7.7 Data Summary

After CSV upload, the system shows a basic data summary:

- Total revenue
- Total cost
- Estimated profit
- Total returns
- Return rate
- Top products
- Risky products

### 7.8 Turkish Natural Language Questions

Users can ask questions in Turkish, such as:

- Geçen ay en çok hangi ürünler iade edildi?
- İade maliyetim ne kadar?
- Hangi ürünlerde kâr marjım düşüyor?
- Hangi kategori daha riskli görünüyor?
- Bu hafta neye odaklanmalıyım?

### 7.9 Question Templates

The dashboard will include ready-to-use question templates.

Example templates:

- En çok iade edilen ürünleri göster.
- Kâr marjı düşük ürünleri analiz et.
- Bana bu veriye göre 3 aksiyon öner.
- İşletme sağlığı skorumu yorumla.

### 7.10 AI Analysis Response

The backend sends the user question and summarized business data to the OpenAI API.

The AI response should include:

- Short summary
- Key insight
- Recommended action
- Risk level
- Suggested chart type

### 7.11 Charts

The frontend displays simple charts using Recharts.

Possible charts:

- Bar chart for top returned products
- Bar chart for product revenue
- Pie chart for category distribution
- Line chart for monthly revenue if date data exists

### 7.12 Action Recommendations

The system gives practical business recommendations, such as:

- Check product quality for high-return products.
- Review supplier performance.
- Reduce stock for low-margin products.
- Investigate return reasons.
- Focus marketing on profitable products.

### 7.13 Business Health Score

The system calculates a simple score between 0 and 100.

The score may consider:

- Profit margin
- Return rate
- Revenue concentration
- Cost level
- Product risk

The score should be easy to understand and should include a short explanation.

### 7.14 Live Deployment

The application must be deployed and accessible with a public URL.

## 8. Out of Scope for MVP

The following features will not be included in the MVP:

- Payment or subscription system
- Real Shopify, Trendyol, Paraşüt, Logo, or ERP integrations
- Advanced dashboard builder
- Multi-company account management
- Role-based access control
- Email verification
- Password reset
- Google login
- Native mobile application
- Real-time data synchronization

## 9. User Flow

### New User Flow

1. User visits landing page.
2. User clicks register.
3. User creates an account.
4. User logs in.
5. User reaches dashboard.
6. User selects demo data or uploads CSV.
7. User sees data summary.
8. User asks a question in Turkish.
9. AI returns insight, chart suggestion, and recommendation.
10. User reviews business health score.

### Returning User Flow

1. User visits application.
2. User logs in.
3. User reaches dashboard.
4. User uploads CSV or uses demo data.
5. User asks business questions.
6. User reviews AI insights and recommendations.

## 10. Functional Requirements

### Authentication

- The user must be able to register.
- The user must be able to log in.
- The backend must return a JWT token after successful login.
- Protected backend endpoints should require authentication.
- The frontend should store the token and use it for authenticated requests.

### CSV Analysis

- The user must be able to upload CSV files.
- The backend must parse the CSV file.
- The backend must generate a structured summary.
- The system must handle missing or invalid fields gracefully.

### AI Analysis

- The user must be able to ask a question.
- The backend must send the business summary and question to the AI model.
- The AI must return a structured response.
- The response should be understandable for a small business owner.

### Dashboard

- The user must see key metrics.
- The user must see charts.
- The user must see AI-generated recommendations.
- The user must see business health score.

## 11. Non-Functional Requirements

### Simplicity

The interface should be simple, clean, and beginner-friendly.

### Performance

The MVP should work smoothly with small and medium CSV files.

### Security

- Real API keys must not be committed to GitHub.
- Passwords must be hashed.
- JWT secret must be stored in environment variables.
- Sensitive values must be placed in `.env` files.

### Maintainability

The project must have a clear folder structure:

- `/frontend`
- `/backend`
- `/prodocs`

### Deployability

The application should be deployable using free or low-cost services.

## 12. Success Criteria

The project will be considered successful if:

- The user can register and log in.
- The user can upload or select demo data.
- The system can summarize business data.
- The user can ask a Turkish business question.
- The AI can return a useful analysis.
- The frontend can display charts and recommendations.
- The app is deployed with a public URL.
- GitHub repository includes required documentation.
- Demo video clearly shows the full product flow.

## 13. Demo Scenario

The demo video should show this flow:

1. Introduce the problem.
2. Explain the target user.
3. Open the live DataWhisper app.
4. Register or log in.
5. Use demo data or upload CSV.
6. Show the data summary.
7. Ask: “Geçen ay en çok hangi ürünler iade edildi?”
8. Show AI insight, chart, and recommendation.
9. Show business health score.
10. Explain frontend, backend, and AI integration.
11. Mention future plans.

## 14. Future Improvements

After MVP, possible improvements include:

- Password reset
- Google login
- User analysis history
- Saved reports
- PDF export
- Shopify or Trendyol integration
- More advanced data cleaning
- Multi-company support
- Subscription system