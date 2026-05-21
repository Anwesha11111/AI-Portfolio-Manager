# AI-Powered Stock Portfolio Manager: Platform Workflow

This document outlines the overall user journey and the logical workflow of the platform from start to finish.

## 1. Authentication & User Onboarding
The journey begins when a new user signs up for the platform.
* **Registration**: The user signs up via `Auth.jsx`. The form features real-time password strength validation, country selection with flag emojis, and dynamic regex-based document verification (e.g., verifying a 12-digit Aadhaar for India or an SSN for the USA).
* **Supabase Sync**: Upon successful registration, a Supabase trigger automatically inserts the user's details, including their `country` and `document_number`, into the `public.users` table.
* **Financial Profiling**: The user is immediately redirected to `Onboarding.jsx`, where they input their Monthly Income, Expenses, Total Savings, Investment Goals (Short/Medium/Long), and Risk Appetite (Conservative/Moderate/Aggressive).

## 2. Global State & The Time Machine
Once logged in, the user enters the main application environment.
* **Global Store**: `Zustand` manages global state across the app. `useAuthStore` handles the user session, while `useThemeStore` manages the active UI theme (e.g., Wall Street Classic, OLED Pitch Black).
* **The Time Machine**: The core novelty of the app is the `useSimulationStore`, which controls a "Simulated Date." The user can use the Time Machine in the navigation bar to travel back and forth in time. When the date changes, the *entire app* fetches historical price data relative to that exact date, updating valuations, charts, and P&L automatically.

## 3. Market Discovery & AI Architect
Users navigate to the `Market.jsx` page to discover assets and receive guidance.
* **Market Overview**: Users can view various stocks, filter by timeframe, and sort by Top Gainers/Losers or alphabetically.
* **AI Portfolio Architect**: A premium feature accessible via the "AI Architect" button. It sends the user's financial profile and the current simulated date to a Node.js AI backend endpoint (`/api/ai/recommend`). The AI calculates their **investable capacity** and returns a tailored monthly investment plan. The user can execute the entire plan with a single "Buy Full Portfolio" click.
* **Asset Details**: Clicking on an asset takes the user to `AssetDetails.jsx`, where they can view an interactive, historical price chart (built with `Recharts`) and execute manual Buy/Sell trades using their virtual balance.

## 4. Dashboard & Trade Post-Mortems
The `Dashboard.jsx` provides a real-time summary of the user's performance.
* **Summary Cards**: Displays Net Worth, Market Value, Total P&L, Available Capital, and total active Holdings.
* **Sector Allocation**: A visual breakdown of the portfolio split between IT, Banking, Energy, Consumer, etc.
* **Interactive Tooltips**: Key metrics have `i` icons that explain their significance.
* **Trade Post-Mortems**: Clicking on any active holding opens a detailed "Insight Modal". This utilizes the `insightGenerator.js` to mathematically analyze the trade's duration, profitability, and the asset's inherent risk against the user's onboarding risk profile to generate:
  * Profile Suitability % Match
  * Stock Risk Score
  * AI-driven Learning Insights (Pattern Recognition, Outcome Reason)
  * Actionable Strategy Tweaks (e.g., "Set a trailing stop-loss")

## 5. Academy (Gamified Education)
Addressing the problem statement of educating retail investors, the `Academy.jsx` tab provides structured learning.
* Users can read interactive finance lessons (`LessonView.jsx`).
* As they complete lessons, they build foundational knowledge to prevent them from making trades based purely on "gut feeling."
