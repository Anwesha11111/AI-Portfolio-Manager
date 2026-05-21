import { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

export default function RatingBadges({ risk, sentiment, strategy }) {
  const [tooltipContent, setTooltipContent] = useState('');

  const getRiskColor = (rating) => {
    switch (rating) {
      case 'Low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'High': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getSentimentColor = (rating) => {
    switch (rating) {
      case 'Bullish': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Neutral': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'Bearish': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStrategyColor = (action) => {
    switch (action) {
      case 'BUY': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'HOLD': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'SELL': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
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

  return (
    <div className="flex items-center gap-2">
      {/* Risk Badge */}
      <div 
        className={`px-2.5 py-1 rounded-full text-[10px] font-medium border flex items-center gap-1.5 cursor-help transition-all hover:scale-105`}
        data-tooltip-id="risk-tooltip"
        data-tooltip-content={getRiskTooltip(risk.score, risk.rating)}
      >
        <span className={`w-2 h-2 rounded-full ${
          risk.rating === 'Low' ? 'bg-emerald-500' : 
          risk.rating === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'
        }`} />
        <span>{risk.rating}</span>
      </div>

      {/* Sentiment Badge */}
      <div 
        className={`px-2.5 py-1 rounded-full text-[10px] font-medium border flex items-center gap-1.5 cursor-help transition-all hover:scale-105`}
        data-tooltip-id="sentiment-tooltip"
        data-tooltip-content={getSentimentTooltip(sentiment.score, sentiment.rating)}
      >
        <span className={`w-2 h-2 rounded-full ${
          sentiment.rating === 'Bullish' ? 'bg-emerald-500' : 
          sentiment.rating === 'Neutral' ? 'bg-slate-500' : 'bg-rose-500'
        }`} />
        <span>{sentiment.rating}</span>
      </div>

      {/* Strategy Badge */}
      <div 
        className={`px-2.5 py-1 rounded-full text-[10px] font-medium border flex items-center gap-1.5 cursor-help transition-all hover:scale-105`}
        data-tooltip-id="strategy-tooltip"
        data-tooltip-content={getStrategyTooltip(strategy.action)}
      >
        <span className={`w-2 h-2 rounded-full ${
          strategy.action === 'BUY' ? 'bg-emerald-500' : 
          strategy.action === 'HOLD' ? 'bg-amber-500' : 'bg-rose-500'
        }`} />
        <span>{strategy.action}</span>
      </div>
    </div>
  );
}
