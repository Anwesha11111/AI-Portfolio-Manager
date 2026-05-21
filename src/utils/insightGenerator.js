// src/utils/insightGenerator.js

function getSymbolHash(symbol) {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

// 1-100 Risk Score for a stock
export function getAssetRiskScore(symbol) {
  const hash = getSymbolHash(symbol);
  // Give it a risk between 30 and 95
  return 30 + (hash % 66);
}

// 0-100 Suitability match based on user profile
export function getSuitabilityScore(symbol, userProfile) {
  if (!userProfile) return 50;
  
  const assetRisk = getAssetRiskScore(symbol);
  
  // User risk capacity (0-100)
  let userCapacity = 50;
  if (userProfile.drawdown_tolerance === 'high') userCapacity += 25;
  if (userProfile.drawdown_tolerance === 'low') userCapacity -= 25;
  if (userProfile.primary_objective === 'growth') userCapacity += 10;
  if (userProfile.primary_objective === 'preservation') userCapacity -= 15;
  if (userProfile.time_horizon === 'long') userCapacity += 15;
  if (userProfile.time_horizon === 'short') userCapacity -= 15;
  
  userCapacity = Math.max(10, Math.min(100, userCapacity));
  
  // Difference between stock risk and user capacity
  const diff = Math.abs(assetRisk - userCapacity);
  
  // Perfect match if diff is 0, drops off as diff increases
  const match = Math.max(0, 100 - diff * 1.5);
  return Math.round(match);
}

// Generate the Post-Mortem Insights
export function generateTradeInsights(holding, currentPrice, simulatedDate, firstTransactionDate, userProfile) {
  const pnlPct = ((currentPrice - holding.average_buy_price) / holding.average_buy_price) * 100;
  
  // Holding period in days
  const holdingDays = Math.max(1, Math.floor((simulatedDate - firstTransactionDate) / (1000 * 60 * 60 * 24)));
  const holdingWeeks = Math.round(holdingDays / 7);
  
  const assetRisk = getAssetRiskScore(holding.symbol);
  const suitability = getSuitabilityScore(holding.symbol, userProfile);
  
  let reason;
  let pattern;
  let riskLesson;
  let timingLesson;
  let takeaway;
  let tweak;

  const isWin = pnlPct >= 0;
  const isHighRisk = assetRisk > 70;

  // Reason for outcome
  if (isWin) {
    reason = pnlPct > 20 
      ? 'Profit driven by strong market momentum and potential sector boom.'
      : 'Steady growth aligned with broader market trends.';
  } else {
    reason = pnlPct < -15
      ? 'Loss primarily driven by short-term volatility and negative sector news.'
      : 'Minor drawdown due to regular market fluctuations.';
  }

  // Pattern Recognition
  if (isWin) {
    pattern = holdingDays < 30
      ? 'You capitalized on a short-term upswing perfectly.'
      : 'You held through the noise, capturing the long-term trend.';
  } else {
    pattern = holdingDays < 30
      ? 'Bought near a local peak; currently facing a correction.'
      : 'Extended holding period hasn\'t yielded a turnaround yet.';
  }

  // Risk Lesson
  if (isHighRisk) {
    riskLesson = 'This is a high-volatility asset. Ensure position sizing isn\'t too large.';
  } else {
    riskLesson = 'This is a relatively stable asset, providing good core portfolio diversification.';
  }

  // Timing Lesson
  if (holdingDays < 14) {
    timingLesson = 'Very short holding period. Holding longer often smooths out random volatility.';
  } else {
    timingLesson = isWin 
      ? 'Your patience paid off. Timing the entry well and holding yielded returns.'
      : 'Holding through a downtrend requires conviction. Re-evaluate if the fundamental thesis has changed.';
  }

  // Educational Add-ons
  if (isWin) {
    takeaway = isHighRisk
      ? 'High risk can mean high reward, but remember to secure profits.'
      : 'Consistent, stable assets are the bedrock of long-term wealth.';
    tweak = 'Consider setting a trailing stop-loss to lock in these gains if the market reverses.';
  } else {
    takeaway = suitability > 70
      ? 'This asset matches your profile, so a short-term loss might be acceptable.'
      : 'This asset is a poor match for your risk profile, making losses harder to stomach.';
    tweak = pnlPct < -10 
      ? 'Consider setting strict stop-loss orders in the future to limit downside.'
      : 'If you still believe in the company, this might be a temporary dip. Diversify to reduce impact.';
  }

  // Benchmark mock (NIFTY 50 generic trend)
  const mockBenchmarkPct = holdingDays * 0.05; // 0.05% per day roughly
  const outperforming = pnlPct > mockBenchmarkPct;

  return {
    holdingDays,
    holdingWeeks,
    assetRisk,
    suitability,
    benchmarkPct: mockBenchmarkPct,
    outperforming,
    reason,
    pattern,
    riskLesson,
    timingLesson,
    takeaway,
    tweak
  };
}
