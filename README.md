# AI-Powered Stock Portfolio Manager

An advanced, gamified financial technology platform designed to educate retail investors and simulate stock market portfolio management. Built with cutting-edge web technologies and a heavy focus on premium, dynamic UI design.

## 🚀 Core Features & Novelty

### ⏳ The "Time Machine" Historical Engine
Instead of just trading on current market data, our platform features a global "Time Machine." Users can travel back in time to specific months in the past. The entire application (charts, prices, dashboard valuations) instantly shifts to reflect the historical reality of that exact date, allowing users to safely experience and trade through historical market crashes and bull runs.

### 🧠 AI Portfolio Architect
A powerful AI engine that acts as your personal financial advisor. 
- It cross-references the user's **financial profile** (income, expenses, risk appetite) with the **current macroeconomic conditions** of the simulated date.
- It automatically calculates a safe monthly investable amount and generates a diversified portfolio allocation plan that users can execute with a single click.

### 📊 Trade Post-Mortems & Insights
We don't just show you your Profit & Loss. Clicking on any holding in the dashboard opens a deeply analytical "Trade Post-Mortem." Our deterministic frontend engine analyzes the trade's duration and profitability to generate:
- **Profile Suitability Match (%)**
- **Inherent Asset Risk Scores**
- **Actionable Learning Insights & Strategy Tweaks** (e.g., "Consider setting a trailing stop-loss to secure profits.")

### 🎓 The Academy (Gamified Education)
A built-in educational hub that breaks down complex financial jargon into digestible, interactive modules. Users progress through lessons like *How the Indian Stock Market Works* and *Understanding Market Ups & Downs* to build fundamental knowledge before risking capital.

### 🎨 Premium Custom Theming
Bypassing heavy UI frameworks, we built a lightning-fast custom CSS variable engine supporting instant toggling between premium themes:
- **Wall Street Classic**
- **OLED Pitch Black**
- **Neon Cyberpunk**
- **Nordic Frost**
- **Sunset Crimson**

## 🛠️ Technology Stack
- **Frontend**: React.js, Vite, CSS Modules (for scoped styling)
- **State Management**: Zustand (`useAuthStore`, `useSimulationStore`, `useThemeStore`)
- **Database & Auth**: Supabase (PostgreSQL, Triggers, JWT Auth)
- **Data Visualization**: Recharts (for dynamic historical OHLCV charts)
- **Icons**: Lucide React

## 📂 Documentation Links
For a deeper dive into the platform's architecture, check out these files in the root directory:
- [Platform Workflow](./PLATFORM_WORKFLOW.md)
- [Tech Stack](./TECH_STACK.md)
- [File Structure](./FILE_STRUCTURE.md)

## 💻 Running Locally

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd AI-Portfolio-Manager
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up Environment Variables**
   Create a \`.env\` file in the root directory and add your Supabase keys:
   \`\`\`env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=your_backend_api_url (Optional for external AI)
   \`\`\`

4. **Start the Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open in Browser**
   Navigate to \`http://localhost:5173\`

## 🔒 Security Features
- **Dynamic Document Verification**: Registration includes real-time regex validation for international documents (e.g., 12-digit Indian Aadhaar, 9-digit US SSN).
- **Password Strength Meter**: Real-time feedback requiring uppercase, lowercase, numbers, and special characters.
- **Supabase RLS**: Row Level Security ensures users can only read and write their own transactional data and financial profiles.
