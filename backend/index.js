const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
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

// Batch Endpoint
// Returns summary data for all symbols strictly up to the simulation timestamp
app.get('/api/market/batch', (req, res) => {
  const simDateTimestamp = parseInt(req.query.date);

  if (!simDateTimestamp) {
    return res.status(400).json({ error: 'Missing simulation date timestamp (?date=xxx)' });
  }

  if (!fs.existsSync(DATA_DIR)) {
    return res.json([]);
  }

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
