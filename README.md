# Smart Travel Budget Planner (TravelBudget)

> **Tagline**: *"Plan Your Trip. Know Your Budget. Travel Smarter."*  
> **Core Loop / USP**: *"Plan → Experience → Travel → Calculate → Optimize → Track"*

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

## 7. The 7 Interconnected Intelligent Modules

Unlike isolated travel tools or generic chatbots, **TravelBudget** functions as a cohesive closed loop:
$$\text{Plan} \longrightarrow \text{Experience} \longrightarrow \text{Travel} \longrightarrow \text{Calculate} \longrightarrow \text{Optimize} \longrightarrow \text{Track}$$

### 1. 🚆 Smart Transport Comparison Engine (`src/lib/transport-comparison.ts`)
- Evaluates **Flight vs Train vs Bus** holistically.
- Includes intercity ticket fares, checked luggage fees, travel duration, and destination-to-hotel cab transfers.
- Computes per-person costs and awards a transparent **"Best Value"** badge highlighting exact rupee savings.
- Allows 1-click adoption to update the trip's transportation budget directly.

### 2. 🏙️ Destination Experience & Famous Things (`src/lib/city-data.ts`)
- Automatically populates when a destination (e.g., Bangalore, Goa, Jaipur, Manali, Mumbai, Delhi) is selected.
- Features must-visit tourist sights with entry fees, ideal durations, and vibes.
- Features iconic regional foods and legendary eateries with per-person price benchmarks.
- Offers **"+ Add to My Trip"** buttons that dynamically factor entry tickets and meals into the trip's live budget.

### 3. 🚕 Local Transport Expense Chain (`src/lib/transport-chain.ts`)
- Models realistic intra-city routes: $\text{Hotel} \rightarrow \text{Sight A} \rightarrow \text{Sight B} \rightarrow \text{Hotel}$.
- Group-size capacity economics: If group size is 4, it automatically advises booking **1 shared cab** rather than **2 separate auto-rickshaws**, saving up to ₹400/day.
- Provides 1-click addition of chained hops to the trip's local transit allocation.

### 4. ❤️ Weekend & Group Packages Recommendation Engine (`src/lib/packages-engine.ts`)
- Pre-engineered budget packages tailored to traveler personas:
  - **Couples**: Romantic boutique stays, sunset dinners, scenic viewpoints.
  - **Friends / College Groups**: Shared budget dorms, water sports, adventure trails, food crawls.
  - **Family**: Spacious resorts, child-friendly parks, safe private cabs.
  - **Solo**: Backpacker hostels, walking tours, scooter rentals.
- Full transparent breakdown with 1-click loading into the itinerary.

### 5. 💰 "What If?" Budget Optimizer (`src/lib/budget-optimizer.ts`)
- Interactive sensitivity-analysis levers:
  - Transit: Switch Flight to Superfast AC Train.
  - Lodging: Switch 4-Star to Verified Boutique Homestay.
  - Dining: Mix fine-dining with authentic local culinary gems.
  - Sightseeing: Swap high-fee private tours for open-air parks & self-guided landmarks.
- Displays dynamic before/after deficit reduction gauges.
- **"Auto-Balance Trip"** button instantly eliminates budget deficits with a single click.

### 6. 👩 Safety-Aware Travel Planning (`src/lib/safety-engine.ts`)
- Detects late-night transit risks (e.g. arrivals between 10:00 PM and 5:00 AM).
- Flags potential transit vulnerability and automatically budgets a verified prepaid taxi safety buffer (+₹180 to ₹350).
- Surfaces instant emergency SOS contacts:
  - **112**: All-India Unified Emergency Helpline
  - **1091**: Women's Safety Helpline
  - **139**: Indian Railways Security Helpline

### 7. ⚠️ Pre-Trip Hidden Cost Detector (`src/lib/transport-chain.ts`)
- Pre-trip financial vulnerability audit flagging frequently unbudgeted expenses:
  - Airport station-to-city center cabs (~₹900)
  - Inter-state highway toll plazas (~₹350)
  - Airline checked baggage overweight tariffs (~₹1,200)
  - Hotel incidental service charges & early check-in (~₹600)
- Quantifies total hidden liability (~₹1,850 - ₹3,050) and provides a 1-click **"Include in Contingency"** buffer.

