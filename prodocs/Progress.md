# DataWhisper Progress Log

## 2026-06-14 (Final UI polish and realistic demo data)

### Completed

- Final UI polish: removed technical email verification copy from signup and adjusted demo data to produce a more realistic business health score.

## 2026-06-14 (Auth UI without verified email domain)

### Completed

- Adjusted auth UI for final delivery without a verified email domain: kept password reset and email verification infrastructure, but avoided misleading live email-sending claims in the UI.

## 2026-06-14 (Production-style auth improvements)

### Completed

- Added production-style auth improvements including password reset email flow, email verification flow, stronger form validation, password visibility toggles, and non-blocking verification notice.

## 2026-06-05 (GitHub presentation polish)

### Completed

- Polished root README with final project overview, live deployment links, architecture, screenshots section, setup instructions, security notes, and roadmap. Added docs/screenshots folder structure for GitHub presentation.

## 2026-06-04 (Supabase PostgreSQL readiness)

### Completed

- Added `psycopg2-binary` to `backend/requirements.txt` for SQLAlchemy PostgreSQL URLs.
- Confirmed `database.py` uses SQLite `check_same_thread` only for `sqlite://` URLs; PostgreSQL uses default engine options.
- Documented local SQLite vs production `DATABASE_URL` in `backend/.env.example`, `README.md`, and this log.

### Verified

- Backend `python -m pytest` passes with SQLite (no Supabase credentials required).

## 2026-06-04 (AI analyst section polish)

### Completed

- Merged **AI İş Analistine Sor** card: örnek sorular + textarea + “AI Analizi Oluştur” CTA; capability-aware chips (iade/kategori/kâr marjı).
- **InsightCard**: premium empty preview (Ana bulgu / Neden önemli / Aksiyonlar), two-line loading copy; matched min-height with question card on desktop.

## 2026-06-04 (final QA & responsive polish)

### Checked

- Landing CTAs (`/register`, `/login`), footer copy — no “Bootcamp MVP” in UI.
- Auth login/register flows, loading and error states.
- Dashboard demo/upload, metrics, charts, category table scroll, AI section chips/loading/empty states.

### Fixed

- Global and page-level `overflow-x-hidden` / `min-w-0` on grids and chart containers to prevent horizontal scroll at 390–1440px.
- Compact status card copy (“Verileriniz hazır”), mobile-friendly card padding and full-width upload buttons on small screens.
- Landing hero type scale, auth card padding, chart `ResponsiveContainer` minWidth.

### Verified

- Backend tests (7 passed), frontend `npm run build` passed.

## 2026-06-04 (rich demo dataset)

### Completed

- Replaced 12-row demo with **40 synthetic rows** in `demo_data_service.py`: 8 categories, 4 sales channels, 6 Turkish regions, order priority, unit/total revenue-cost-profit math, returns with reasons.
- Demo `GET /demo-data` returns full detection metadata and empty `missing_capabilities` (happy path).
- Tests updated: `DEMO_ROW_COUNT`, detection metadata assertions.

## 2026-06-04 (Dosya Durumu card — business UX)

### Completed

- Simplified `DataUnderstandingCard` to **Dosya Durumu**: compact success copy, business field chips (no column names or % in default view), max 3 friendly guidance lines from `dataUnderstandingGuidance.ts`.
- Technical mappings, confidence, and `possible_matches` moved behind **Teknik eşleşmeleri göster** toggle.

## 2026-06-04 (dashboard upload feedback)

### Completed

- Extended `BusinessSummary` types with `detected_column_confidence`, `detected_dimensions`, `possible_matches`.
- Added `DataUnderstandingCard` on dashboard after analysis cards; upload success copy; chart-specific empty states via `chartEmptyMessages.ts`.

## 2026-06-04 (flexible data understanding layer)

### Completed

- Added `app/services/column_detection.py`: header normalization (Turkish chars, punctuation, snake/kebab case), expanded TR/EN aliases for 18 canonical fields, RapidFuzz fuzzy matching (exact first, ≥85 accepted, 70–84 `possible_matches`, &lt;70 ignored).
- Refactored `csv_service.py` with safe metric rules (prefer total revenue/cost/profit columns over unit×quantity), dimension fields in `detected_dimensions`, null-safe calculations, and richer Turkish `missing_capabilities`.
- Extended `BusinessSummaryResponse` with `detected_column_confidence`, `detected_dimensions`, `possible_matches`; added `rapidfuzz` to `requirements.txt`.
- Added `backend/tests/test_data_understanding.py` (demo, Turkish headers, English sales export, fuzzy confidence bands).

## 2026-06-03 (auth pages SaaS polish)

### Completed

