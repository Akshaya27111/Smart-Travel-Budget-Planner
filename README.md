# Smart Travel Budget Planner (TravelBudget)

> **Tagline**: *"Plan Your Trip. Know Your Budget. Travel Smarter."*

A full-stack, AI-powered travel-finance SaaS web application designed to help travelers estimate, optimize, and record actual travel expenditures. Developed as a real-world project for the **7th-Semester Mechanical Engineering Product Analytics Course** by a team of 4 members.

---

## 1. Project Objective & Problem Statement

### The Problem
Travelers often struggle with financial uncertainty during journeys:
1. **Unpredictable Expenses**: Hidden costs in transit, fluctuating hotel tariffs, and incidental expenses lead to severe budget overflows.
2. **Spreadsheet Friction**: Existing solutions require manual spreadsheet calculations without explainable localized benchmarks.
3. **Lack of Actionable Optimization**: Generic advice doesn't quantify how much money specific trade-offs (e.g., trains vs flights, homestays vs resorts) actually save in rupees.
4. **Disconnection Between Planning & Actuals**: Travel planning tools do not integrate live expense management to track variance against pre-trip estimates.

### The Solution
**TravelBudget** bridges the gap with:
- A transparent, multi-variable **Budget Calculation Engine** (transit, lodging, food, local transit, activities, contingency).
- Contextual **AI Travel Savings Assistant** recommendations with concrete ₹ savings calculations.
- Comprehensive **Expense Ledger** comparing planned vs. actual outlays.
- Embedded **Product Analytics & Funnel Telemetry** tracking the entire user lifecycle for academic evaluation.

---

## 2. Team of Four - Responsibility Matrix

| Team Member | Core Domain | Responsibilities |
| :--- | :--- | :--- |
| **Member 1** | **Frontend / UI / UX Designer** | Design system, responsive layouts, Tailwind styling, Landing Page, Navigation, and Card Components. |
| **Member 2** | **Backend / Database Engineer** | Supabase architecture, PostgreSQL schema design, Row-Level Security (RLS) policies, and Auth flows. |
| **Member 3** | **Algorithm & AI Engineer** | Mathematical Budget Estimation Engine, AI Savings Assistant heuristics, and Expense Ledger logic. |
| **Member 4** | **Product Analytics & Deployment Lead** | Telemetry tracking, 7-stage conversion funnel, Razorpay payment architecture, and Vercel production deployment. |

---

## 3. Technology Stack

