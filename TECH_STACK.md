# Tech Stack & Architecture

This platform leverages a modern, high-performance web development stack designed for scalability, reactivity, and a premium user experience.

## Frontend Architecture
* **Framework**: React.js (Bootstrapped via Vite for lightning-fast HMR and optimized builds)
* **Routing**: React Router DOM (Single Page Application navigation)
* **State Management**: Zustand
  * Used for lightweight, boilerplate-free global state management.
  * We use distinct stores (`useAuthStore`, `useSimulationStore`, `useThemeStore`) to separate concerns cleanly without the heavy overhead of Redux.
* **Data Visualization**: Recharts
  * Used for rendering highly responsive, interactive, and customizable SVG charts for historical stock prices and portfolio metrics.
* **Icons**: Lucide React
  * A clean, modern icon library used consistently throughout the application for tooltips, navigation, and badges.

## Styling & Theming
* **CSS Methodology**: Vanilla CSS with CSS Modules and CSS Variables.
* **Custom Theming Engine**: We bypassed heavy UI libraries (like MUI or Tailwind) in favor of a highly optimized, custom-built CSS Variable engine. This allows users to switch seamlessly between 5 premium themes (Wall Street Classic, OLED Pitch Black, Neon Cyberpunk, etc.) instantly at runtime without page reloads.
* **Animations**: Pure CSS keyframes and transitions for smooth glassmorphism effects, modal popups (`animate-fade-in-up`), and hover states.

## Backend & Database Layer
* **Database (BaaS)**: Supabase (PostgreSQL)
  * Provides a highly relational, scalable PostgreSQL database.
  * Used to store `users`, `holdings`, and `transactions`.
  * Utilizes advanced PostgreSQL features like Triggers and Functions (e.g., `handle_new_user` trigger to automatically sync auth data to the public users table).
* **Authentication**: Supabase Auth
  * Enterprise-grade JWT (JSON Web Token) based authentication.
  * Secures API routes and manages user sessions effortlessly.

## AI & Data Integration
* **Mock/External Backend**: Node.js / Express
  * The `/api/ai/recommend` endpoint is handled by an external backend service that processes user financial data and returns AI-driven portfolio allocations.
* **Frontend Insight Engine**: Custom JS Engine (`insightGenerator.js`)
  * Instead of relying entirely on expensive external LLM API calls for every minor UI interaction, we built a deterministic frontend engine. It mathematically calculates Risk Scores and Profile Suitability Match Percentages in real-time, generating highly realistic "Trade Post-Mortems" locally in the browser.
