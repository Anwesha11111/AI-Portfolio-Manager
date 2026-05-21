# Project File Structure

Below is an overview of the `src` directory and the purpose of each file in the AI-Powered Stock Portfolio Manager.

```text
src/
├── App.jsx                 # Root component, sets up React Router and checks Auth state
├── main.jsx                # Entry point, mounts React to the DOM
├── index.css               # Global CSS variables, default styles, and theme definitions
├── responsive.css          # Media queries for mobile/tablet responsiveness
├── App.css                 # Base layout styling
│
├── assets/                 # Static images and SVGs
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
│
├── components/
│   ├── SplashScreen.jsx    # Animated loading screen shown on initial app load
│   └── layout/
│       ├── Layout.jsx      # Main application shell (Sidebar, Navbar, Time Machine)
│       ├── Layout.module.css # Scoped styles for the Layout
│       ├── ProfileModal.jsx # User profile popup from navbar
│       ├── SettingsModal.jsx # Modal to change App Themes and Preferences
│       └── TourOverlay.jsx # Interactive onboarding tutorial for new users
│
├── data/
│   └── lessons.js          # Hardcoded JSON data for the Academy financial lessons
│
├── lib/
│   └── supabase.js         # Supabase client initialization using environment variables
│
├── pages/                  # Main Route Components
│   ├── Academy.jsx         # Hub for educational modules
│   ├── Analysis.jsx        # Advanced portfolio analytics
│   ├── AssetDetails.jsx    # Individual stock view (Recharts graph, Buy/Sell forms)
│   ├── Auth.jsx            # Login & Registration page (Password validation, Document checks)
│   ├── Dashboard.jsx       # Main user dashboard (Stats, Holdings, P&L, Insight Modals)
│   ├── Discover.jsx        # Exploring new sectors/funds
│   ├── Landing.jsx         # Unauthenticated marketing home page
│   ├── LessonView.jsx      # Reading view for a specific Academy lesson
│   ├── Market.jsx          # Stock list, AI Portfolio Architect, filtering/sorting
│   └── Onboarding.jsx      # Flow to capture user's financial profile after signup
│
├── store/                  # Zustand State Management
│   ├── useAuthStore.js     # Handles login, signup, logout, and auth state tracking
│   ├── useSimulationStore.js # The "Time Machine" logic, fetches historical OHLCV data
│   └── useThemeStore.js    # Manages the active UI theme state
│
└── utils/
    ├── assetMap.js         # Maps stock tickers to company names, logos, colors, and descriptions
    └── insightGenerator.js # Frontend engine that deterministically calculates Risk Scores, Suitability, and Trade Post-Mortems
```

## Key File Highlights
* **`utils/insightGenerator.js`**: A vital piece of the application's novelty. It calculates how well a stock matches the logged-in user's risk profile based on holding duration and price action.
* **`store/useSimulationStore.js`**: The beating heart of the "Global Time Machine" feature. It handles fetching historical market data relative to the user's selected simulated date.
* **`pages/Dashboard.jsx`**: A complex UI view combining multiple metric cards, sector allocation bars, and the newly integrated Trade Insight Modals.
* **`pages/Auth.jsx`**: Handles enterprise-grade UI security features like regex document validation (Aadhaar, SSN) and live password strength meters.