---

## 8. Freemium Product Strategy

| Dimension | Free Tier ("Plan It My Way") | Premium Tier ("Plan It For Me") |
| :--- | :--- | :--- |
| **Philosophy** | Hands-on manual trip building | Instant AI automation & peace of mind |
| **Sights & Food** | Manual search & custom adding | Curated auto-assembled itineraries |
| **Transport** | Manual route chain calculations | Automated Flight vs Train vs Bus multi-criteria matrix |
| **Budget Balancing**| Manual slider adjustments | 1-Click "What If?" Auto-Rebalancing |
| **Safety & Hidden** | Basic checklists | Active late-night warnings & automated contingency buffers |
| **Pricing** | ₹0 forever | **₹1 introductory 30-day trial**, then ₹99/month recurring autopay |

---

## 9. AI Savings Assistant Engine

The AI recommendation engine in [`src/lib/ai-assistant.ts`](file:///C:/Users/gaksh/.gemini/antigravity/scratch/travel-budget/src/lib/ai-assistant.ts):
- Analyzes dominant expense categories.
- Offers actionable alternatives (e.g. advance train bookings, perimeter boutique homestays, mixed local dining).
- Quantifies estimated savings in ₹ and explains *why* the reduction occurs.
- Automatically falls back to smart rule-based recommendations if external AI APIs are unconfigured, ensuring **zero broken UI elements**.

---

## 10. Product Analytics & Conversion Funnel (Viva Module)

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

## 11. Payment Architecture (Razorpay & ₹1 Trial)

Engineered specifically for Indian payments:
1. **Server Order Creation**: Frontend requests an order via `POST /api/payment/create-order` charging **₹1 (100 paise)** for an introductory 30-day trial.
2. **Client Checkout**: Razorpay Checkout SDK opens in INR currency for the ₹1 trial mandate, with recurring autopay at ₹99/month.
3. **Server Signature Verification**: The server verifies payment authenticity via HMAC SHA256 using `RAZORPAY_KEY_SECRET`.
4. **Activation**: Premium subscription is unlocked in the database with `is_trial: true` and `renewal_amount: 99` upon confirmed signature verification.
5. **Academic Sandbox**: Includes an evaluation mode toggle for live viva demonstrations without requiring real credit cards.

---

## 12. Local Setup & Installation

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

## 13. Deployment to Vercel

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

## 14. College Viva Defense & Demonstration Guide (Team of 4)

When presenting this project to professors and external examiners, each of the 4 team members can showcase their domain:

| Member | Presentation Focus | Live Demo Actions |
| :--- | :--- | :--- |
| **Member 1 (Frontend & UI/UX)** | Design system, responsive layouts, Tailwind CSS typography, accessibility, mobile responsiveness. | Show Landing Page, Trip Creation wizard, dynamic tabs (`plan-my-way`, `optimizer`, `plan-for-me`), and clean visual badges. |
| **Member 2 (Backend & Database)** | PostgreSQL schema, Row-Level Security (RLS) preventing data leaks, dual-mode store architecture. | Explain `trips`, `expenses`, `events`, and `subscriptions` tables in Supabase; demonstrate how offline store ensures zero broken pages. |
| **Member 3 (Algorithms & Financial Intelligence)** | Multi-variable budget modeling, Flight vs Train vs Bus comparison matrix, intra-city transit chaining, and What-If sensitivity optimizer. | Demonstrate Smart Transport comparison with luggage fees; toggle What-If sliders to turn an over-budget trip into the green with 1 click. |
| **Member 4 (Product Analytics & Deployment Lead)** | 7-Stage conversion funnel telemetry, drop-off rates, Razorpay ₹1 trial architecture, Vercel CI/CD pipeline. | Navigate to `/analytics`, explain user drop-offs from Signup to Payment, demonstrate the ₹1 Razorpay checkout modal, and verify live Vercel URL. |

---

## 15. Future Scope

- **Live Flight & Hotel API Integrations**: Integration with Amadeus or Skyscanner for real-time fares.
- **OCR Receipt Scanning**: Extract amount and category directly from photo uploads of restaurant and hotel bills.
- **Group Trip Splitting**: Multi-user shared ledger with UPI settlement links.
- **Geographic Currency Converter**: Automatic foreign exchange calculation for international itineraries.
