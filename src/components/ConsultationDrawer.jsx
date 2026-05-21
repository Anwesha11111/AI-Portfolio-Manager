import { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Activity, Shield, MessageSquare, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ConsultationDrawer({ isOpen, onClose, symbol, currentPrice, currentSimulatedDate }) {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);
  const [isTrading, setIsTrading] = useState(false);
  const [tradeQuantity, setTradeQuantity] = useState('');
  const [tradeError, setTradeError] = useState('');
  const [tradeSuccess, setTradeSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && symbol && currentSimulatedDate) {
      fetchRecommendation();
    }
  }, [isOpen, symbol, currentSimulatedDate]);

  const fetchRecommendation = async () => {
    if (!symbol || !currentSimulatedDate) return;
    
    setLoading(true);
    setError(null);
    setRecommendation(null);
    setTradeError('');
    setTradeSuccess(false);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/multiagent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: symbol.toUpperCase(), date: currentSimulatedDate })
      });

      const data = await response.json();

      if (response.ok) {
        setRecommendation(data);
      } else {
        setError(data.error || 'Failed to fetch recommendations');
      }
    } catch (err) {
      console.error('Multi-agent consultation failed:', err);
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  const executeTrade = async (action) => {
    if (!symbol || !currentSimulatedDate) return;
    
    setIsTrading(true);
    setTradeError('');
    setTradeSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setTradeError('Must be logged in to execute trades.');
        setIsTrading(false);
        return;
      }

      const { data: userData } = await supabase.from('users').select('virtual_balance').eq('id', user.id).single();
      let balance = Number(userData?.virtual_balance || 0);

      const qty = parseInt(tradeQuantity);
      if (!qty || qty <= 0) {
        setTradeError('Please enter a valid quantity.');
        setIsTrading(false);
        return;
      }

      const cost = qty * currentPrice;

      if (cost > balance) {
        setTradeError(`Insufficient funds. Need ₹${cost.toLocaleString()}, have ₹${balance.toLocaleString()}.`);
        setIsTrading(false);
        return;
      }
      
      await supabase.from('users').update({ virtual_balance: balance - cost }).eq('id', user.id);
      await supabase.from('transactions').insert({ 
        user_id: user.id, 
        symbol: symbol.toUpperCase(), 
        type: action, 
        quantity: qty, 
        price_per_unit: currentPrice, 
        simulated_date: currentSimulatedDate 
      });

      const { data: holding } = await supabase.from('holdings').select('*').eq('user_id', user.id).eq('symbol', symbol.toUpperCase()).maybeSingle();
      if (holding) {
        const newQty = holding.quantity + qty;
        const newAvg = ((holding.quantity * holding.average_buy_price) + cost) / newQty;
        await supabase.from('holdings').update({ quantity: newQty, average_buy_price: newAvg }).eq('id', holding.id);
      } else {
        await supabase.from('holdings').insert({ 
          user_id: user.id, 
          symbol: symbol.toUpperCase(), 
          quantity: qty, 
          average_buy_price: currentPrice 
        });
      }

      setTradeSuccess(true);
      setTradeQuantity('');
    } catch (err) {
      console.error("Trade failed:", err);
      setTradeError('Trade failed due to an error. Please try again.');
    }

    setIsTrading(false);
  };

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-2xl h-full bg-slate-900 border-l border-slate-700 shadow-2xl overflow-y-auto animate-slide-in-right">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="text-purple-400" size={24} />
              AI Multi-Agent Consultation
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Analyzing {symbol || 'selected stock'} with Risk, Sentiment, and Strategy agents
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              <p className="text-purple-400 font-medium animate-pulse">Running multi-agent simulation...</p>
            </div>
          ) : error ? (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-6 text-center">
              <AlertCircle className="text-rose-500 mx-auto mb-3" size={48} />
              <h3 className="text-rose-400 font-bold text-lg mb-2">Consultation Failed</h3>
              <p className="text-slate-400 mb-4">{error}</p>
              <button 
                onClick={fetchRecommendation}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : recommendation ? (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Risk Card */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="text-slate-400" size={20} />
                    <h3 className="font-semibold text-slate-200">Risk Score</h3>
                  </div>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-bold text-white">{recommendation.risk.score}</span>
                    <span className="text-sm text-slate-400 mb-1">/100</span>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(recommendation.risk.rating)}`}>
                    {recommendation.risk.rating} Risk
                  </span>
                </div>

                {/* Sentiment Card */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="text-slate-400" size={20} />
                    <h3 className="font-semibold text-slate-200">Sentiment</h3>
                  </div>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-bold text-white">{recommendation.sentiment.score}</span>
                    <span className="text-sm text-slate-400 mb-1">/100</span>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getSentimentColor(recommendation.sentiment.rating)}`}>
                    {recommendation.sentiment.rating}
                  </span>
                </div>

                {/* Strategy Card */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="text-slate-400" size={20} />
                    <h3 className="font-semibold text-slate-200">Strategy</h3>
                  </div>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-bold text-white">{recommendation.strategy.action}</span>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStrategyColor(recommendation.strategy.action)}`}>
                    {recommendation.strategy.action}
                  </span>
                </div>
              </div>

              {/* Strategy Details */}
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                <h3 className="font-semibold text-purple-300 mb-4 flex items-center gap-2">
                  <ArrowRight size={18} />
                  Strategy Targets
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Target Price</p>
                    <p className="text-xl font-bold text-emerald-400">₹{recommendation.strategy.targetPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Stop Loss</p>
                    <p className="text-xl font-bold text-rose-400">₹{recommendation.strategy.stopLoss.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Trade Execution Panel */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <TrendingUp className="text-purple-400" size={18} />
                  Execute Trade
                </h3>
                
                {tradeSuccess ? (
                  <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4 text-center">
                    <CheckCircle className="text-emerald-400 mx-auto mb-2" size={32} />
                    <p className="text-emerald-400 font-medium">Trade executed successfully!</p>
                    <p className="text-sm text-slate-400 mt-1">
                      Executed {recommendation.strategy.action} order for {symbol}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={tradeQuantity}
                        onChange={(e) => setTradeQuantity(e.target.value)}
                        placeholder="Enter quantity"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Current Price:</span>
                      <span className="text-white font-medium">₹{currentPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Estimated Cost:</span>
                      <span className="text-white font-medium">
                        ₹{(parseInt(tradeQuantity) || 0) * currentPrice.toLocaleString()}
                      </span>
                    </div>

                    {tradeError && (
                      <div className="bg-rose-500/20 border border-rose-500/30 rounded-lg p-3 text-rose-400 text-sm">
                        {tradeError}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => executeTrade('BUY')}
                        disabled={isTrading || !tradeQuantity}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-900 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                      >
                        {isTrading ? 'Executing...' : 'Buy'}
                      </button>
                      <button
                        onClick={() => executeTrade('SELL')}
                        disabled={isTrading || !tradeQuantity}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-900 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                      >
                        {isTrading ? 'Executing...' : 'Sell'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Agent Dialogue */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                  <MessageSquare className="text-purple-400" size={20} />
                  Agent Dialogue
                </h3>
                
                {/* Risk Agent */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                      <Shield className="text-slate-300" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">Risk Scoring Agent</h4>
                      <p className="text-xs text-slate-400">Evaluating volatility, drawdowns, and risk metrics</p>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{recommendation.risk.rationale}</p>
                </div>

                {/* Sentiment Agent */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                      <Activity className="text-slate-300" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">Sentiment Analysis Agent</h4>
                      <p className="text-xs text-slate-400">Analyzing momentum, RSI, and SMA crossovers</p>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{recommendation.sentiment.rationale}</p>
                </div>

                {/* Strategy Agent */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                      <TrendingUp className="text-slate-300" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">Strategy Developer Agent</h4>
                      <p className="text-xs text-slate-400">Synthesizing insights into actionable strategy</p>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{recommendation.strategy.rationale}</p>
                </div>
              </div>

              {/* Conversation Log */}
              {recommendation.conversation && recommendation.conversation.length > 0 && (
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5">
                  <h3 className="font-semibold text-slate-200 mb-3 text-sm">Full Conversation Log</h3>
                  <div className="space-y-3">
                    {recommendation.conversation.map((msg, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-purple-400">
                            {msg.agent.replace('Agent', '').charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 mb-1">{msg.agent}</p>
                          <p className="text-sm text-slate-300">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
              <p className="mb-1">Based on analysis up to {new Date(currentSimulatedDate).toLocaleDateString()}</p>
              <p className="text-xs">AI recommendations are for informational purposes only</p>
            </div>
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
