import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, TrendingUp, Activity, Shield, MessageSquare, ArrowRight, AlertCircle, ExternalLink } from 'lucide-react';

const S = {
  overlay: { position: 'fixed', inset: 0, zIndex: 50, display: 'flex', justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' },
  drawer: { position: 'relative', width: '100%', maxWidth: '672px', height: '100%', background: '#0f172a', borderLeft: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', overflowY: 'auto' },
  header: { position: 'sticky', top: 0, zIndex: 10, background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 },
  headerSub: { fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' },
  closeBtn: { padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  content: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' },
  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' },
  cardTitle: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontWeight: '600', color: '#e2e8f0', fontSize: '0.95rem' },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' },
  bigNum: { fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: '8px 0 4px 0' },
  badge: (color) => ({ display: 'inline-block', padding: '3px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600', border: `1px solid ${color}44`, color, background: `${color}22` }),
  strategyBox: { background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '12px', padding: '20px' },
  strategyTitle: { fontWeight: '600', color: '#c084fc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  label: { fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' },
  agentRow: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
  agentAvatar: { width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  agentName: { fontWeight: '600', color: '#e2e8f0', fontSize: '0.9rem' },
  agentSub: { fontSize: '0.75rem', color: '#64748b', marginBottom: '6px' },
  agentText: { color: '#cbd5e1', fontSize: '0.88rem', lineHeight: '1.6' },
  footer: { position: 'sticky', bottom: 0, background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  footerText: { fontSize: '0.8rem', color: '#64748b' },
};

function getRiskColor(rating) {
  if (rating === 'Low') return '#10b981';
  if (rating === 'High') return '#ef4444';
  return '#f59e0b';
}
function getSentimentColor(rating) {
  if (rating === 'Bullish') return '#10b981';
  if (rating === 'Bearish') return '#ef4444';
  return '#94a3b8';
}
function getStrategyColor(action) {
  if (action === 'BUY') return '#10b981';
  if (action === 'SELL') return '#ef4444';
  return '#f59e0b';
}

export default function ConsultationDrawer({ isOpen, onClose, symbol, currentSimulatedDate }) {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);
  const [simQty, setSimQty] = useState('');
  const navigate = useNavigate();

  const fetchRecommendation = useCallback(async () => {
    if (!symbol || !currentSimulatedDate) return;
    setLoading(true);
    setError(null);
    setRecommendation(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/multiagent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: symbol.toUpperCase(), date: currentSimulatedDate })
      });
      const data = await response.json();
      if (response.ok) {
        setRecommendation({
          ...data,
          currentPrice: data.currentPrice || 0,
          risk: { ...data.risk, score: typeof data.risk?.score === 'number' ? data.risk.score : parseInt(data.risk?.score, 10) || 0 },
          sentiment: { ...data.sentiment, score: typeof data.sentiment?.score === 'number' ? data.sentiment.score : parseInt(data.sentiment?.score, 10) || 0 }
        });
      } else {
        setError(data.error || 'Failed to fetch recommendations');
      }
    } catch (err) {
      console.error('Multi-agent consultation failed:', err);
      setError('Network error. Please try again.');
    }
    setLoading(false);
  }, [symbol, currentSimulatedDate]);

  useEffect(() => {
    if (isOpen && symbol && currentSimulatedDate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchRecommendation();
    }
  }, [isOpen, symbol, currentSimulatedDate, fetchRecommendation]);

  if (!isOpen) return null;

  const handleGoToStock = () => {
    onClose();
    navigate(`/market/${encodeURIComponent(symbol)}`);
  };

  return (
    <div style={S.overlay}>
      <div style={S.backdrop} onClick={onClose} />
      <div style={S.drawer}>

        {/* Header */}
        <div style={S.header}>
          <div>
            <h2 style={S.headerTitle}><Activity size={22} color="#a78bfa" /> AI Multi-Agent Consultation</h2>
            <p style={S.headerSub}>Advisory analysis for {symbol || 'selected stock'} — no trades are executed here</p>
          </div>
          <button style={S.closeBtn} onClick={onClose}><X size={22} /></button>
        </div>

        {/* Content */}
        <div style={S.content}>

          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 0', gap: '16px' }}>
              <div style={{ width: '56px', height: '56px', border: '4px solid rgba(139,92,246,0.2)', borderTopColor: '#a78bfa', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ color: '#a78bfa', fontWeight: '500' }}>Running multi-agent simulation...</p>
            </div>
          )}

          {!loading && error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
              <AlertCircle size={40} color="#ef4444" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ color: '#f87171', fontWeight: 'bold', marginBottom: '8px' }}>Consultation Failed</h3>
              <p style={{ color: '#94a3b8', marginBottom: '16px' }}>{error}</p>
              <button onClick={fetchRecommendation} style={{ padding: '8px 24px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Try Again</button>
            </div>
          )}

          {!loading && recommendation && (
            <>
              {/* Summary Cards */}
              <div style={S.grid3}>
                <div style={S.card}>
                  <div style={S.cardTitle}><Shield size={18} color="#94a3b8" /> Risk Score</div>
                  <div style={S.bigNum}>{recommendation.risk?.score ?? '—'}<span style={{ fontSize: '0.9rem', color: '#64748b', marginLeft: '4px' }}>/100</span></div>
                  <span style={S.badge(getRiskColor(recommendation.risk?.rating))}>{recommendation.risk?.rating} Risk</span>
                </div>
                <div style={S.card}>
                  <div style={S.cardTitle}><Activity size={18} color="#94a3b8" /> Sentiment</div>
                  <div style={S.bigNum}>{recommendation.sentiment?.score ?? '—'}<span style={{ fontSize: '0.9rem', color: '#64748b', marginLeft: '4px' }}>/100</span></div>
                  <span style={S.badge(getSentimentColor(recommendation.sentiment?.rating))}>{recommendation.sentiment?.rating}</span>
                </div>
                <div style={S.card}>
                  <div style={S.cardTitle}><TrendingUp size={18} color="#94a3b8" /> Strategy</div>
                  <div style={{ ...S.bigNum, fontSize: '1.5rem' }}>{recommendation.strategy?.action ?? '—'}</div>
                  <span style={S.badge(getStrategyColor(recommendation.strategy?.action))}>{recommendation.strategy?.action}</span>
                </div>
              </div>

              {/* Strategy Targets */}
              {recommendation.strategy?.targetPrice != null && (
                <div style={S.strategyBox}>
                  <div style={S.strategyTitle}><ArrowRight size={16} /> Strategy Targets</div>
                  <div style={S.grid2}>
                    <div>
                      <p style={S.label}>Target Price</p>
                      <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#34d399', margin: 0 }}>₹{recommendation.strategy.targetPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p style={S.label}>Stop Loss</p>
                      <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#f87171', margin: 0 }}>₹{recommendation.strategy.stopLoss?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── What If Simulator ── */}
              {recommendation.strategy?.targetPrice != null && (
                (() => {
                  const qty = parseInt(simQty) || 0;
                  const entryPrice = recommendation.currentPrice || 0;
                  const targetPrice = recommendation.strategy.targetPrice;
                  const stopLoss = recommendation.strategy.stopLoss;
                  const profitIfTarget = qty * (targetPrice - entryPrice);
                  const lossIfStop = qty * (stopLoss - entryPrice);
                  const pctTarget = entryPrice > 0 ? ((targetPrice - entryPrice) / entryPrice * 100) : 0;
                  const pctStop = entryPrice > 0 ? ((stopLoss - entryPrice) / entryPrice * 100) : 0;

                  return (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.72rem', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', padding: '2px 10px', borderRadius: '999px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Simulation Only</span>
                      </div>
                      <h3 style={{ margin: '8px 0 4px', color: '#e2e8f0', fontSize: '1rem', fontWeight: '700' }}>What If I {recommendation.strategy.action === 'SELL' ? 'Sold' : 'Bought'} This?</h3>
                      <p style={{ margin: '0 0 16px', fontSize: '0.8rem', color: '#64748b' }}>Enter a quantity to see projected outcomes. No real trade is placed.</p>

                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: '600' }}>Quantity of shares</label>
                        <input
                          type="number"
                          min="1"
                          value={simQty}
                          onChange={e => setSimQty(e.target.value)}
                          placeholder="e.g. 10"
                          style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>

                      {qty > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                          {/* If target hit */}
                          <div style={{ padding: '14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px' }}>
                            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                              🎯 If Target Hit (₹{targetPrice.toLocaleString()})
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Projected Profit</span>
                              <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#10b981' }}>+₹{Math.abs(profitIfTarget).toLocaleString('en-IN', { maximumFractionDigits: 0 })} (+{Math.abs(pctTarget).toFixed(1)}%)</span>
                            </div>
                          </div>

                          {/* If stop-loss hit */}
                          <div style={{ padding: '14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px' }}>
                            <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                              🛑 If Stop-Loss Hit (₹{stopLoss?.toLocaleString()})
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Max Loss</span>
                              <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#ef4444' }}>-₹{Math.abs(lossIfStop).toLocaleString('en-IN', { maximumFractionDigits: 0 })} ({pctStop.toFixed(1)}%)</span>
                            </div>
                          </div>

                          {/* Risk/Reward ratio */}
                          {lossIfStop !== 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '8px' }}>
                              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Risk / Reward Ratio</span>
                              <span style={{ fontWeight: '700', color: '#a78bfa' }}>
                                1 : {Math.abs(profitIfTarget / lossIfStop).toFixed(2)}
                              </span>
                            </div>
                          )}

                          <p style={{ margin: 0, fontSize: '0.75rem', color: '#475569', fontStyle: 'italic', textAlign: 'center' }}>
                            These are projections only. No trade has been placed.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}

              {/* CTA — go to stock page to trade */}
              <div style={{ background: 'rgba(79,142,247,0.06)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ margin: '0 0 4px', fontWeight: '600', color: '#e2e8f0', fontSize: '0.95rem' }}>Ready to act on this analysis?</p>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>Head to the stock page to execute a buy or sell order.</p>
                </div>
                <button
                  onClick={handleGoToStock}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--accent-primary, #4f8ef7)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  <ExternalLink size={15} /> Go to {symbol}
                </button>
              </div>

              {/* Agent Dialogue */}
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0', marginBottom: '16px', fontSize: '1rem' }}><MessageSquare size={18} color="#a78bfa" /> Agent Dialogue</h3>
                {[
                  { icon: <Shield size={18} color="#cbd5e1" />, name: 'Risk Scoring Agent', sub: 'Evaluating volatility, drawdowns, and risk metrics', text: recommendation.risk?.rationale },
                  { icon: <Activity size={18} color="#cbd5e1" />, name: 'Sentiment Analysis Agent', sub: 'Analyzing momentum, RSI, and SMA crossovers', text: recommendation.sentiment?.rationale },
                  { icon: <TrendingUp size={18} color="#cbd5e1" />, name: 'Strategy Developer Agent', sub: 'Synthesizing insights into actionable strategy', text: recommendation.strategy?.rationale },
                ].map((agent, i) => (
                  <div key={i} style={{ ...S.card, marginBottom: '12px' }}>
                    <div style={S.agentRow}>
                      <div style={S.agentAvatar}>{agent.icon}</div>
                      <div style={{ flex: 1 }}>
                        <p style={S.agentName}>{agent.name}</p>
                        <p style={S.agentSub}>{agent.sub}</p>
                        <p style={S.agentText}>{agent.text || 'No analysis available.'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Conversation Log */}
              {Array.isArray(recommendation.conversation) && recommendation.conversation.length > 0 && (
                <div style={{ ...S.card, background: 'rgba(255,255,255,0.02)' }}>
                  <h3 style={{ fontSize: '0.9rem', color: '#e2e8f0', marginBottom: '12px' }}>Full Conversation Log</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {recommendation.conversation.map((msg, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#a78bfa' }}>{msg.agent?.replace('Agent', '').charAt(0)}</span>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>{msg.agent}</p>
                          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={S.footer}>
          <div style={S.footerText}>
            <p style={{ margin: '0 0 2px 0' }}>Based on analysis up to {new Date(currentSimulatedDate).toLocaleDateString()}</p>
            <p style={{ margin: 0, fontSize: '0.72rem' }}>AI recommendations are for informational purposes only. Not financial advice.</p>
          </div>
          <button onClick={onClose} style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Close</button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
