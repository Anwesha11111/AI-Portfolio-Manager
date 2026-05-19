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

// Discover all available symbols
app.get('/api/market', (req, res) => {
  if (!fs.existsSync(DATA_DIR)) {
    return res.json({ assets: [] });
  }
  
  const files = fs.readdirSync(DATA_DIR);
  const symbols = files.map(f => f.split('.')[0]);
  res.json({ assets: symbols });
});

// Batch Endpoint (already exists here)
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
    const files = fs.readdirSync(DATA_DIR);
    const validFiles = files.filter(f => f.endsWith('.json') && f !== 'NIFTY_50_STOCKS.json');
    
    const batchData = validFiles.map(file => {
      const symbol = file.split('.')[0];
      const filePath = path.join(DATA_DIR, file);
      const rawData = fs.readFileSync(filePath, 'utf8');
      const fullData = JSON.parse(rawData);

      const visibleData = fullData.filter(candle => candle.rawTimestamp <= simDateTimestamp);
      const currentPrice = visibleData.length > 0 ? visibleData[visibleData.length - 1].close : 0;
      
      const pastTimestamp = simDateTimestamp - timeframeMs;
      let pastPrice = 0;
      for (let i = visibleData.length - 1; i >= 0; i--) {
        if (visibleData[i].rawTimestamp <= pastTimestamp) {
          pastPrice = visibleData[i].close;
          break;
        }
      }
      const changePct = pastPrice > 0 ? ((currentPrice - pastPrice) / pastPrice) * 100 : 0;

      return {
        symbol,
        price: currentPrice,
        change: changePct
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
  const { date, timeHorizon, drawdownTolerance, primaryObjective, investmentAmount } = req.body;
  const simDateTimestamp = parseInt(date);
  const capital = parseFloat(investmentAmount) || 100000;

  if (!simDateTimestamp) {
    return res.status(400).json({ error: 'Missing simulation date' });
  }

  try {
    // 1. Gather algorithmic logic
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json') && f !== 'NIFTY_50_STOCKS.json');
    const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;
    const sixMonthsAgo = simDateTimestamp - SIX_MONTHS_MS;

    let marketAnalysis = [];

    for (const file of files) {
      const symbol = file.split('.')[0];
      const rawData = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
      const fullData = JSON.parse(rawData);
      
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
      return res.json([
        {
          symbol: topPick.symbol,
          allocation: capital,
          reasoning: `(Fallback Mode: No Gemini Key provided) Based purely on algorithmic momentum and volatility over the last 6 months, ${topPick.symbol} shows the strongest risk-adjusted returns (Score: ${topPick.algorithmicScore.toFixed(2)}).`
        }
      ]);
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const prompt = `
      Act as a world-class financial advisor in the year ${new Date(simDateTimestamp).getFullYear()}. 
      I am an investor with a ${timeHorizon} time horizon, a ${drawdownTolerance} drawdown tolerance, and my primary objective is ${primaryObjective}.
      I have ₹${capital.toLocaleString()} ready to deploy.
      
      Here is the algorithmic momentum and volatility data for the top 15 Indian stocks over the past 6 months:
      ${JSON.stringify(topCandidates, null, 2)}
      
      Based on my profile constraints and this data, build a portfolio of 1 to 3 stocks from the list provided. Distribute the ₹${capital} among them appropriately (allocations must sum EXACTLY to ${capital}).
      
      Respond ONLY with a JSON array in this exact format, with no markdown formatting and no backticks:
      [
        {
          "symbol": "TATA MOTORS",
          "allocation": 50000,
          "reasoning": "A 2-3 sentence explanation."
        },
        {
          "symbol": "HDFC BANK",
          "allocation": 50000,
          "reasoning": "A 2-3 sentence explanation."
        }
      ]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let aiResultText = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const aiPick = JSON.parse(aiResultText);
    
    res.json(aiPick);

  } catch (error) {
    console.error('AI Recommend Error:', error);
    res.status(500).json({ error: 'Failed to generate recommendation' });
  }
});

// AI Portfolio Analysis Endpoint
app.post('/api/ai/analyze', async (req, res) => {
  const { holdings, balance, profile } = req.body;

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    if (!apiKey) {
      return res.json({ analysis: "(Fallback Mode) Because there is no Gemini API key configured, I cannot perform a deep analysis. However, ensure you maintain diversification across sectors." });
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const prompt = `
      Act as a world-class financial advisor. Here is my current portfolio:
      Cash Balance: ₹${balance}
      Active Holdings: ${JSON.stringify(holdings)}
      My Profile Constraints: Time Horizon: ${profile.time_horizon}, Drawdown Tolerance: ${profile.drawdown_tolerance}, Objective: ${profile.primary_objective}.
      
      Provide a 1-paragraph summary evaluating my diversification, market exposure, and whether my portfolio aligns with my risk tolerance and objective. Do not use markdown or bullet points. Just one cohesive paragraph of text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ analysis: response.text().trim() });
  } catch (error) {
    console.error('AI Analyze Error:', error);
    res.status(500).json({ error: 'Failed to generate analysis' });
  }
});

// Time Machine Endpoint
// Returns data for a symbol STRICTLY UP TO the requested simulation timestamp
app.get('/api/market/:symbol', (req, res) => {
  const { symbol } = req.params;
  const simDateTimestamp = parseInt(req.query.date);

  if (!simDateTimestamp) {
    return res.status(400).json({ error: 'Missing simulation date timestamp (?date=xxx)' });
  }

  const filePath = path.join(DATA_DIR, `${symbol.toUpperCase()}.json`);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `Data for symbol ${symbol} not found.` });
  }

  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const fullData = JSON.parse(rawData);

    // Filter data to only include dates <= the simulation date (NO PEEKING AT THE FUTURE!)
    const visibleData = fullData.filter(candle => candle.rawTimestamp <= simDateTimestamp);

    // Get current asset stats
    const currentPrice = visibleData.length > 0 ? visibleData[visibleData.length - 1].close : 0;
    
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

app.listen(PORT, () => {
  console.log(`PortfolioSim Backend is running on port ${PORT}`);
  console.log(`Time Machine API ready. No futures allowed.`);
});
