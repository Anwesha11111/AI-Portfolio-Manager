// src/data/stockFundamentals.js
// Pre-seeded stock fundamentals data for simulation
// Each entry is keyed by ticker, then by fiscal year/quarter
// Data is approximate historical values for educational simulation purposes

const SECTOR_PE_AVERAGES = {
  Banking: { 2000: 8, 2001: 7, 2002: 8, 2003: 9, 2004: 12, 2005: 15, 2006: 18, 2007: 22, 2008: 10, 2009: 14, 2010: 18, 2011: 15, 2012: 13, 2013: 12, 2014: 16, 2015: 17, 2016: 18, 2017: 22, 2018: 20, 2019: 18, 2020: 14, 2021: 20, 2022: 18, 2023: 16, 2024: 17 },
  IT: { 2000: 45, 2001: 25, 2002: 20, 2003: 22, 2004: 25, 2005: 28, 2006: 30, 2007: 28, 2008: 14, 2009: 20, 2010: 25, 2011: 22, 2012: 18, 2013: 19, 2014: 22, 2015: 20, 2016: 18, 2017: 20, 2018: 22, 2019: 20, 2020: 25, 2021: 32, 2022: 28, 2023: 24, 2024: 26 },
  Energy: { 2000: 10, 2001: 8, 2002: 9, 2003: 10, 2004: 12, 2005: 14, 2006: 16, 2007: 18, 2008: 8, 2009: 14, 2010: 16, 2011: 13, 2012: 11, 2013: 10, 2014: 12, 2015: 14, 2016: 16, 2017: 18, 2018: 15, 2019: 12, 2020: 10, 2021: 14, 2022: 10, 2023: 12, 2024: 14 },
  Auto: { 2000: 12, 2001: 10, 2002: 11, 2003: 14, 2004: 16, 2005: 18, 2006: 20, 2007: 22, 2008: 10, 2009: 16, 2010: 20, 2011: 18, 2012: 16, 2013: 18, 2014: 22, 2015: 24, 2016: 26, 2017: 28, 2018: 25, 2019: 22, 2020: 18, 2021: 30, 2022: 28, 2023: 26, 2024: 28 },
  Pharma: { 2000: 20, 2001: 18, 2002: 19, 2003: 20, 2004: 22, 2005: 24, 2006: 22, 2007: 25, 2008: 15, 2009: 22, 2010: 25, 2011: 28, 2012: 26, 2013: 24, 2014: 28, 2015: 32, 2016: 28, 2017: 25, 2018: 22, 2019: 24, 2020: 30, 2021: 28, 2022: 24, 2023: 26, 2024: 28 },
  Consumer: { 2000: 25, 2001: 22, 2002: 24, 2003: 26, 2004: 28, 2005: 30, 2006: 32, 2007: 35, 2008: 20, 2009: 28, 2010: 32, 2011: 30, 2012: 32, 2013: 34, 2014: 38, 2015: 42, 2016: 40, 2017: 45, 2018: 48, 2019: 45, 2020: 50, 2021: 55, 2022: 50, 2023: 48, 2024: 50 },
};

const TICKER_SECTOR = {
  'RELIANCE': 'Energy', 'TATA CONSULTANCY SERVICES': 'IT', 'INFOSYS': 'IT',
  'HDFC_BANK': 'Banking', 'ICICI_BANK': 'Banking', 'WIPRO': 'IT',
  'ONGC': 'Energy', 'ITC': 'Consumer', 'BAJAJ AUTO': 'Auto',
  'SBI_BANK': 'Banking', 'KOTAK_MAHINDRA': 'Banking', 'AXIS_BANK': 'Banking',
  'BHARTI_AIRTEL': 'IT', 'SUN_PHARMA': 'Pharma', 'CIPLA': 'Pharma',
  'TATA MOTORS': 'Auto', 'MARUTI SUZUKI': 'Auto', 'TITAN': 'Consumer',
  'HINDUSTAN UNILEVER': 'Consumer', 'ASIAN PAINTS': 'Consumer',
  'NESTLE': 'Consumer', 'BRITANNIA': 'Consumer', 'NTPC': 'Energy',
  'POWERGRID': 'Energy', 'COAL INDIA': 'Energy', 'JSW STEEL': 'Energy',
  'TATA STEEL': 'Energy', 'HINDALCO': 'Energy', 'GRASIM': 'Energy',
  'BAJAJ_FINANCE': 'Banking', 'BAJAJ_FINSERV': 'Banking',
  'HCL_TECHNOLOIES': 'IT', 'TECH_MAHINDRA': 'IT',
  'ADANI_ENTERPRISES': 'Energy', 'ADANI_PORTS': 'Energy',
  'EICHER MOTOTRS': 'Auto', 'HERO MOTOCORP': 'Auto',
  'APOLLO HOSPITALS': 'Pharma', 'DIVIS LAB': 'Pharma',
  'ULTRATECH CEMENT': 'Energy', 'HDFC_LIFE': 'Banking', 'SBI_LIFE': 'Banking',
  'TATA CONSUMER PRODUCTS': 'Consumer', 'INDUS INDUSTRIES': 'Banking',
  'UPL': 'Pharma', 'BHARAT PETROLEUM': 'Energy',
};

