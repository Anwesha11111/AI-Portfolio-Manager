import { useState } from 'react';
import { GraduationCap, ChevronRight, BookOpen, TrendingUp, PieChart, AlertTriangle, DollarSign, BarChart3, Shield, Landmark, ArrowDownUp, Banknote } from 'lucide-react';

const LESSONS = [
  {
    id: 'what-is-stock-market',
    icon: Landmark,
    title: 'What is the Stock Market?',
    color: '#3b82f6',
    content: `The stock market is a marketplace where buyers and sellers trade shares of publicly listed companies. When you buy a stock, you are purchasing a small piece of ownership in that company. Stock exchanges like the NSE (National Stock Exchange) and BSE (Bombay Stock Exchange) in India facilitate these trades. The price of a stock is determined by supply and demand — if more people want to buy a stock than sell it, the price goes up, and vice versa. Companies list their shares on stock exchanges through an Initial Public Offering (IPO) to raise capital for growth, and after that, shares trade freely among investors.`
  },
  {
    id: 'stocks-vs-shares',
    icon: ArrowDownUp,
    title: 'Stocks vs Shares vs Equity',
    color: '#8b5cf6',
    content: `These terms are often used interchangeably, but they have subtle differences. "Stock" refers to ownership in any company in general ("I invest in stocks"). "Shares" refers to the specific units of ownership in a particular company ("I own 100 shares of Infosys"). "Equity" is the broader term for ownership value — it represents the total value of shares issued by a company. When someone says they have equity in a company, they mean they own a portion of it. In practice, for everyday investing, you can treat these terms as nearly identical.`
  },
  {
    id: 'how-prices-move',
    icon: TrendingUp,
    title: 'How Do Stock Prices Move?',
    color: '#10b981',
    content: `Stock prices move based on supply and demand, which is influenced by many factors. Company earnings reports, new product launches, and management changes directly affect a stock's value. Broader economic factors like interest rates, inflation, GDP growth, and government policies also play a role. Market sentiment — the overall mood of investors — can cause prices to swing even without fundamental changes. Technical factors like trading volume and chart patterns also influence short-term price movements. Understanding that prices reflect collective human psychology is key to becoming a better investor.`
  },
  {
    id: 'dividends',
    icon: DollarSign,
    title: 'Dividends Explained',
    color: '#f59e0b',
    content: `A dividend is a portion of a company's profit that is distributed to its shareholders. Not all companies pay dividends — fast-growing companies like tech startups usually reinvest all profits back into the business. Established companies like ITC, Infosys, or Coal India regularly pay dividends. Dividends are typically paid quarterly or annually and are expressed as a percentage of the stock price (called "dividend yield"). For example, if a stock costs ₹100 and pays ₹5 annually in dividends, its dividend yield is 5%. Dividends provide passive income and are especially attractive for investors seeking stability and income rather than aggressive growth.`
  },
  {
    id: 'portfolio-diversification',
    icon: PieChart,
    title: 'Portfolio Diversification',
    color: '#ec4899',
    content: `Diversification means spreading your investments across different stocks, sectors, and asset types to reduce risk. The idea is simple: "Don't put all your eggs in one basket." If you invest all your money in one stock and it crashes, you lose everything. But if you spread it across banking, IT, pharma, and consumer goods sectors, a crash in one sector won't destroy your entire portfolio. A well-diversified portfolio typically holds 8-15 stocks across at least 4-5 different sectors. The key insight is that diversification reduces risk without necessarily reducing returns — it's one of the few "free lunches" in investing.`
  },
  {
    id: 'risk-reward',
    icon: Shield,
    title: 'Risk and Reward',
    color: '#6366f1',
    content: `In investing, risk and reward are fundamentally linked — higher potential returns always come with higher potential losses. Conservative investments like government bonds offer low but stable returns (6-8% annually). Blue-chip stocks like HDFC Bank or TCS offer moderate returns (12-18% annually) with moderate risk. Small-cap and speculative stocks can deliver 50-100%+ returns but can also lose 50-80% of their value. Your "risk tolerance" depends on your age, income stability, financial goals, and emotional temperament. Young investors with steady income can typically afford more risk because they have time to recover from losses.`
  },
  {
    id: 'bull-bear-markets',
    icon: BarChart3,
    title: 'Bull vs Bear Markets',
    color: '#14b8a6',
    content: `A "bull market" is a period when stock prices are generally rising (typically 20%+ from recent lows), investor confidence is high, and the economy is growing. A "bear market" is the opposite — prices falling 20%+ from recent highs, widespread pessimism, and economic contraction. Bull markets can last years (India's 2003-2008 bull run, or 2020-2021 post-COVID rally). Bear markets tend to be shorter but more intense (the 2008 financial crisis, March 2020 COVID crash). The key insight: bear markets are where long-term wealth is built, because you can buy quality stocks at discounted prices. Warren Buffett's famous advice: "Be fearful when others are greedy, and greedy when others are fearful."`
  },
  {
    id: 'recession',
    icon: AlertTriangle,
    title: 'What is a Recession?',
    color: '#ef4444',
    content: `A recession is a significant decline in economic activity lasting more than a few months, typically defined as two consecutive quarters of negative GDP growth. During recessions, companies earn less profit, unemployment rises, consumer spending drops, and stock markets usually fall. Famous recessions include the 2008 Global Financial Crisis (triggered by the US housing market collapse) and the 2020 COVID-19 recession (the shortest but sharpest in history). Recessions are a normal part of the economic cycle — they happen every 7-10 years on average. For investors, recessions create buying opportunities because stock prices drop below their true value. The key is to have cash reserves ready to deploy when markets are at their lowest.`
  },
  {
    id: 'fundamental-analysis',
    icon: BookOpen,
    title: 'Fundamental Analysis Basics',
    color: '#0ea5e9',
    content: `Fundamental analysis is the method of evaluating a stock by examining the company's financial health and business quality. Key metrics include: P/E Ratio (Price-to-Earnings) — how much you're paying per rupee of earnings (lower is generally cheaper). Revenue Growth — is the company's income increasing year over year? Debt-to-Equity — how much debt does the company carry relative to its value? (lower is safer). ROE (Return on Equity) — how efficiently does the company generate profit from shareholders' money? (higher is better). Free Cash Flow — how much actual cash does the company generate after expenses? Fundamental analysis helps you determine if a stock is overvalued, fairly valued, or undervalued relative to its true worth.`
  },
  {
    id: 'nifty50',
    icon: Banknote,
    title: 'Understanding the Nifty 50',
    color: '#a855f7',
    content: `The Nifty 50 is India's benchmark stock market index, managed by the National Stock Exchange (NSE). It represents the weighted average of 50 of the largest and most liquid Indian companies across 13 sectors. Companies in the Nifty 50 include Reliance Industries, TCS, HDFC Bank, Infosys, and ITC — they represent approximately 60% of the total market capitalization of all stocks listed on the NSE. The Nifty 50 is used as a barometer for the overall health of the Indian economy. If the Nifty is rising, it generally means the economy and corporate earnings are healthy. This simulator uses historical Nifty 50 data to let you practice investing with real market conditions from 2005-2023.`
  },
];