- **Framework**: [Next.js 14+ (App Router)](https://nextjs.org/)
- **UI & Components**: React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Visualizations**: Recharts & Custom Tailwind SVG Graphs
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL with RLS)
- **Payment Architecture**: [Razorpay](https://razorpay.com/) (India Payment Gateway, Server-Side Order & Signature Verification)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 4. System Architecture

```
+-------------------------------------------------------------------------------+
|                           Client Browser / Mobile PWA                         |
|  - Landing Page (/)               - Dashboard (/dashboard)                    |
|  - Auth (/login, /signup)         - Trip Wizard (/create-trip)                |
|  - Expense Ledger (/trips/[id])   - Product Analytics (/analytics)            |
|  - Pricing & Checkout (/premium)  - User Profile (/profile)                   |
+-------------------------------------------------------------------------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
+--------------------------------+           +----------------------------------+
|      Client Telemetry Layer    |           |       Next.js Server API Routes  |
| - trackEvent(name, metadata)   |           | - /api/ai/savings                |
| - 7-Stage Funnel Visualizer    |           | - /api/payment/create-order      |
| - Dual Store (Supabase + Demo) |           | - /api/payment/verify (HMAC SHA) |
+--------------------------------+           +----------------------------------+
                 |                                             |
                 +----------------------+----------------------+
                                        |
+-------------------------------------------------------------------------------+
|                             Supabase PostgreSQL Database                      |
|  - profiles (User identity)         - trips (Itinerary estimates & styles)    |
|  - expenses (Actual spend items)    - events (Product Analytics telemetry)    |
|  - subscriptions (Free/Premium)     - Row Level Security (RLS) Policies       |
+-------------------------------------------------------------------------------+
```

---

## 5. Database Schema & RLS Policies

All tables are defined in [`supabase/schema.sql`](file:///C:/Users/gaksh/.gemini/antigravity/scratch/travel-budget/supabase/schema.sql):

1. **`profiles`**: `id (UUID FK auth.users)`, `full_name`, `email`, `created_at`, `updated_at`.
2. **`trips`**: `id (UUID)`, `user_id (UUID)`, `origin`, `destination`, `start_date`, `end_date`, `travelers`, `travel_style`, `max_budget`, `transport_preference`, `accommodation_preference`, `food_preference`, `activity_preference`, `estimated_transport`, `estimated_accommodation`, `estimated_food`, `estimated_local_transport`, `estimated_activities`, `estimated_miscellaneous`, `estimated_total`.
3. **`expenses`**: `id (UUID)`, `user_id (UUID)`, `trip_id (UUID FK trips)`, `description`, `category`, `amount`, `expense_date`.
4. **`events`**: `id (UUID)`, `user_id (UUID)`, `event_name`, `metadata (JSONB)`, `created_at`.
5. **`subscriptions`**: `id (UUID)`, `user_id (UUID)`, `plan ('free' | 'premium')`, `status ('active' | 'expired')`, `payment_reference`, `expires_at`.

### Row Level Security (RLS)
Every table enforces strict RLS policies ensuring authenticated users can only view, create, edit, or delete their own records (`auth.uid() = user_id`).

---

## 6. Budget Calculation Methodology

The estimation engine in [`src/lib/budget-engine.ts`](file:///C:/Users/gaksh/.gemini/antigravity/scratch/travel-budget/src/lib/budget-engine.ts) computes realistic costs:
- **Transportation**: Mode multipliers (Flight: ₹5,000/person; Train: ₹1,200/person; Bus: ₹800/person; Car: vehicle cost model) multiplied by travel style weights.
- **Accommodation**: Rooms needed = `ceil(travelers / 2)`. Multiplied by room tier rates (Budget: ₹1,200/night; Standard: ₹2,800/night; Premium: ₹6,500/night) and duration.
- **Food**: Daily meal rates per person (Budget: ₹500/day; Standard: ₹1,000/day; Premium: ₹2,200/day).
- **Local Transit**: Cabs, autos, and scooter rentals per day adjusted to group capacity.
- **Activities & Sights**: Daily ticket budgets based on intensity (`Low`: ₹200/day; `Medium`: ₹500/day; `High`: ₹1,200/day).
- **Contingency Buffer**: 5% automated allowance for tolls, tips, and unexpected expenditures.

---

## 7. AI Savings Assistant Engine

The AI recommendation engine in [`src/lib/ai-assistant.ts`](file:///C:/Users/gaksh/.gemini/antigravity/scratch/travel-budget/src/lib/ai-assistant.ts):
- Analyzes dominant expense categories.
- Offers actionable alternatives (e.g. advance train bookings, perimeter boutique homestays, mixed local dining).
- Quantifies estimated savings in ₹ and explains *why* the reduction occurs.
- Automatically falls back to smart rule-based recommendations if external AI APIs are unconfigured, ensuring **zero broken UI elements**.

---

## 8. Product Analytics & Conversion Funnel (Viva Module)

The application logs real-time user events into the `events` table:
- `signup`
- `login`
- `dashboard_view`
- `trip_created`
- `budget_calculated`
- `trip_viewed`
- `ai_recommendation_viewed`
- `expense_added`
- `expense_deleted`
- `premium_viewed`
- `payment_started`
- `payment_completed`

### 7-Stage Product Funnel
The Analytics page calculates drop-offs across:
$$\text{Signup} \longrightarrow \text{Trip Created} \longrightarrow \text{Budget Calculated} \longrightarrow \text{AI Tip Viewed} \longrightarrow \text{Expense Added} \longrightarrow \text{Premium Viewed} \longrightarrow \text{Payment Completed}$$

Includes 4 statistical Recharts visual graphs:
1. Planned vs Actual Spending
2. Spending by Category
3. Budget Utilization Rates
4. Chronological Trip Trends

---

## 9. Payment Architecture (Razorpay)

Engineered specifically for Indian payments:
1. **Server Order Creation**: Frontend requests an order via `POST /api/payment/create-order`.
2. **Client Checkout**: Razorpay Checkout SDK opens in INR currency for ₹199.
3. **Server Signature Verification**: The server verifies payment authenticity via HMAC SHA256 using `RAZORPAY_KEY_SECRET`.
4. **Activation**: Premium subscription is unlocked in the database only upon confirmed signature verification.
5. **Academic Sandbox**: Includes an evaluation mode toggle for live viva demonstrations without requiring real credit cards.

---

## 10. Local Setup & Installation

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Steps
1. Navigate to the project folder:
   ```bash
   cd travel-budget
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   *(Note: If Supabase keys are left empty, the application runs seamlessly using its built-in local store for offline viva demonstrations).*

4. Run development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. Verify production build:
   ```bash
   npm run build
   ```

---

## 11. Deployment to Vercel

1. Push this repository to GitHub / GitLab.
2. Log in to [Vercel](https://vercel.com/) and click **New Project**.
3. Import the repository.
4. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
5. Click **Deploy**. Vercel will build and serve the application globally with automatic SSL.

---

## 12. Future Scope

- **Live Flight & Hotel API Integrations**: Integration with Amadeus or Skyscanner for real-time fares.
- **OCR Receipt Scanning**: Extract amount and category directly from photo uploads of restaurant and hotel bills.
- **Group Trip Splitting**: Multi-user shared ledger with UPI settlement links.
- **Geographic Currency Converter**: Automatic foreign exchange calculation for international itineraries.