- Added shared `AuthLayout` (`src/components/AuthLayout.tsx`) with a two-column desktop layout: left product value panel (title, copy, four check-mark benefits, security trust note) and right auth form card. Mobile stacks vertically with the value panel above the form.
- Polished `LoginPage`: new title “Tekrar hoş geldiniz”, subtitle, post-submit note about demo/own data, soft gradient background matching the landing page. Auth logic, fields, loading/error states, and redirect unchanged.
- Polished `RegisterPage`: new title “DataWhisper’a başlayın”, subtitle, “Kredi kartı gerekmez…” note under the button. Same auth behavior preserved.
- Reuses existing Tailwind tokens (`dw-primary`, `dw-secondary`, `dw-bg`, `dw-card`, `dw-border`, `--radius-dw`). No “Bootcamp MVP” text; Navbar unchanged.

## 2026-05-25 (landing page SaaS polish)

### Completed

- Redesigned `src/pages/LandingPage.tsx` into a proper SaaS-style product page (no backend, auth, or dashboard changes).
- New hero: headline “Küçük işletmeniz için Türkçe AI iş analisti”, supporting subheadline, “Ücretsiz Başla” + “Giriş Yap” CTAs, and three trust badges (“CSV & Excel desteği”, “Türkçe soru-cevap”, “Kod veya BI bilgisi gerekmez”). Hero uses a soft gradient and a two-column layout on `lg`.
- Added a static `ProductPreview` card next to the hero — a faux mini dashboard with İşletme Sağlık Skoru 85/100, Toplam Gelir ₺202.250, İade Oranı %11,8 and an AI Bulgu chip (“İade riski Giyim kategorisinde yoğunlaşıyor.”), risk badge included. No real API calls.
- Added three new content sections with consistent eyebrow + title + description headers:
  - **Nasıl çalışır?** — 3 numbered step cards (Dosyanızı yükleyin / Türkçe sorun / Aksiyon alın).
  - **Kimler için?** — 3 target user cards (E-ticaret satıcıları / Butik üreticiler / Küçük perakendeciler).
  - **Neden DataWhisper?** — 3 benefit cards (Excel karmaşası / İade ve kârlılık riskleri / Teknik bilgi gerekmez).
- Added a closing CTA banner with both CTAs repeated.
- Footer copy updated: “© 2026 DataWhisper — Yapay Zeka Destekli İş Analizi Platformu”. The previous “Bootcamp MVP” text appeared only here; verified there are no other occurrences in the frontend.
- All copy in Turkish, all styling reuses existing Tailwind tokens (`dw-primary`, `dw-secondary`, `dw-bg`, `dw-card`, `dw-border`, `--radius-dw`). Page is responsive (mobile single column, `lg` two-column hero, `md:grid-cols-3` for card sections).

## 2026-05-25 (dashboard guidance polish)

### Completed

- Added `AnalysisStatusCard` (`Analiz hazır` banner with row count + four KPI pills + a short Turkish status sentence that gracefully degrades to “Veri yok” when metrics are null).
- Added `ExecutiveSummaryCard` — three on-device Turkish insights generated from `business_summary` without calling the AI: strongest category by revenue (with revenue share), bucketed return-rate interpretation, bucketed profit-margin interpretation. Skips any insight whose source metric is null and shows a friendly empty state when none are available.
- Added `QuestionTemplates` chip strip above the question box with five ready-made KOBİ questions. Clicking a chip fills the textarea; chips are disabled while data is loading or a question is in-flight.
- Category Özeti table now includes an “İade Riski” column with Düşük / Orta / Yüksek / Veri yok badges (thresholds 0–5 % / 5–12 % / 12 %+) plus the calculated rate. Helper lives in `src/lib/categoryRisk.ts`.
- `DashboardPage` removed the duplicated “✓ N satır başarıyla analiz edildi” line from the upload section (now owned by `AnalysisStatusCard`).
- No backend changes; auth, upload, demo data, health score, charts, and AI insight flows unchanged.

## 2026-05-25 (AI insight upgrade)

### Completed

- Rewrote `app/services/ai_service.py` system prompt: AI now responds as a practical KOBİ business analyst, grounded in concrete products/categories/metrics from `business_summary`, with an explicit instruction to flag missing data instead of guessing.
- Extended `AnalysisResponse` (Pydantic schema + frontend type) with structured fields: `headline`, `focus_area`, `priority`, `main_finding`, `why_it_matters`, `recommended_actions` (×3), `expected_impact`, `data_to_check` (3–5), `follow_up_questions` (×3). Legacy `summary`/`insight`/`recommendation`/`risk_level`/`chart_suggestion` fields are preserved and auto-derived for backward compatibility.
- Defensive parser enforces field counts, headline length cap (120 chars), normalizes `priority` to one of the three allowed Turkish values, and falls back gracefully when the model omits a field.
- Redesigned `src/components/InsightCard.tsx`: new title “DataWhisper AI Analizi”, three badges (Risk Seviyesi / Odak Alanı / Öncelik), bold headline, six numbered sections (Ana Bulgu, Neden Önemli?, Önerilen Aksiyonlar, Olası Etki, Kontrol Edilecek Veriler, Sonraki Sorular), checklist for actions, chips for `data_to_check`, clickable chips for `follow_up_questions` that pre-fill the question box. Removed the visible “Önerilen grafik” chip.
- `getPriorityBadgeClass` helper added in `src/lib/labels.ts`.

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