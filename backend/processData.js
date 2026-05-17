const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const TRADE_DATA_DIR = path.join(__dirname, '..', 'Trade_Data');
const OUTPUT_DIR = path.join(__dirname, 'data');

// Ensure output dir exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

// Technical Indicator Helpers
function calculateSMA(data, period, index) {
  if (index < period - 1) return null;
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[index - i].close;
  }
  return sum / period;
}

function calculateRSI(data, period, index) {
  if (index < period) return null;
  let gains = 0;
  let losses = 0;

  // Simple RSI calculation for hackathon speed (not smoothed EMA RSI)
  for (let i = 0; i < period; i++) {
    const current = data[index - i].close;
    const prev = data[index - i - 1].close;
    const diff = current - prev;
    if (diff > 0) gains += diff;
    else losses -= diff; // make positive
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

function parseDate(dateStr) {
  // DD-MM-YYYY to timestamp
  const [day, month, year] = dateStr.split('-');
  return new Date(`${year}-${month}-${day}`).getTime();
}

async function processCSV(filePath, fileName) {
  const symbol = fileName.split('.')[0].toUpperCase();
  const rawData = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Some rows might be empty or malformed
        if (!row.Date || !row.Close) return;

        rawData.push({
          time: parseDate(row.Date) / 1000, // TradingView expects seconds, not ms
          rawTimestamp: parseDate(row.Date), // Keep ms for our time-machine filtering
          open: parseFloat(row.Open),
          high: parseFloat(row.High),
          low: parseFloat(row.Low),
          close: parseFloat(row.Close),
          volume: parseFloat(row.Volume)
        });
      })
      .on('end', () => {
        // Sort by time ascending just in case
        rawData.sort((a, b) => a.time - b.time);

        // Second pass: Calculate Indicators
        const enrichedData = rawData.map((candle, index, arr) => {
          return {
            ...candle,
            sma50: calculateSMA(arr, 50, index),
            sma200: calculateSMA(arr, 200, index),
            rsi14: calculateRSI(arr, 14, index)
          };
        });

        // Write to JSON
        fs.writeFileSync(
          path.join(OUTPUT_DIR, `${symbol}.json`), 
          JSON.stringify(enrichedData)
        );
        console.log(`Processed ${symbol}: ${enrichedData.length} records.`);
        resolve();
      })
      .on('error', reject);
  });
}

async function main() {
  console.log('Starting Data Processing...');
  const files = fs.readdirSync(TRADE_DATA_DIR).filter(f => f.toLowerCase().endsWith('.csv'));
  
  for (const file of files) {
    await processCSV(path.join(TRADE_DATA_DIR, file), file);
  }
  
  console.log('All data processed and saved to /backend/data/');
}

main();
