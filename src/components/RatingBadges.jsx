export default function RatingBadges({ risk, sentiment, strategy }) {
  const getRiskColor = (rating) => {
    if (rating === 'Low') return '#10b981';
    if (rating === 'High') return '#ef4444';
    return '#f59e0b';
  };
  const getSentimentColor = (rating) => {
    if (rating === 'Bullish') return '#10b981';
    if (rating === 'Bearish') return '#ef4444';
    return '#94a3b8';
  };
  const getStrategyColor = (action) => {
    if (action === 'BUY') return '#10b981';
    if (action === 'SELL') return '#ef4444';
    return '#f59e0b';
  };

  const getRiskTooltip = (score, rating) => {
    switch (rating) {
      case 'Low': return `Low risk (score: ${score}/100) - Stable asset with minimal volatility`;
      case 'Medium': return `Medium risk (score: ${score}/100) - Moderate market exposure`;
      case 'High': return `High risk (score: ${score}/100) - High volatility, significant drawdown potential`;
      default: return `Risk score: ${score}/100`;
    }
  };
  const getSentimentTooltip = (score, rating) => {
    switch (rating) {
      case 'Bullish': return `Bullish sentiment (score: ${score}/100) - Positive momentum and upward trend`;
      case 'Neutral': return `Neutral sentiment (score: ${score}/100) - Sideways consolidation`;
      case 'Bearish': return `Bearish sentiment (score: ${score}/100) - Downward momentum detected`;
      default: return `Sentiment score: ${score}/100`;
    }
  };
  const getStrategyTooltip = (action) => {
    switch (action) {
      case 'BUY': return 'BUY recommendation - Strong upside potential identified';
      case 'HOLD': return 'HOLD recommendation - Maintain current position';
      case 'SELL': return 'SELL recommendation - Exit position or avoid entry';
      default: return `Action: ${action}`;
    }
  };

  const badgeStyle = (color) => ({
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    padding: '3px 10px', borderRadius: '999px',
    fontSize: '0.72rem', fontWeight: '600',
    border: `1px solid ${color}44`,
    color, background: `${color}18`,
    cursor: 'help', transition: 'transform 0.15s',
  });
  const dotStyle = (color) => ({
    width: '7px', height: '7px', borderRadius: '50%', background: color, flexShrink: 0,
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
      <span style={badgeStyle(getRiskColor(risk?.rating))} title={getRiskTooltip(risk?.score, risk?.rating)}>
        <span style={dotStyle(getRiskColor(risk?.rating))} />
        {risk?.rating ?? '—'}
      </span>
      <span style={badgeStyle(getSentimentColor(sentiment?.rating))} title={getSentimentTooltip(sentiment?.score, sentiment?.rating)}>
        <span style={dotStyle(getSentimentColor(sentiment?.rating))} />
        {sentiment?.rating ?? '—'}
      </span>
      <span style={badgeStyle(getStrategyColor(strategy?.action))} title={getStrategyTooltip(strategy?.action)}>
        <span style={dotStyle(getStrategyColor(strategy?.action))} />
        {strategy?.action ?? '—'}
      </span>
    </div>
  );
}
