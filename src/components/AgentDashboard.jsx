import React from 'react';

export default function AgentDashboard({ agentName, risk, analysis, sentiment, strategy }) {
  return (
    <div className="agent-dashboard">
      <h2>{agentName} Dashboard</h2>
      <div className="dashboard-section">
        <h3>Risk</h3>
        <p>{risk}</p>
      </div>
      <div className="dashboard-section">
        <h3>Analysis</h3>
        <p>{analysis}</p>
      </div>
      <div className="dashboard-section">
        <h3>Sentiment Analysis</h3>
        <p>{sentiment}</p>
      </div>
      <div className="dashboard-section">
        <h3>Strategy</h3>
        <p>{strategy}</p>
      </div>
    </div>
  );
}
