import { useEffect, useState } from 'react';
import AgentCard from '../components/AgentCard';
import useSimulationStore from '../store/useSimulationStore';

export default function AgentsDashboardPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || '';
  const { currentSimulatedDate } = useSimulationStore();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/ai/agents-analysis?date=${currentSimulatedDate}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Unable to load AI agent analysis.');
        setAgents(data.agents || []);
      } catch (err) {
        console.error('Agents analysis error:', err);
        setError(err.message || 'Unable to load AI agent analysis.');
        setAgents([
          {
            name: 'Risk AI',
            risk: 'Moderate risk detected based on portfolio volatility.',
            analysis: 'Diversification is good, but exposure to tech is high.',
            sentiment: 'Market sentiment is neutral with slight bullishness.',
            strategy: 'Consider rebalancing towards defensive sectors.'
          },
          {
            name: 'Analysis AI',
            risk: 'Low risk due to stable blue-chip holdings.',
            analysis: 'Strong fundamentals in core holdings.',
            sentiment: 'Positive sentiment for financials and FMCG.',
            strategy: 'Hold current positions, accumulate on dips.'
          },
          {
            name: 'Sentiment AI',
            risk: 'High risk from recent market swings.',
            analysis: 'Recent news increases uncertainty.',
            sentiment: 'Bearish sentiment detected in short term.',
            strategy: 'Tighten stop-losses and reduce leverage.'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [API_URL, currentSimulatedDate]);

  return (
    <div className="agents-dashboard-page">
      <section className="agents-hero glass-panel">
        <div className="hero-copy">
          <span className="badge badge-blue">Premium AI</span>
          <h1>AI Agents Command Center</h1>
          <p className="hero-description">Three specialized agents power risk, sentiment, and strategy insights across your portfolio.</p>
        </div>
        <div className="agents-summary-grid">
          <div className="agents-panel glass-panel">
            <p className="panel-label">Top Signal</p>
            <h2>Risk-aware intelligence</h2>
            <p>Secure the portfolio with AI-driven risk adjustments before you execute new trades.</p>
          </div>
          <div className="agents-panel glass-panel">
            <p className="panel-label">Market Pulse</p>
            <h2>Sentiment + Momentum</h2>
            <p>Monitor sentiment shifts and position strength across the simulated market environment.</p>
          </div>
          <div className="agents-panel glass-panel">
            <p className="panel-label">Strategic View</p>
            <h2>Action Plan</h2>
            <p>Receive practical guidance from each agent and compare decisions across advisory perspectives.</p>
          </div>
        </div>
      </section>

      {error && <div className="agents-error">{error}</div>}

      <div className="agents-card-grid">
        {loading ? (
          <div className="agents-loading">Loading agent analysis…</div>
        ) : (
          agents.map(agent => (
            <AgentCard
              key={agent.name}
              name={agent.name}
              risk={agent.risk}
              analysis={agent.analysis}
              sentiment={agent.sentiment}
              strategy={agent.strategy}
            />
          ))
        )}
      </div>
    </div>
  );
}
