// src/data/marketNews.js
// Pre-seeded market news events for Indian stock market simulation (2000-2024)

const MARKET_NEWS = [
  // 2000-2002
  { date: '2000-03-10', headline: 'Dot-com bubble peaks — NASDAQ hits all-time high before crash', ticker: null, sentiment: 'bearish', summary: 'The global tech bubble burst leads to massive sell-offs in IT stocks worldwide, including Indian IT companies.', event_type: 'macro' },
  { date: '2001-09-11', headline: 'September 11 attacks trigger global market crash', ticker: null, sentiment: 'bearish', summary: 'Terror attacks in the US cause markets worldwide to plummet. Indian markets see heavy selling.', event_type: 'macro' },
  { date: '2002-02-27', headline: 'Gujarat riots impact investor sentiment', ticker: null, sentiment: 'bearish', summary: 'Communal violence in Gujarat creates uncertainty in Indian markets.', event_type: 'macro' },
  
  // 2003-2004
  { date: '2003-03-20', headline: 'US invades Iraq — oil prices surge', ticker: 'ONGC', sentiment: 'bullish', summary: 'Oil prices rise sharply benefiting ONGC and other energy stocks.', event_type: 'macro' },
  { date: '2003-06-15', headline: 'Infosys crosses $1 billion revenue milestone', ticker: 'INFOSYS', sentiment: 'bullish', summary: 'Infosys becomes the first Indian IT company to cross $1B in annual revenue.', event_type: 'earnings' },
  { date: '2004-05-17', headline: 'UPA government comes to power — markets crash 15% in a day', ticker: null, sentiment: 'bearish', summary: 'Unexpected election results trigger circuit breakers on BSE and NSE.', event_type: 'macro' },
  
  // 2005-2006
  { date: '2005-06-20', headline: 'Sensex crosses 7,000 for the first time', ticker: null, sentiment: 'bullish', summary: 'Indian markets rally on strong GDP growth and FII inflows.', event_type: 'macro' },
  { date: '2006-02-08', headline: 'Sensex breaches 10,000 mark amid bull run', ticker: null, sentiment: 'bullish', summary: 'India becomes the fastest growing major economy. Markets celebrate.', event_type: 'macro' },
  { date: '2006-05-22', headline: 'Global risk sell-off — Sensex drops 826 points', ticker: null, sentiment: 'bearish', summary: 'Emerging market sell-off triggered by rising US interest rates.', event_type: 'macro' },
  { date: '2006-09-15', headline: 'Reliance Petroleum IPO — largest Indian IPO at the time', ticker: 'RELIANCE', sentiment: 'bullish', summary: 'Reliance group continues expansion with mega IPO.', event_type: 'corporate' },
  
  // 2007
  { date: '2007-01-08', headline: 'Sensex hits 14,000 — India shining narrative strengthens', ticker: null, sentiment: 'bullish', summary: 'Strong corporate earnings and GDP growth fuel market optimism.', event_type: 'macro' },
  { date: '2007-10-29', headline: 'Sensex breaches 20,000 — unprecedented bull run', ticker: null, sentiment: 'bullish', summary: 'Indian markets reach historic highs on massive FII inflows.', event_type: 'macro' },
  { date: '2007-08-01', headline: 'US subprime mortgage crisis begins', ticker: null, sentiment: 'bearish', summary: 'Early signs of the US housing market collapse start affecting global sentiment.', event_type: 'macro' },
  { date: '2007-10-15', headline: 'TCS wins mega deal with Nielsen', ticker: 'TATA CONSULTANCY SERVICES', sentiment: 'bullish', summary: 'TCS secures one of its largest outsourcing contracts.', event_type: 'corporate' },
  
  // 2008 — Global Financial Crisis
  { date: '2008-01-21', headline: 'Global stock markets crash — worst day since 9/11', ticker: null, sentiment: 'bearish', summary: 'Fears of US recession trigger global sell-off. Sensex falls 1,408 points.', event_type: 'macro' },
  { date: '2008-03-17', headline: 'Bear Stearns collapses — acquired by JP Morgan', ticker: null, sentiment: 'bearish', summary: 'First major US investment bank to fail. Global contagion fears intensify.', event_type: 'macro' },
  { date: '2008-09-15', headline: 'Lehman Brothers files for bankruptcy — Global Financial Crisis', ticker: null, sentiment: 'bearish', summary: 'The collapse of Lehman Brothers triggers the worst financial crisis since the Great Depression. Indian markets crash 35% in weeks.', event_type: 'macro' },
  { date: '2008-10-10', headline: 'Sensex crashes to 10,527 — 50% fall from peak', ticker: null, sentiment: 'bearish', summary: 'Panic selling as FIIs pull out billions from Indian markets.', event_type: 'macro' },
  { date: '2008-10-24', headline: 'RBI cuts repo rate by 100 basis points in emergency move', ticker: null, sentiment: 'bullish', summary: 'Reserve Bank of India takes aggressive action to boost liquidity.', event_type: 'rbi_policy' },
  { date: '2008-12-16', headline: 'Satyam Computer Services fraud exposed', ticker: null, sentiment: 'bearish', summary: 'India\'s largest corporate fraud rocks IT sector. ₹7,000 Cr accounting fraud revealed.', event_type: 'corporate' },
  { date: '2008-11-15', headline: 'ICICI Bank faces liquidity rumors — stock drops 25%', ticker: 'ICICI_BANK', sentiment: 'bearish', summary: 'Rumors of exposure to Lehman cause panic withdrawal attempts.', event_type: 'corporate' },
  
  // 2009
  { date: '2009-03-09', headline: 'Global markets hit bottom — recovery begins', ticker: null, sentiment: 'bullish', summary: 'US Federal Reserve stimulus package signals potential market recovery.', event_type: 'macro' },
  { date: '2009-05-18', headline: 'UPA wins second term with majority — markets surge 17%', ticker: null, sentiment: 'bullish', summary: 'Clear election mandate triggers biggest single-day rally. Upper circuit hit.', event_type: 'macro' },
  { date: '2009-10-01', headline: 'RBI keeps rates unchanged — signals recovery confidence', ticker: null, sentiment: 'bullish', summary: 'RBI maintains accommodative stance to support economic recovery.', event_type: 'rbi_policy' },
  { date: '2009-07-06', headline: 'Budget 2009: Fiscal stimulus package announced', ticker: null, sentiment: 'bullish', summary: 'Government announces major spending to revive economy post-crisis.', event_type: 'budget' },
  
  // 2010-2011
  { date: '2010-11-05', headline: 'Sensex hits new all-time high of 21,004', ticker: null, sentiment: 'bullish', summary: 'QE2 from US Fed drives global liquidity into emerging markets.', event_type: 'macro' },
  { date: '2010-10-01', headline: 'Coal India IPO — India\'s largest IPO at ₹15,000 Cr', ticker: 'COAL INDIA', sentiment: 'bullish', summary: 'Coal India\'s mega IPO oversubscribed 15 times.', event_type: 'corporate' },
  { date: '2011-08-08', headline: 'US credit rating downgraded — global markets tank', ticker: null, sentiment: 'bearish', summary: 'S&P downgrades US credit rating for the first time. Indian markets fall 4%.', event_type: 'macro' },
  { date: '2011-12-01', headline: 'Rupee falls to record low of 52 against dollar', ticker: null, sentiment: 'bearish', summary: 'Currency depreciation hurts import-heavy companies but benefits IT exporters.', event_type: 'macro' },
  
  // 2012-2013
  { date: '2012-09-14', headline: 'FDI in multi-brand retail approved — reform push', ticker: null, sentiment: 'bullish', summary: 'Government opens retail sector to foreign investment. Markets rally.', event_type: 'macro' },
  { date: '2013-05-22', headline: 'Fed taper tantrum — Rupee crashes to 68', ticker: null, sentiment: 'bearish', summary: 'US Fed signals tapering of QE. Emerging markets face massive outflows.', event_type: 'macro' },
  { date: '2013-09-04', headline: 'Raghuram Rajan appointed RBI Governor — confidence returns', ticker: null, sentiment: 'bullish', summary: 'New RBI Governor brings credibility. Rupee recovers.', event_type: 'rbi_policy' },
  
  // 2014-2015
  { date: '2014-05-16', headline: 'BJP wins historic majority — Modi wave sweeps markets', ticker: null, sentiment: 'bullish', summary: 'Sensex crosses 25,000 on hopes of economic reforms under new government.', event_type: 'macro' },
  { date: '2014-09-18', headline: 'Make in India campaign launched', ticker: null, sentiment: 'bullish', summary: 'Government launches manufacturing initiative. Industrial stocks rally.', event_type: 'macro' },
  { date: '2015-01-15', headline: 'RBI surprises with 25 bps rate cut', ticker: null, sentiment: 'bullish', summary: 'Unexpected rate cut signals RBI support for growth. Banking stocks rally.', event_type: 'rbi_policy' },
  { date: '2015-08-24', headline: 'China market crash — Black Monday for global markets', ticker: null, sentiment: 'bearish', summary: 'Chinese yuan devaluation triggers global sell-off. Sensex drops 1,624 points.', event_type: 'macro' },
  
  // 2016
  { date: '2016-02-29', headline: 'Budget 2016: Focus on rural economy and infrastructure', ticker: null, sentiment: 'neutral', summary: 'Markets see mixed reaction to budget proposals.', event_type: 'budget' },
  { date: '2016-09-05', headline: 'Reliance Jio launches free 4G services — disrupts telecom', ticker: 'RELIANCE', sentiment: 'bullish', summary: 'Reliance Jio offers free unlimited data, disrupting entire telecom sector. Bharti Airtel, Idea stocks fall.', event_type: 'corporate' },
  { date: '2016-09-05', headline: 'Bharti Airtel faces existential threat from Jio launch', ticker: 'BHARTI_AIRTEL', sentiment: 'bearish', summary: 'Free Jio services threaten Airtel\'s revenue model. Stock under pressure.', event_type: 'corporate' },
  { date: '2016-11-08', headline: 'Demonetization announced — ₹500 and ₹1000 notes banned', ticker: null, sentiment: 'bearish', summary: 'PM Modi announces surprise demonetization. Markets crash, banking stocks volatile. Digital payment companies benefit.', event_type: 'macro' },
  
  // 2017
  { date: '2017-07-01', headline: 'GST rollout — India\'s biggest tax reform', ticker: null, sentiment: 'neutral', summary: 'Goods and Services Tax replaces multiple indirect taxes. Short-term disruption expected.', event_type: 'macro' },
  { date: '2017-10-24', headline: 'Government announces ₹2.11 lakh crore bank recapitalization', ticker: 'SBI_BANK', sentiment: 'bullish', summary: 'PSU bank stocks surge on massive recapitalization announcement.', event_type: 'macro' },
  { date: '2017-04-14', headline: 'TCS reports strong Q4 — IT sector recovery begins', ticker: 'TATA CONSULTANCY SERVICES', sentiment: 'bullish', summary: 'TCS posts strong quarterly results, signaling IT sector turnaround.', event_type: 'earnings' },
  { date: '2017-08-10', headline: 'Wipro announces major restructuring and layoffs', ticker: 'WIPRO', sentiment: 'neutral', summary: 'Wipro cuts thousands of jobs to improve margins. Cost optimization expected to boost future EPS.', event_type: 'corporate' },
  
  // 2018
  { date: '2018-02-01', headline: 'Budget 2018: LTCG tax reintroduced on equity', ticker: null, sentiment: 'bearish', summary: 'Government reintroduces 10% Long-Term Capital Gains tax on equity after 14 years.', event_type: 'budget' },
  { date: '2018-09-21', headline: 'IL&FS defaults on debt — NBFC crisis begins', ticker: null, sentiment: 'bearish', summary: 'IL&FS default triggers liquidity crisis across NBFCs. DHFL, Yes Bank under pressure.', event_type: 'macro' },
  { date: '2018-10-26', headline: 'Sensex falls 1,000 points — global trade war fears', ticker: null, sentiment: 'bearish', summary: 'US-China trade war escalation and rising oil prices hurt Indian markets.', event_type: 'macro' },
  { date: '2018-04-13', headline: 'Infosys Q4 miss — guidance disappoints', ticker: 'INFOSYS', sentiment: 'bearish', summary: 'Infosys reports below-expectation results and weak forward guidance.', event_type: 'earnings' },
  
  // 2019
  { date: '2019-02-01', headline: 'Interim Budget: Income tax rebate for individuals', ticker: null, sentiment: 'bullish', summary: 'Government announces tax relief ahead of elections. Consumer stocks rally.', event_type: 'budget' },
  { date: '2019-05-23', headline: 'Modi wins second term with bigger majority', ticker: null, sentiment: 'bullish', summary: 'Sensex hits all-time high on Modi 2.0 mandate. Nifty crosses 12,000.', event_type: 'macro' },
  { date: '2019-09-20', headline: 'Government slashes corporate tax to 22%', ticker: null, sentiment: 'bullish', summary: 'Surprise corporate tax cut triggers biggest single-day rally since 2009. Sensex surges 1,921 points.', event_type: 'macro' },
  { date: '2019-08-02', headline: 'HDFC Bank crosses ₹7 lakh crore market cap', ticker: 'HDFC_BANK', sentiment: 'bullish', summary: 'HDFC Bank becomes India\'s most valuable bank by market cap.', event_type: 'corporate' },
  
  // 2020 — COVID-19
  { date: '2020-01-30', headline: 'India reports first COVID-19 case in Kerala', ticker: null, sentiment: 'bearish', summary: 'Coronavirus reaches India. Markets begin pricing in pandemic risk.', event_type: 'macro' },
  { date: '2020-03-12', headline: 'WHO declares COVID-19 a global pandemic', ticker: null, sentiment: 'bearish', summary: 'Markets crash worldwide. Sensex enters bear market territory.', event_type: 'macro' },
  { date: '2020-03-23', headline: 'Sensex crashes to 25,981 — worst fall since 2008', ticker: null, sentiment: 'bearish', summary: 'COVID lockdown fears trigger 38% crash from January highs. Circuit breakers triggered multiple times.', event_type: 'macro' },
  { date: '2020-03-24', headline: 'PM Modi announces 21-day nationwide lockdown', ticker: null, sentiment: 'bearish', summary: 'India enters complete lockdown. Economic activity grinds to halt.', event_type: 'macro' },
  { date: '2020-03-27', headline: 'RBI cuts repo rate by 75 bps to 4.4% — emergency measure', ticker: null, sentiment: 'bullish', summary: 'RBI announces massive rate cut and liquidity measures worth ₹3.74 lakh crore.', event_type: 'rbi_policy' },
  { date: '2020-05-12', headline: 'Atmanirbhar Bharat package — ₹20 lakh crore stimulus', ticker: null, sentiment: 'bullish', summary: 'Government announces massive fiscal stimulus. Markets recover 20% from lows.', event_type: 'macro' },
  { date: '2020-07-15', headline: 'Reliance raises ₹1.52 lakh crore — becomes net debt free', ticker: 'RELIANCE', sentiment: 'bullish', summary: 'Reliance Industries completes historic fundraising from Google, Facebook, and others.', event_type: 'corporate' },
  { date: '2020-09-21', headline: 'TCS market cap crosses ₹10 lakh crore', ticker: 'TATA CONSULTANCY SERVICES', sentiment: 'bullish', summary: 'TCS becomes the second Indian company after Reliance to achieve this milestone.', event_type: 'corporate' },
  { date: '2020-11-09', headline: 'Pfizer vaccine shows 90% efficacy — markets surge globally', ticker: null, sentiment: 'bullish', summary: 'Vaccine breakthrough triggers massive rally. Sensex crosses 43,000.', event_type: 'macro' },
  { date: '2020-11-26', headline: 'Farmers protest against new farm laws — market uncertainty', ticker: null, sentiment: 'neutral', summary: 'Large-scale protests create political uncertainty but limited market impact.', event_type: 'macro' },
  
  // 2021
  { date: '2021-02-01', headline: 'Budget 2021: Disinvestment target of ₹1.75 lakh crore', ticker: null, sentiment: 'bullish', summary: 'LIC IPO announced. Government targets aggressive privatization.', event_type: 'budget' },
  { date: '2021-04-22', headline: 'India\'s COVID second wave — 3 lakh daily cases', ticker: null, sentiment: 'bearish', summary: 'Devastating second wave causes localized lockdowns. Pharma stocks rally on vaccine demand.', event_type: 'macro' },
  { date: '2021-04-22', headline: 'Pharma sector sees massive demand during second wave', ticker: 'CIPLA', sentiment: 'bullish', summary: 'Drug makers ramp up production. Cipla and Sun Pharma stock prices surge.', event_type: 'corporate' },
  { date: '2021-10-18', headline: 'Sensex crosses 62,000 — new all-time high', ticker: null, sentiment: 'bullish', summary: 'Indian markets outperform globally on strong earnings recovery and retail investor surge.', event_type: 'macro' },
  { date: '2021-11-18', headline: 'Paytm IPO lists at 27% discount — worst major IPO debut', ticker: null, sentiment: 'bearish', summary: 'India\'s largest IPO disappoints investors on listing day.', event_type: 'corporate' },
  { date: '2021-07-14', headline: 'Wipro announces acquisition of Capco for $1.45 billion', ticker: 'WIPRO', sentiment: 'bullish', summary: 'Wipro\'s largest acquisition boosts consulting capabilities.', event_type: 'corporate' },
  
  // 2022
  { date: '2022-02-24', headline: 'Russia invades Ukraine — global markets crash', ticker: null, sentiment: 'bearish', summary: 'War in Europe triggers energy crisis. Oil prices surge past $100. Indian markets volatile.', event_type: 'macro' },
  { date: '2022-05-04', headline: 'RBI raises repo rate by 40 bps in surprise move', ticker: null, sentiment: 'bearish', summary: 'Inflation-fighting rate hike catches markets off guard. Banking margins benefit long-term.', event_type: 'rbi_policy' },
  { date: '2022-05-12', headline: 'LIC IPO — India\'s largest-ever public offering', ticker: null, sentiment: 'neutral', summary: 'LIC lists on stock exchanges. Government raises ₹21,000 crore.', event_type: 'corporate' },
  { date: '2022-06-16', headline: 'US Fed raises rates by 75 bps — fastest pace since 1994', ticker: null, sentiment: 'bearish', summary: 'Aggressive US rate hikes trigger FII sell-off from Indian markets.', event_type: 'macro' },
  { date: '2022-09-30', headline: 'Rupee breaches 82 against dollar', ticker: null, sentiment: 'bearish', summary: 'Depreciating rupee impacts importers but benefits IT exporters.', event_type: 'macro' },
  { date: '2022-12-01', headline: 'Sensex at 63,284 — India outperforms global peers', ticker: null, sentiment: 'bullish', summary: 'Indian markets buck global trend, attracting massive retail investor participation.', event_type: 'macro' },
  { date: '2022-01-24', headline: 'Adani Group faces Hindenburg Research report', ticker: 'ADANI_ENTERPRISES', sentiment: 'bearish', summary: 'Short-seller report alleges stock manipulation. Adani stocks crash 20%.', event_type: 'corporate' },
  
  // 2023
  { date: '2023-01-25', headline: 'Hindenburg report triggers Adani meltdown — ₹10L Cr wiped', ticker: 'ADANI_ENTERPRISES', sentiment: 'bearish', summary: 'Adani Group loses over $100 billion in market cap in weeks.', event_type: 'corporate' },
  { date: '2023-02-01', headline: 'Budget 2023: New tax regime made default', ticker: null, sentiment: 'neutral', summary: 'Government pushes new income tax regime as default option.', event_type: 'budget' },
  { date: '2023-04-14', headline: 'Infosys reports strong Q4 — beats estimates', ticker: 'INFOSYS', sentiment: 'bullish', summary: 'Infosys delivers above-expectation results with improved guidance.', event_type: 'earnings' },
  { date: '2023-07-20', headline: 'Nifty crosses 20,000 for the first time', ticker: null, sentiment: 'bullish', summary: 'Indian markets reach historic milestone on strong domestic flows.', event_type: 'macro' },
  { date: '2023-09-15', headline: 'HDFC Bank completes merger with HDFC Ltd', ticker: 'HDFC_BANK', sentiment: 'bullish', summary: 'India\'s largest financial services merger creates banking behemoth.', event_type: 'corporate' },
  { date: '2023-12-04', headline: 'BJP wins 3 state elections — market rally', ticker: null, sentiment: 'bullish', summary: 'Political stability boosts markets. Sensex crosses 70,000.', event_type: 'macro' },
  
  // 2024
  { date: '2024-02-01', headline: 'Interim Budget 2024: Fiscal discipline maintained', ticker: null, sentiment: 'neutral', summary: 'Government presents vote-on-account ahead of elections.', event_type: 'budget' },
  { date: '2024-06-04', headline: 'Election results — BJP wins but with reduced majority', ticker: null, sentiment: 'bearish', summary: 'Markets fall 6% on weaker-than-expected BJP mandate. Coalition concerns.', event_type: 'macro' },
  { date: '2024-09-27', headline: 'Sensex crosses 85,000 — India market cap hits $5 trillion', ticker: null, sentiment: 'bullish', summary: 'India becomes the 5th country to reach $5 trillion equity market valuation.', event_type: 'macro' },
  { date: '2024-10-03', headline: 'FII sell-off — China stimulus redirects flows', ticker: null, sentiment: 'bearish', summary: 'Chinese stimulus package diverts foreign investment from India to China.', event_type: 'macro' },
  { date: '2024-07-23', headline: 'Budget 2024: LTCG tax hiked to 12.5% on equity', ticker: null, sentiment: 'bearish', summary: 'Government increases capital gains tax, dampening market sentiment.', event_type: 'budget' },
  { date: '2024-04-12', headline: 'ITC demerger — hotels business to be separated', ticker: 'ITC', sentiment: 'bullish', summary: 'ITC announces demerger of hotel business, unlocking shareholder value.', event_type: 'corporate' },
];

