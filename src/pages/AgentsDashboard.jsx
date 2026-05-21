import React from 'react';
import AgentDashboard from '../components/AgentDashboard';

export default function AgentsDashboardPage() {
  // Placeholder data for each agent
  const agents = [
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
  ];

  return (
    <div className="agents-dashboard-page">
      <h1>AI Agents Dashboard</h1>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {agents.map(agent => (
          <AgentDashboard
            key={agent.name}
            agentName={agent.name}
            risk={agent.risk}
            analysis={agent.analysis}
            sentiment={agent.sentiment}
            strategy={agent.strategy}
          />
        ))}
      </div>
    </div>
  );
}
