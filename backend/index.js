import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true
}));
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

    const prompt = `CRITICAL INSTRUCTION: You are an AI investment learning assistant inside a simulation platform for beginner investors. You must NEVER give definitive buy or sell instructions. Always frame your output as educational guidance with probability-weighted language. Use phrases like: "historically, stocks in this sector have tended to...", "based on the current P/E relative to sector average, the market appears to be pricing in...", "one interpretation of this pattern is...", "a conservative investor might consider...", "this is not financial advice — always assess your own risk tolerance". Always mention at least one counter-argument or downside risk for any suggestion. End every response with a Confidence Level indicator: Low / Moderate / High, and explain what would need to change to increase confidence.

You are a world-class financial advisor operating in the simulated year ${new Date(simDateTimestamp).getFullYear()} in the Indian stock market (Nifty 50).

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

app.get('/api/ai/agents-analysis', (req, res) => {
  const simDateTimestamp = parseInt(req.query.date) || Date.now();
  const symbols = Object.keys(stockDataCache);

  if (symbols.length === 0) {
    return res.status(500).json({ error: 'Agent analysis unavailable: no market data loaded.' });
  }

  try {
    const visibleStats = symbols.map(symbol => {
      const fullData = stockDataCache[symbol] || [];
      const visibleData = fullData.filter(c => c.rawTimestamp <= simDateTimestamp);
      const currentPrice = visibleData.length ? visibleData[visibleData.length - 1].close : 0;
      const recentData = visibleData.slice(-30);
      const returns = recentData.length > 1 ? (currentPrice - recentData[0].close) / recentData[0].close : 0;

      return {
        symbol,
        currentPrice,
        recentReturn: returns * 100,
        volatility: recentData.length > 1 ? Math.sqrt(recentData.reduce((acc, candle, idx) => {
          if (idx === 0) return acc;
          const prev = recentData[idx - 1].close;
          const daily = (candle.close - prev) / prev;
          return acc + Math.pow(daily, 2);
        }, 0) / (recentData.length - 1)) * Math.sqrt(252) : 0
      };
    });

    const trendSignal = visibleStats.reduce((acc, item) => acc + Math.sign(item.recentReturn), 0);
    const sentimentNote = trendSignal > 0 ? 'Most tracked stocks show cautious bullish momentum.' : 'Markets are mixed and require selective positioning.';

    const agents = [
      {
        name: 'Risk AI',
        risk: 'Moderate risk profile detected based on volatility and position drift.',
        analysis: 'Current holdings should be balanced with lower volatility stocks to limit simulated drawdown.',
        sentiment: sentimentNote,
        strategy: 'Scale risk exposure carefully and keep a cash buffer for downside protection.'
      },
      {
        name: 'Analysis AI',
        risk: 'Stable sectors look preferable; avoid concentration in the highest volatility names.',
        analysis: 'Fundamental strength remains strongest in defensive and high-quality blue chip stocks.',
        sentiment: 'The market is sentiment-neutral with an upward tilt for conservative positions.',
        strategy: 'Favor quality names with steady cash flow and gradually reduce exposure to speculative swings.'
      },
      {
        name: 'Sentiment AI',
        risk: 'Short-term sentiment is cautious; momentum is uneven across the universe.',
        analysis: 'News catalysts are mixed, so downside protection should be prioritized before adding new positions.',
        sentiment: sentimentNote,
        strategy: 'Use pullbacks to add core positions rather than chasing extended rallies.'
      }
    ];

    res.json({ agents, generated_at: new Date(simDateTimestamp).toISOString() });
  } catch (error) {
    console.error('Agents analysis endpoint error:', error);
    res.status(500).json({ error: 'Unable to generate agent analysis.' });
  }
});

// Multi-Agent AI Recommendation Endpoint (Groq)
app.post('/api/ai/multiagent', async (req, res) => {
  const { symbol, date } = req.body;
  const simDateTimestamp = parseInt(date);

  if (!symbol || !simDateTimestamp) {
    return res.status(400).json({ error: 'Missing symbol or date' });
  }

  try {
    const fullData = stockDataCache[symbol.toUpperCase()];
    if (!fullData) {
      return res.status(404).json({ error: `Asset data for ${symbol} not found.` });
    }

    const visibleData = fullData.filter(c => c.rawTimestamp <= simDateTimestamp);
    if (visibleData.length === 0) {
      return res.status(400).json({ error: 'No historical data available up to simulated date.' });
    }

    const lastCandle = visibleData[visibleData.length - 1];
    const currentPrice = lastCandle.close;
    const rsi = lastCandle.rsi14 || 50;
    const sma50 = lastCandle.sma50 || 0;
    const sma200 = lastCandle.sma200 || 0;

    // Calculate volatility for prompting/fallback
    const windowData = visibleData.slice(-60);
    let volatility = 0.2;
    if (windowData.length >= 10) {
      let sumReturns = 0;
      let returns = [];
      for (let i = 1; i < windowData.length; i++) {
        const dailyRet = (windowData[i].close - windowData[i-1].close) / windowData[i-1].close;
        returns.push(dailyRet);
        sumReturns += dailyRet;
      }
      const meanReturn = sumReturns / returns.length;
      const variance = returns.reduce((acc, val) => acc + Math.pow(val - meanReturn, 2), 0) / returns.length;
      volatility = Math.sqrt(variance) * Math.sqrt(252);
    }
    const volatilityPct = volatility * 100;

    // 2-Month Change
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

    // Run Algorithmic Ratings for fallback and prompting context
    const volatilityScore = Math.min(100, Math.max(10, Math.round(volatilityPct * 1.8)));
    let riskRating = 'Medium';
    if (volatilityScore < 35) riskRating = 'Low';
    else if (volatilityScore > 65) riskRating = 'High';

    let sentimentScore = 50;
    if (sma50 && currentPrice > sma50) sentimentScore += 10;
    if (sma50 && currentPrice < sma50) sentimentScore -= 10;
    if (sma200 && currentPrice > sma200) sentimentScore += 10;
    if (sma200 && currentPrice < sma200) sentimentScore -= 10;
    if (rsi > 55) sentimentScore += Math.round((rsi - 55) * 1.2);
    if (rsi < 45) sentimentScore -= Math.round((45 - rsi) * 1.2);
    sentimentScore = Math.min(100, Math.max(0, sentimentScore));
    let sentimentRating = 'Neutral';
    if (sentimentScore >= 60) sentimentRating = 'Bullish';
    else if (sentimentScore <= 40) sentimentRating = 'Bearish';

    let action = 'HOLD';
    if (sentimentRating === 'Bullish' && riskRating !== 'High') action = 'BUY';
    else if (sentimentRating === 'Bearish') action = 'SELL';

    const groqKey = process.env.GROQ_API_KEY;

    if (groqKey) {
      const prompt = `You are a multi-agent investment advisory system analyzing the stock ${symbol} in the simulated year ${new Date(simDateTimestamp).getFullYear()} in the Indian stock market (Nifty 50).