export default function Academy() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      <h2 style={{ marginBottom: '8px', fontSize: '2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <GraduationCap size={32} color="var(--accent-primary)" /> Academy
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        Master the fundamentals of the stock market before you start trading.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {LESSONS.map((lesson, index) => {
          const Icon = lesson.icon;
          const isExpanded = expandedId === lesson.id;

          return (
            <div 
              key={lesson.id}
              className="glass-panel"
              style={{ borderRadius: '12px', overflow: 'hidden', transition: 'all 0.3s', cursor: 'pointer' }}
              onClick={() => setExpandedId(isExpanded ? null : lesson.id)}
            >
              <div style={{ 
                padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px',
                borderLeft: `4px solid ${lesson.color}`
              }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '10px',
                  background: `${lesson.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Icon size={22} color={lesson.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lesson {index + 1}</span>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700' }}>{lesson.title}</h3>
                </div>
                <ChevronRight size={20} color="var(--text-muted)" style={{ transition: 'transform 0.3s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)' }} />
              </div>

              {isExpanded && (
                <div style={{ 
                  padding: '0 24px 24px 86px', 
                  animation: 'fadeInUp 0.3s ease forwards'
                }}>
                  <p style={{ color: 'var(--text-main)', lineHeight: '1.8', fontSize: '1rem', margin: 0 }}>
                    {lesson.content}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
