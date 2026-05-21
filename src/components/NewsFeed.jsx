import { getGlobalNews, getStockNews, getSentimentBadge } from '../data/marketNews';

export function GlobalNewsFeed({ simulatedTimestamp }) {
  const news = getGlobalNews(simulatedTimestamp);
  if (news.length === 0) return null;
  return (
    <div className="glass-panel" style={{ padding: '20px 24px', borderRadius: '16px', marginBottom: '24px' }}>
      <h4 style={{ margin: '0 0 14px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>📰 Market News</h4>
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
        {news.map((n, i) => {
          const badge = getSentimentBadge(n.sentiment);
          return (
            <div key={i} style={{ minWidth: '260px', flex: '0 0 auto', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(n.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span style={{ fontSize: '0.72rem', fontWeight: '600', padding: '2px 8px', borderRadius: '999px', color: badge.color, background: badge.bg }}>{badge.icon} {badge.text}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: '600', lineHeight: '1.4', color: 'var(--text-main)' }}>{n.headline}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function StockNewsFeed({ ticker, simulatedTimestamp }) {
  const news = getStockNews(ticker, simulatedTimestamp);
  return (
    <div className="glass-panel animate-fade-in-up" style={{ padding: '24px', borderRadius: '16px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem' }}>📰 Company News</h3>
      {news.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No company-specific news near this date.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {news.map((n, i) => {
            const badge = getSentimentBadge(n.sentiment);
            return (
              <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(n.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: '600', padding: '2px 8px', borderRadius: '999px', color: badge.color, background: badge.bg }}>{badge.icon} {badge.text}</span>
                </div>
                <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '0.95rem' }}>{n.headline}</p>
                {n.summary && <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{n.summary}</p>}
              </div>
            );
          })}
        </div>
      )}
      <div style={{ marginTop: '16px', padding: '14px 16px', background: 'rgba(79,142,247,0.06)', borderRadius: '10px', border: '1px solid rgba(79,142,247,0.15)', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
        💡 Corporate cost events like large-scale layoffs typically reduce operating expenses and can positively impact EPS in subsequent quarters — watch the next quarterly result.
      </div>
    </div>
  );
}