Your team consists of three AI Agents:
1. **Risk Scoring Agent (RiskAgent)**: Evaluates the asset's risk parameters (volatility, drawdown, beta, historical stability).
2. **Sentiment Analysis Agent (SentimentAgent)**: Analyzes market sentiment, technical indicators (RSI, SMA50, SMA200), and short-term price momentum.
3. **Strategy Developer Agent (StrategyAgent)**: Synthesizes reports from the Risk and Sentiment agents to formulate a specific, actionable investment strategy (action: BUY/SELL/HOLD, entry/exit tactics).

STOCK METRICS TO ANALYZE (computed up to simulated timestamp ${simDateTimestamp}):
- Symbol: ${symbol}
- Current Price: ₹${currentPrice.toFixed(2)}
- 2-Month Performance: ${changePct.toFixed(2)}%
- Annualized Volatility: ${volatilityPct.toFixed(2)}%
- RSI (14): ${rsi.toFixed(1)}
- SMA (50): ₹${sma50.toFixed(2)}
- SMA (200): ₹${sma200.toFixed(2)}

YOUR TASK:
Run a simulated sequential meeting between the three agents. First, RiskAgent evaluates risk. Second, SentimentAgent evaluates trend and momentum. Third, StrategyAgent facilitates a brief debate and outputs the final recommendation.

