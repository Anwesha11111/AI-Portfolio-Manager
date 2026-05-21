export default function AgentCard({ name, risk, analysis, sentiment, strategy }) {
  return (
    <article className="agent-card glass-panel">
      <div className="agent-card-header">
        <div>
          <p className="subtitle">AI Agent</p>
          <h2>{name}</h2>
        </div>
        <span className="badge badge-purple">Live Insight</span>
      </div>

      <div className="agent-card-section">
        <h3>Risk Pulse</h3>
        <p>{risk}</p>
      </div>
      <div className="agent-card-section">
        <h3>Strategic Analysis</h3>
        <p>{analysis}</p>
      </div>
      <div className="agent-card-section">
        <h3>Market Sentiment</h3>
        <p>{sentiment}</p>
      </div>
      <div className="agent-card-section">
        <h3>Action Plan</h3>
        <p>{strategy}</p>
      </div>
    </article>
  );
}