/**
 * Get global market news within ±3 months of simulated date
 * Returns only news that happened ON or BEFORE the simulated date
 */
export function getGlobalNews(simulatedTimestamp) {
  const simDate = new Date(simulatedTimestamp);
  const threeMonthsMs = 90 * 24 * 60 * 60 * 1000;
  const windowStart = simulatedTimestamp - threeMonthsMs;

  return MARKET_NEWS
    .filter(n => {
      const newsTime = new Date(n.date).getTime();
      return n.ticker === null && newsTime >= windowStart && newsTime <= simulatedTimestamp;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);
}

/**
 * Get stock-specific news for a ticker near the simulated date
 */
export function getStockNews(ticker, simulatedTimestamp) {
  const threeMonthsMs = 90 * 24 * 60 * 60 * 1000;
  const windowStart = simulatedTimestamp - threeMonthsMs;

  return MARKET_NEWS
    .filter(n => {
      const newsTime = new Date(n.date).getTime();
      return n.ticker === ticker && newsTime >= windowStart && newsTime <= simulatedTimestamp;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
}

export function getSentimentBadge(sentiment) {
  if (sentiment === 'bullish') return { icon: '🟢', text: 'Bullish', color: 'var(--success)', bg: 'rgba(52,211,153,0.12)' };
  if (sentiment === 'bearish') return { icon: '🔴', text: 'Bearish', color: 'var(--danger)', bg: 'rgba(248,113,113,0.12)' };
  return { icon: '⚪', text: 'Neutral', color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.05)' };
}

export { MARKET_NEWS };