// Helper to generate deterministic but realistic-looking data
function generateFundamentals(ticker, year) {
  const sector = TICKER_SECTOR[ticker] || 'Energy';
  const sectorPe = SECTOR_PE_AVERAGES[sector]?.[year] || 15;
  
  // Use hash for deterministic pseudo-random
  let hash = 0;
  const str = ticker + year;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const rand = (min, max) => {
    hash = (hash * 16807) % 2147483647;
    return min + (Math.abs(hash) % 1000) / 1000 * (max - min);
  };

  // Base values vary by sector and company size
  const sizeMultiplier = {
    'RELIANCE': 8, 'TATA CONSULTANCY SERVICES': 5, 'HDFC_BANK': 6, 'INFOSYS': 4,
    'ICICI_BANK': 4, 'ITC': 3.5, 'SBI_BANK': 5, 'BHARTI_AIRTEL': 3,
    'HINDUSTAN UNILEVER': 3, 'WIPRO': 2.5, 'ONGC': 4, 'BAJAJ AUTO': 2,
  }[ticker] || 1.5;

  const yearFactor = Math.max(0.3, 1 + (year - 2010) * 0.05);
  const crisisFactor = (year === 2008 || year === 2009) ? 0.6 : (year === 2020 ? 0.7 : 1);

  const revenue = Math.round(rand(8000, 15000) * sizeMultiplier * yearFactor * crisisFactor);
  const opMargin = rand(0.10, 0.30);
  const netMargin = rand(0.06, 0.20);
  const operatingProfit = Math.round(revenue * opMargin);
  const netProfit = Math.round(revenue * netMargin);
  
  const eps = Math.round(rand(8, 80) * yearFactor * crisisFactor * 100) / 100;
  const peVariance = rand(-0.3, 0.4);
  const pe = Math.round((sectorPe * (1 + peVariance)) * 100) / 100;
  const roe = Math.round(rand(6, 28) * 100) / 100;
  const dividendYield = sector === 'IT' || sector === 'Consumer' 
    ? Math.round(rand(0.5, 3.5) * 100) / 100 
    : Math.round(rand(0, 4) * 100) / 100;

  return {
    ticker_symbol: ticker,
    fiscal_year: year,
    record_type: 'yearly',
    revenue_cr: revenue,
    operating_profit_cr: operatingProfit,
    net_profit_cr: netProfit,
    eps: eps,
    eps_ttm: Math.round(eps * rand(0.9, 1.1) * 100) / 100,
    pe_ratio: pe,
    roe_percent: roe,
    dividend_yield_percent: dividendYield,
    sector_pe_avg: sectorPe,
    sector: sector,
    as_of_date: `${year}-03-31`,
  };
}

function generateQuarterlyData(ticker, year, quarter) {
  const yearly = generateFundamentals(ticker, year);
  const qFactor = [0.22, 0.25, 0.27, 0.26][quarter - 1];
  
  let hash = 0;
  const str = ticker + year + 'Q' + quarter;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const rand = (min, max) => {
    hash = (hash * 16807) % 2147483647;
    return min + (Math.abs(hash) % 1000) / 1000 * (max - min);
  };

  const qRevenue = Math.round(yearly.revenue_cr * qFactor * rand(0.85, 1.15));
  const qOpProfit = Math.round(yearly.operating_profit_cr * qFactor * rand(0.8, 1.2));
  const qNetProfit = Math.round(yearly.net_profit_cr * qFactor * rand(0.75, 1.25));

  const monthMap = { 1: '06-30', 2: '09-30', 3: '12-31', 4: '03-31' };

  return {
    ticker_symbol: ticker,
    fiscal_year: year,
    fiscal_quarter: quarter,
    record_type: 'quarterly',
    revenue_cr: qRevenue,
    operating_profit_cr: qOpProfit,
    net_profit_cr: qNetProfit,
    eps: Math.round(yearly.eps * qFactor * rand(0.85, 1.15) * 100) / 100,
    pe_ratio: yearly.pe_ratio,
    roe_percent: yearly.roe_percent,
    dividend_yield_percent: quarter === 4 ? yearly.dividend_yield_percent : 0,
    sector_pe_avg: yearly.sector_pe_avg,
    sector: yearly.sector,
    as_of_date: `${year}-${monthMap[quarter]}`,
  };
}