Respond ONLY with a valid JSON object (no markdown, no backticks, no wrap text):
{
  "symbol": "${symbol}",
  "date": ${simDateTimestamp},
  "risk": {
    "score": ${volatilityScore},
    "rating": "${riskRating}",
    "rationale": "2 sentence risk assessment from RiskAgent."
  },
  "sentiment": {
    "score": ${sentimentScore},
    "rating": "${sentimentRating}",
    "rationale": "2 sentence trend/momentum analysis from SentimentAgent."
  },
  "strategy": {
    "action": "${action}",
    "targetPrice": ${Math.round(currentPrice * 1.15)},
    "stopLoss": ${Math.round(currentPrice * 0.92)},
    "rationale": "2 sentence strategic execution advice from StrategyAgent."
  },
  "conversation": [
    {
      "agent": "RiskAgent",
      "message": "Dialogue starting the discussion about ${symbol}'s risk metrics."
    },
    {
      "agent": "SentimentAgent",
      "message": "Dialogue contributing the market trend and technical momentum analysis."
    },
    {
      "agent": "StrategyAgent",
      "message": "Dialogue concluding with the final investment thesis and strategic execution plan."
    }
  ]
}
`;

      try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqKey}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: 'You are a financial analyst system returning JSON.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.2
          })
        });

        if (response.ok) {
          const resData = await response.json();
          const content = resData.choices[0].message.content;
          const parsed = JSON.parse(content.replace(/```json/g, '').replace(/```/g, '').trim());
          parsed.risk.score = Number(parsed.risk.score) || 0;
          parsed.sentiment.score = Number(parsed.sentiment.score) || 0;
          return res.json(parsed);
        } else {
          console.warn('Groq API returned non-OK status:', response.status, '— using algorithmic fallback.');
        }
      } catch (groqErr) {
        console.warn('Groq API call failed:', groqErr.message, '— using algorithmic fallback.');
      }
    }

    // Fallback: Groq unconfigured, key invalid, or API error — use algorithmic engine
    const simulatedDateStr = new Date(simDateTimestamp).toLocaleDateString('en-GB');
    const targetPrice = action === 'BUY' ? Math.round(currentPrice * 1.15) : action === 'SELL' ? Math.round(currentPrice * 0.85) : Math.round(currentPrice);
    const stopLoss = action === 'BUY' ? Math.round(currentPrice * 0.95) : action === 'SELL' ? Math.round(currentPrice * 1.05) : Math.round(currentPrice * 0.9);

    const fallbackResponse = {
      symbol: symbol.toUpperCase(),
      date: simDateTimestamp,
      currentPrice,
      risk: {
        score: volatilityScore,
        rating: riskRating,
        rationale: `RiskAgent evaluated ${symbol} up to ${simulatedDateStr}. Annualized volatility is measured at ${volatilityPct.toFixed(2)}%, placing it in the ${riskRating} risk category. Maximum recent drawdown suggests standard market exposure.`
      },
      sentiment: {
        score: sentimentScore,
        rating: sentimentRating,
        rationale: `SentimentAgent reports a ${sentimentRating} posture. RSI(14) is currently ${rsi.toFixed(1)}, and the price is trading ${currentPrice >= (sma50 || 0) ? 'above' : 'below'} the 50-day SMA. Momentum indicators suggest ${sentimentRating === 'Bullish' ? 'steady accumulation' : sentimentRating === 'Bearish' ? 'distributive selling' : 'sideways trend consolidation'}.`
      },
      strategy: {
        action,
        targetPrice,
        stopLoss,
        rationale: `StrategyAgent has compiled the assessments. Given the ${sentimentRating} sentiment and ${riskRating} risk profile, our tactical recommendation is to ${action}. We establish a target at ₹${targetPrice} and stop-loss at ₹${stopLoss}.`
      },
      conversation: [
        {
          agent: 'RiskAgent',
          message: `Greetings team. For ${symbol} on ${simulatedDateStr}, my calculations show annualized volatility is at ${volatilityPct.toFixed(2)}%. This qualifies the stock for a ${riskRating} Risk rating. We should keep an eye on market exposure.`
        },
        {
          agent: 'SentimentAgent',
          message: `Understood, RiskAgent. Looking at the charts, RSI stands at ${rsi.toFixed(1)} and price is ${currentPrice >= (sma50 || 0) ? 'above' : 'below'} the 50-day SMA (₹${(sma50 || 0).toFixed(2)}). This signals a ${sentimentRating} market sentiment. The volume support looks ${sentimentRating === 'Bullish' ? 'supportive of an upward push' : 'weak, suggesting further drop'}.`
        },
        {
          agent: 'StrategyAgent',
          message: `Excellent work, team. Synthesizing these reports: we have ${sentimentRating} sentiment and ${riskRating} risk. For our asset allocation, I formulate a ${action} strategy. Let's set the target price at ₹${targetPrice} and position a stop-loss at ₹${stopLoss} to manage drawdowns.`
        }
      ]
    };

    res.json(fallbackResponse);

  } catch (error) {
    console.error('Multi-Agent API Error:', error);
    res.status(500).json({ error: 'Internal server error in multi-agent endpoint.' });
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

    const prompt = `CRITICAL INSTRUCTION: You are an AI investment learning assistant inside a simulation platform for beginner investors. You must NEVER give definitive buy or sell instructions. Always frame your output as educational guidance with probability-weighted language. Use phrases like: "historically, stocks in this sector have tended to...", "based on the current P/E relative to sector average, the market appears to be pricing in...", "one interpretation of this pattern is...", "a conservative investor might consider...", "this is not financial advice — always assess your own risk tolerance". Always mention at least one counter-argument or downside risk for any suggestion. End every response with a Confidence Level indicator: Low / Moderate / High, and explain what would need to change to increase confidence.

You are a world-class financial advisor performing a portfolio health check.

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
    
    let score;
    let strengths;
    let weaknesses;
    let suggestion;
    
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
