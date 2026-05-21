const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');

// In-Memory Cache for all historical stock data
let stockDataCache = {};

function initializeCache() {
  if (!fs.existsSync(DATA_DIR)) return;
  const files = fs.readdirSync(DATA_DIR);
  for (const file of files) {
    if (file.endsWith('.json') && file !== 'NIFTY_50_STOCKS.json') {
      const symbol = file.split('.')[0];
      try {
        const rawData = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
        stockDataCache[symbol] = JSON.parse(rawData);
      } catch (err) {
        console.error(`Failed to load ${file} into cache:`, err);
      }
    }
  }
  console.log(`Cache initialized with ${Object.keys(stockDataCache).length} assets.`);
}

// Discover all available symbols
app.get('/api/market', (req, res) => {
  res.json({ assets: Object.keys(stockDataCache) });
});

// Batch Endpoint (already exists here)
// Batch Endpoint (with RSI algorithmic engine)
app.get('/api/market/batch', (req, res) => {
  const simDateTimestamp = parseInt(req.query.date);
  const timeframe = req.query.timeframe || '2M';

  if (!simDateTimestamp) {
    return res.status(400).json({ error: 'Missing simulation date timestamp (?date=xxx)' });
  }

  if (!fs.existsSync(DATA_DIR)) {
    return res.json([]);
  }

  const tfMap = {
    '1W': 7 * 24 * 60 * 60 * 1000,
    '1M': 30 * 24 * 60 * 60 * 1000,
    '2M': 60 * 24 * 60 * 60 * 1000,
    '3M': 90 * 24 * 60 * 60 * 1000,
    '6M': 180 * 24 * 60 * 60 * 1000,
    '1Y': 365 * 24 * 60 * 60 * 1000,
  };
  const timeframeMs = tfMap[timeframe] || tfMap['2M'];

  try {
    const validSymbols = Object.keys(stockDataCache);
    
    const batchData = validSymbols.map(symbol => {
      const fullData = stockDataCache[symbol];

      // Filter data up to the simulated date
      const visibleData = fullData.filter(candle => candle.rawTimestamp <= simDateTimestamp);
      const currentPrice = visibleData.length > 0 ? visibleData[visibleData.length - 1].close : 0;
      
      // Calculate % Change based on timeframe
      const pastTimestamp = simDateTimestamp - timeframeMs;
      let pastPrice = 0;
      for (let i = visibleData.length - 1; i >= 0; i--) {
        if (visibleData[i].rawTimestamp <= pastTimestamp) {
          pastPrice = visibleData[i].close;
          break;
        }
      }
      const changePct = pastPrice > 0 ? ((currentPrice - pastPrice) / pastPrice) * 100 : 0;

      // ==========================================
      // NEW: 14-Day RSI Algorithmic Calculation
      // ==========================================
      let rsi = null;
      let rsiSignal = 'HOLD';

      // We need at least 15 days of data to calculate a 14-day RSI (1 day for initial difference)
      if (visibleData.length >= 15) {
        const recentData = visibleData.slice(-15);
        let gains = 0;
        let losses = 0;

        // Calculate differences
        for (let i = 1; i < recentData.length; i++) {
          const difference = recentData[i].close - recentData[i - 1].close;
          if (difference > 0) {
            gains += difference;
          } else {
            losses -= difference; // Convert to positive number
          }
        }

        const avgGain = gains / 14;
        const avgLoss = losses / 14;

        if (avgLoss === 0) {
          rsi = 100;
        } else {
          const rs = avgGain / avgLoss;
          rsi = 100 - (100 / (1 + rs));
        }

        // Generate algorithmic signal based on standard thresholds
        if (rsi < 30) rsiSignal = 'BUY';
        else if (rsi > 70) rsiSignal = 'SELL';
      }
      // ==========================================

      return {
        symbol,
        price: currentPrice,
        change: changePct,
        rsi: rsi,
        rsiSignal: rsiSignal
      };
    });

    res.json(batchData);
  } catch (error) {
    console.error('Error processing batch data:', error);
    res.status(500).json({ error: 'Internal server error processing batch data.' });
  }
});
// AI Recommendation Endpoint
app.post('/api/ai/recommend', async (req, res) => {
  const { date, timeHorizon, drawdownTolerance, primaryObjective, profile } = req.body;
  const simDateTimestamp = parseInt(date);

  const monthlyIncome = profile?.monthly_income || 0;
  const monthlyExpenses = profile?.monthly_expenses || 0;
  const availableCash = profile?.virtual_balance || 0;
  const totalSavings = profile?.total_savings || 0;

  if (!simDateTimestamp) {
    return res.status(400).json({ error: 'Missing simulation date' });
  }

  try {
    // 1. Gather algorithmic logic
    const symbols = Object.keys(stockDataCache);
    const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;
    const sixMonthsAgo = simDateTimestamp - SIX_MONTHS_MS;

    let marketAnalysis = [];

    for (const symbol of symbols) {
      const fullData = stockDataCache[symbol];
      
      const visibleData = fullData.filter(c => c.rawTimestamp <= simDateTimestamp && c.rawTimestamp >= sixMonthsAgo);
      if (visibleData.length < 30) continue;

      const currentPrice = visibleData[visibleData.length - 1].close;
      const pastPrice = visibleData[0].close;
      const returnPct = ((currentPrice - pastPrice) / pastPrice) * 100;

      let sumReturns = 0;
      let returns = [];
      for (let i = 1; i < visibleData.length; i++) {
        const dailyRet = (visibleData[i].close - visibleData[i-1].close) / visibleData[i-1].close;
        returns.push(dailyRet);
        sumReturns += dailyRet;
      }
      const meanReturn = sumReturns / returns.length;
      const variance = returns.reduce((acc, val) => acc + Math.pow(val - meanReturn, 2), 0) / returns.length;
      const volatility = Math.sqrt(variance) * Math.sqrt(252);

      marketAnalysis.push({
        symbol,
        currentPrice,
        sixMonthReturn: returnPct,
        annualizedVolatility: volatility * 100,
        algorithmicScore: returnPct / (volatility || 1)
      });
    }

    marketAnalysis.sort((a, b) => b.algorithmicScore - a.algorithmicScore);
    const topCandidates = marketAnalysis.slice(0, 15);

    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;

    // 2. Feed into Gemini
    if (!apiKey) {
      const topPick = topCandidates[0];
      const fallbackAmount = Math.min(availableCash * 0.5, 100000);
      return res.json({
        investable_amount: fallbackAmount,
        reasoning_for_amount: 'Fallback: investing 50% of available cash.',
        recommendations: [{
          symbol: topPick.symbol,
          allocation: fallbackAmount,
          reasoning: `(Fallback Mode) Based on algorithmic momentum, ${topPick.symbol} shows strong risk-adjusted returns.`
        }]
      });
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    // Build behavioral context based on user profile
    const riskGuidance = {
      low: 'The investor is RISK-AVERSE. You MUST spread the capital across 3 stocks from DIFFERENT sectors to maximize diversification. Avoid any stock with annualized volatility above 35%. Prefer stable blue-chip companies with consistent returns over high-growth speculative plays.',
      medium: 'The investor has MODERATE risk tolerance. Spread the capital across 2-3 stocks. You may include one moderately volatile growth stock, but anchor the portfolio with at least one low-volatility blue-chip. Aim for a balanced risk-reward ratio.',
      high: 'The investor is AGGRESSIVE and comfortable with high drawdowns. You may concentrate into 1-2 high-momentum stocks if their algorithmic scores justify it. Volatility is acceptable if the upside potential is strong.'
    };

    const horizonGuidance = {
      short: 'The investor has a SHORT time horizon (under 1 year). Prioritize stocks with strong recent momentum (high 6-month returns) and lower volatility. Avoid turnaround plays or stocks that need time to recover.',
      medium: 'The investor has a MEDIUM time horizon (1-3 years). Balance between momentum and fundamental stability. Some cyclical exposure is acceptable.',
      long: 'The investor has a LONG time horizon (5+ years). You can include companies with strong long-term growth potential even if short-term volatility is higher. Compounding potential matters more than recent momentum.'
    };

    const objectiveGuidance = {
      growth: 'The investor seeks CAPITAL GROWTH. Prioritize stocks with high momentum scores and strong return percentages. Dividend yield is not a priority.',
      income: 'The investor seeks INCOME/STABILITY. Prioritize established companies known for dividend payments and stable price action. Avoid highly cyclical or speculative stocks.',
      preservation: 'The investor seeks CAPITAL PRESERVATION. This is the most conservative objective. ONLY recommend the lowest-volatility stocks with positive returns. Spread widely across 3 stocks to minimize any single-stock risk.'
    };

    const prompt = `You are a world-class financial advisor operating in the simulated year ${new Date(simDateTimestamp).getFullYear()} in the Indian stock market (Nifty 50).

INVESTOR FINANCIAL PROFILE:
- Monthly Income: ${monthlyIncome}
- Monthly Expenses: ${monthlyExpenses}
- Monthly Surplus: ${Math.max(0, monthlyIncome - monthlyExpenses)}
- Total Savings: ${totalSavings}
- Available Cash Balance: ${availableCash}
- Time Horizon: ${timeHorizon}
- Drawdown Tolerance: ${drawdownTolerance}
- Primary Objective: ${primaryObjective}

YOUR FIRST TASK: Determine how much of the Available Cash Balance (${availableCash}) to invest this month.
Rules:
- You are NOT limited to investing just the Monthly Surplus (${Math.max(0, monthlyIncome - monthlyExpenses)}). 
- If market conditions are highly favorable (e.g., strong algorithmic scores, recovery phase), you may invest a larger chunk of the total Available Cash.
- If market conditions are poor or volatile, you may choose to invest only the Monthly Surplus, or even less (to keep cash in reserve).
- Maximum limits based on risk profile:
  * Conservative/preservation: invest up to 30% of available cash
  * Moderate: invest up to 60% of available cash
  * Aggressive/growth: invest up to 90% of available cash
- NEVER invest more than the Available Cash Balance (${availableCash}).
- NEVER invest 100% — always leave an emergency cash buffer.
- If Available Cash < 5000, set investable_amount to 0.

BEHAVIORAL RULES:
${riskGuidance[drawdownTolerance] || riskGuidance.medium}
${horizonGuidance[timeHorizon] || horizonGuidance.long}
${objectiveGuidance[primaryObjective] || objectiveGuidance.growth}

MARKET DATA (Top 15 stocks by risk-adjusted score):
${JSON.stringify(topCandidates, null, 2)}

SECTOR CONTEXT:
Banking/Finance: HDFC_BANK, ICICI_BANK, KOTAK_MAHINDRA, AXIS_BANK, SBI_BANK, BAJAJ_FINANCE, BAJAJ_FINSERV, HDFC_LIFE, SBI_LIFE, INDUS INDUSTRIES
IT: INFOSYS, TATA CONSULTANCY SERVICES, WIPRO, TECH_MAHINDRA, HCL_TECHNOLOIES
Auto: TATA MOTORS, MARUTI SUZUKI, BAJAJ AUTO, EICHER MOTOTRS, HERO MOTOCORP
Pharma: CIPLA, DIVIS LAB, APOLLO HOSPITALS, SUN_PHARMA
Consumer: HINDUSTAN UNILEVER, ITC, ASIAN PAINTS, TITAN, NESTLE, BRITANNIA, TATA CONSUMER PRODUCTS
Energy/Industrial: RELIANCE, NTPC, POWERGRID, ONGC, ADANI_PORTS, ADANI_ENTERPRISES, COAL INDIA, ULTRATECH CEMENT, JSW STEEL, TATA STEEL, GRASIM, HINDALCO

Do NOT pick two stocks from the same sector if drawdown tolerance is low.

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "investable_amount": 50000,
  "reasoning_for_amount": "1 sentence.",
  "recommendations": [{"symbol": "STOCK_NAME", "allocation": 25000, "reasoning": "1-2 sentences."}]
}

Allocations MUST sum EXACTLY to investable_amount. Keep reasoning short.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let aiResultText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const aiPick = JSON.parse(aiResultText);
    
    res.json(aiPick);

  } catch (error) {
    console.error('AI Recommend Error:', error);
    res.status(200).json({
      investable_amount: 0,
      reasoning_for_amount: "AI API is currently rate limited or unavailable. Please try again later.",
      recommendations: []
    });
  }
});

// AI Portfolio Analysis Endpoint
app.post('/api/ai/analyze', async (req, res) => {
  const { holdings, balance, profile } = req.body;

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    if (!apiKey) {
      return res.json({ 
        score: 50,
        strengths: ["Cash position provides safety buffer"],
        weaknesses: ["No AI key configured for deep analysis"],
        suggestion: "Configure your Gemini API key for personalized portfolio analysis."
      });
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    const holdingsSummary = holdings.length > 0 
      ? holdings.map(h => `${h.symbol}: ${h.quantity} shares @ avg cost ${h.average_buy_price}`).join(', ')
      : 'No stocks held, 100% cash position.';

    const prompt = `You are a world-class financial advisor performing a portfolio health check.

INVESTOR PROFILE:
- Time Horizon: ${profile.time_horizon || 'long'} (${profile.time_horizon === 'short' ? 'under 1 year' : profile.time_horizon === 'medium' ? '1-3 years' : '5+ years'})
- Drawdown Tolerance: ${profile.drawdown_tolerance || 'medium'} (${profile.drawdown_tolerance === 'low' ? 'risk-averse, wants stability' : profile.drawdown_tolerance === 'high' ? 'aggressive, comfortable with losses' : 'balanced approach'})
- Primary Objective: ${profile.primary_objective || 'growth'} (${profile.primary_objective === 'income' ? 'wants steady dividend income' : profile.primary_objective === 'preservation' ? 'wants to protect capital above all' : 'wants maximum capital appreciation'})

FINANCIAL SITUATION:
- Monthly Income: ${profile.monthly_income || 'Unknown'}
- Monthly Expenses: ${profile.monthly_expenses || 'Unknown'}
- Monthly Surplus: ${(profile.monthly_income || 0) - (profile.monthly_expenses || 0)}
- Total Savings: ${profile.total_savings || 'Unknown'}

CURRENT PORTFOLIO STATE:
- Cash Balance: ${balance}
- Holdings: ${holdingsSummary}

SCORING RULES:
- 100% cash with no holdings = score 20-30 (missed opportunity)
- Single stock portfolio = score 30-50 (concentration risk)
- 2-3 stocks same sector = score 40-60 (sector concentration)
- 3+ stocks across different sectors matching risk profile = score 70-90
- Perfect diversification matching all profile constraints = score 85-95

Respond ONLY with a valid JSON object (no markdown, no backticks):
{
  "score": 72,
  "strengths": ["Short bullet point 1", "Short bullet point 2"],
  "weaknesses": ["Short bullet point 1", "Short bullet point 2"],
  "suggestion": "One actionable sentence for improvement."
}

Keep each bullet point under 15 words. Provide 2-3 strengths and 2-3 weaknesses.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let resultText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(resultText);
    res.json(parsed);
  } catch (error) {
    console.error('AI Analyze Error:', error);
    
    // Fallback heuristic if API rate limits or fails
    const hasHoldings = holdings && holdings.length > 0;
    const isDiversified = holdings && holdings.length >= 3;
    
    let score = 50;
    let strengths = [];
    let weaknesses = [];
    let suggestion = "Consider adding more diverse assets.";
    
    if (!hasHoldings) {
      score = 30;
      strengths = ["100% cash position protects against immediate market downturns"];
      weaknesses = ["Zero exposure to equity growth", "Cash loses value to inflation over time"];
      suggestion = "Start deploying capital into high-quality businesses to begin compounding wealth.";
    } else if (!isDiversified) {
      score = 60;
      strengths = ["Active market participation", "Focused portfolio layout"];
      weaknesses = ["High concentration risk", "Volatility could severely impact overall balance"];
      suggestion = "Diversify your holdings across different sectors to reduce risk.";
    } else {
      score = 80;
      strengths = ["Good diversification", "Active market participation"];
      weaknesses = ["Requires ongoing monitoring"];
      suggestion = "Continue to monitor and rebalance as market conditions change.";
    }

    res.status(200).json({ score, strengths, weaknesses, suggestion });
  }
});

// Time Machine Endpoint
// Returns data for a symbol STRICTLY UP TO the requested simulation timestamp
app.get('/api/market/:symbol', (req, res) => {
  const { symbol } = req.params;
  const simDateTimestamp = parseInt(req.query.date);

  if (!simDateTimestamp) {
    return res.status(400).json({ error: 'Missing simulation date timestamp' });
  }

  try {
    const fullData = stockDataCache[symbol.toUpperCase()];
    if (!fullData) {
      return res.status(404).json({ error: 'Asset data not found' });
    }

    const visibleData = fullData.filter(candle => candle.rawTimestamp <= simDateTimestamp);
    
    if (visibleData.length === 0) {
      return res.json({
        symbol: symbol.toUpperCase(),
        currentSimulatedDate: simDateTimestamp,
        currentPrice: 0,
        twoMonthChangePct: 0,
        dataLength: 0,
        history: []
      });
    }

    const currentPrice = visibleData[visibleData.length - 1].close;
    
    // Find price from exactly 2 simulated months ago (approx 60 days = 60 * 24 * 60 * 60 * 1000 = 5,184,000,000 ms)
    const TWO_MONTHS_MS = 5184000000;
    const pastTimestamp = simDateTimestamp - TWO_MONTHS_MS;
    
    let pastPrice = 0;
    for (let i = visibleData.length - 1; i >= 0; i--) {
      if (visibleData[i].rawTimestamp <= pastTimestamp) {
        pastPrice = visibleData[i].close;
        break;
      }
    }

    const changePct = pastPrice > 0 ? ((currentPrice - pastPrice) / pastPrice) * 100 : 0;

    res.json({
      symbol: symbol.toUpperCase(),
      currentSimulatedDate: simDateTimestamp,
      currentPrice,
      twoMonthChangePct: changePct,
      dataLength: visibleData.length,
      history: visibleData // Give the frontend the allowed context for Candlestick rendering
    });

  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Internal server error processing data.' });
  }
});

// Discover all available symbols is moved above.

initializeCache();
app.listen(PORT, () => {
  console.log(`PortfolioSim Backend is running on port ${PORT}`);
  console.log(`Time Machine API ready. No futures allowed.`);
});