// Build the full dataset
const FUNDAMENTALS_DATA = {};
const TICKERS = Object.keys(TICKER_SECTOR);

TICKERS.forEach(ticker => {
  FUNDAMENTALS_DATA[ticker] = { yearly: {}, quarterly: {} };
  
  for (let year = 2000; year <= 2024; year++) {
    FUNDAMENTALS_DATA[ticker].yearly[year] = generateFundamentals(ticker, year);
    FUNDAMENTALS_DATA[ticker].quarterly[year] = {};
    for (let q = 1; q <= 4; q++) {
      FUNDAMENTALS_DATA[ticker].quarterly[year][q] = generateQuarterlyData(ticker, year, q);
    }
  }
});

/**
 * Get fundamentals for a ticker at a given simulated date
 * Only returns data up to the simulated date (no future data)
 */
export function getFundamentalsForDate(ticker, simulatedTimestamp) {
  const data = FUNDAMENTALS_DATA[ticker];
  if (!data) return null;

  const simDate = new Date(simulatedTimestamp);
  const simYear = simDate.getFullYear();
  const simMonth = simDate.getMonth() + 1; // 1-12

  // Determine the latest fiscal year with available data
  // Indian fiscal year ends March 31, so FY2008 data is available from April 2008
  let latestFY = simYear;
  if (simMonth < 4) latestFY = simYear - 1; // Before April, latest complete FY is previous year

  const yearlyData = data.yearly[latestFY] || data.yearly[latestFY - 1];
  
  return yearlyData || null;
}

/**
 * Get all yearly records up to simulated date
 */
export function getYearlyFinancials(ticker, simulatedTimestamp) {
  const data = FUNDAMENTALS_DATA[ticker];
  if (!data) return [];

  const simDate = new Date(simulatedTimestamp);
  const simYear = simDate.getFullYear();
  const simMonth = simDate.getMonth() + 1;
  
  let maxFY = simYear;
  if (simMonth < 4) maxFY = simYear - 1;

  const results = [];
  for (let year = 2000; year <= maxFY; year++) {
    if (data.yearly[year]) {
      results.push(data.yearly[year]);
    }
  }
  return results;
}

/**
 * Get quarterly records up to simulated date
 */
export function getQuarterlyFinancials(ticker, simulatedTimestamp) {
  const data = FUNDAMENTALS_DATA[ticker];
  if (!data) return [];

  const simDate = new Date(simulatedTimestamp);
  const results = [];

  for (let year = 2000; year <= 2024; year++) {
    if (!data.quarterly[year]) continue;
    for (let q = 1; q <= 4; q++) {
      const qData = data.quarterly[year][q];
      if (!qData) continue;
      
      const asOfDate = new Date(qData.as_of_date);
      // Quarterly results are released within 45 days of quarter end
      const releaseDate = new Date(asOfDate.getTime() + 45 * 24 * 60 * 60 * 1000);
      
      if (releaseDate <= simDate) {
        results.push(qData);
      }
    }
  }
  return results;
}

/**
 * Get P/E valuation badge
 */
export function getValuationBadge(pe, sectorPe) {
  if (!pe || !sectorPe) return { text: 'N/A', color: 'grey' };
  const ratio = pe / sectorPe;
  if (ratio > 1.2) return { text: 'Overvalued vs Sector', color: 'var(--danger)' };
  if (ratio < 0.8) return { text: 'Undervalued vs Sector', color: 'var(--success)' };
  return { text: 'Fairly Valued', color: 'var(--accent-primary)' };
}

/**
 * Get ROE health badge
 */
export function getROEBadge(roe) {
  if (roe > 15) return { text: 'Strong', color: 'var(--success)', bg: 'rgba(52,211,153,0.12)' };
  if (roe >= 8) return { text: 'Moderate', color: 'var(--warning)', bg: 'rgba(251,191,36,0.12)' };
  return { text: 'Weak', color: 'var(--danger)', bg: 'rgba(248,113,113,0.12)' };
}

/**
 * Get Dividend Yield badge
 */
export function getDividendBadge(dyield) {
  if (dyield === 0) return { text: 'No Dividend', color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.05)' };
  if (dyield > 2) return { text: `${dyield.toFixed(2)}%`, color: 'var(--success)', bg: 'rgba(52,211,153,0.12)' };
  return { text: `${dyield.toFixed(2)}%`, color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.05)' };
}

export { FUNDAMENTALS_DATA, SECTOR_PE_AVERAGES, TICKER_SECTOR };
