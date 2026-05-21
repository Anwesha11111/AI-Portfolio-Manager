import React from 'react';

export default function AiDisclaimer() {
  return (
    <div style={{ marginTop: '16px', padding: '12px 14px', borderRadius: '10px', background: 'rgba(230,230,230,0.06)', border: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
      <strong style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '6px' }}>AI insights are for educational purposes only and do not constitute financial advice.</strong>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Always assess your own risk tolerance and verify with independent research before making decisions.</span>
    </div>
  );
}
