import { Landmark, BookOpen, PieChart, BarChart3, TrendingUp } from 'lucide-react';

export const LESSONS = [
  {
    id: 'stock-market-basics',
    icon: Landmark,
    title: 'The Stock Market Ecosystem',
    readTime: '4 min read',
    content: `
      ### The Core Concept
      At its most basic level, the stock market is simply a marketplace where ownership in businesses is bought and sold. When you buy a "share" or "stock," you are literally buying a fractional piece of a real, operating business like Reliance Industries or HDFC Bank.

      ### Why Do Companies Issue Stock?
      When a business wants to expand—build a new factory, hire thousands of engineers, or acquire a competitor—it needs capital. Instead of borrowing money from a bank (which requires paying high interest), the founders can sell a portion of their ownership to the public. This process is called an Initial Public Offering (IPO). Once public, those shares trade freely among investors on an exchange like the NSE (National Stock Exchange).

      ### How Do You Make Money?
      There are two primary ways investors make money from stocks:
      1. **Capital Appreciation:** You buy a share for ₹100. Over 5 years, the company grows its profits significantly. The market recognizes this growth, and other investors are now willing to pay ₹250 for that same share. You sell it, making a ₹150 profit.
      2. **Dividends:** Profitable companies often take a portion of their net income and distribute it directly to shareholders as cash. This is called a dividend. It provides a steady stream of passive income regardless of what the stock price is doing.

      ### The Golden Rule
      In the short term, the stock market is a "voting machine" driven by human emotion, news, and fear. But in the long term, it is a "weighing machine" driven entirely by corporate profits. If a company consistently grows its earnings, its stock price will eventually follow.
    `
  },
  {
    id: 'fundamental-analysis',
    icon: BookOpen,
    title: 'Valuing a Business (Fundamentals)',
    readTime: '6 min read',
    content: `
      ### Price vs Value
      Warren Buffett famously said, "Price is what you pay. Value is what you get." Just because a stock's price is going up doesn't mean it's a good investment. You must understand the underlying business fundamentals to determine if the stock is cheap or expensive.

      ### Key Metrics to Know
      - **P/E Ratio (Price-to-Earnings):** This tells you how much you are paying for ₹1 of the company's profit. If a stock trades at ₹100 and earns ₹5 per share, its P/E is 20. A very high P/E (like 100) means the stock is expensive, and the market expects massive future growth. A low P/E (like 10) might mean the stock is cheap, or the business is failing.
      - **ROE (Return on Equity):** This measures how efficiently management uses shareholders' money. If a company has an ROE of 20%, it generates ₹20 of profit for every ₹100 invested in it. Consistently high ROE is a hallmark of a great business.
      - **Debt-to-Equity:** This measures financial risk. A company with massive debt might go bankrupt during an economic downturn. Look for companies with low debt relative to their equity.

      ### The Moat Concept
      A fundamental investor looks for an "economic moat"—a competitive advantage that protects a company's profits from competitors. Moats can be brand power (Apple), network effects (Visa), or switching costs (Microsoft). A business with a strong moat can raise prices without losing customers.

      ### Putting it Together
      Before buying a stock, you should be able to answer: How does this company make money? Is revenue growing? Is debt manageable? Is the valuation reasonable? If you cannot answer these questions, you are gambling, not investing.
    `
  },
  {
    id: 'portfolio-diversification',
    icon: PieChart,
    title: 'Diversification & Risk Management',
    readTime: '5 min read',
    content: `
      ### The Only Free Lunch in Finance
      Investing heavily in a single stock is incredibly risky. If you put all your capital into a hot tech startup and it fails, your wealth is destroyed. Diversification is the strategy of spreading your capital across different assets to minimize the impact of any single failure.

      ### How to Diversify Properly
      True diversification isn't just owning 20 stocks; it's owning stocks that behave differently from one another. 
      - **Sector Diversification:** Don't buy 5 IT companies. Buy an IT company, a bank, a pharmaceutical firm, and a consumer goods manufacturer. If the tech sector crashes, your consumer goods stocks might hold steady.
      - **Size Diversification:** Mix large-cap companies (stable, slow growth) with mid-cap and small-cap companies (volatile, high growth).

      ### The Risk vs Reward Tradeoff
      The fundamental law of investing is that higher potential returns require taking on higher risk. Government bonds are virtually risk-free but offer low returns (~7%). Small-cap stocks can double your money in a year but can also drop 60%. 
      
      Your portfolio should match your "risk tolerance." If you are 25 years old with a stable job, you can afford to be aggressive because you have decades to recover from a crash. If you are 60 and retiring soon, your portfolio should prioritize capital preservation.

      ### Avoid Over-Diversification
      While diversification is crucial, owning 100 different stocks means you will likely just match the market average. A highly concentrated portfolio (5-10 stocks) maximizes returns but is incredibly risky. A balanced portfolio usually contains 15-25 carefully selected companies.
    `
  },
  {
    id: 'market-cycles',
    icon: BarChart3,
    title: 'Market Cycles: Bulls and Bears',
    readTime: '5 min read',
    content: `
      ### The Inevitable Rhythm
      The stock market does not move in a straight line. It moves in cycles driven by economic conditions and human psychology. Understanding these cycles prevents you from panicking at the worst possible times.

      ### The Bull Market
      A bull market occurs when the economy is strong, unemployment is low, and corporate profits are rising. Investor confidence is high, and stock prices trend upward for years. During the late stages of a bull market, greed takes over. People start buying stocks purely because prices are rising, leading to a "bubble."

      ### The Bear Market
      Eventually, the bubble bursts. A bear market is defined as a 20% or greater decline from recent highs. It is often triggered by rising interest rates, inflation, or a recession. Fear dominates, and investors sell stocks indiscriminately. 

      ### The Psychology of Cycles
      The greatest wealth is built during bear markets. When everyone else is panicking and selling, high-quality businesses go on "sale." As Baron Rothschild famously said, "Buy when there is blood in the streets." 
      
      Unfortunately, human nature makes us do the opposite: we buy at the peak of a bull market out of FOMO (Fear Of Missing Out) and sell at the bottom of a bear market out of panic. 

      ### Your Strategy
      Expect the market to crash by 30-50% a few times during your investing lifetime. It is a mathematical certainty. Your goal is not to predict the crash, but to survive it without selling your assets.
    `
  },
  {
    id: 'compounding',
    icon: TrendingUp,
    title: 'The Math of Wealth: Compounding',
    readTime: '4 min read',
    content: `
      ### The Eighth Wonder
      Albert Einstein supposedly called compound interest "the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it."
      
      Compounding happens when the returns on your investments start generating their own returns. 

      ### How It Works
      If you invest ₹1,00,000 at a 15% annual return:
      - **Year 1:** You make ₹15,000. Your total is ₹1,15,000.
      - **Year 2:** You don't just make 15% on your initial ₹1L. You make 15% on the ₹1.15L. That's ₹17,250 in profit.
      - **Year 10:** Your investment is worth ₹4,04,555.
      - **Year 20:** Your investment is worth ₹16,36,653.
      
      Notice the exponential curve. The vast majority of wealth is generated in the later years of compounding.

      ### The Importance of Time
      Because compounding is exponential, time is the most powerful weapon an investor has. A 25-year-old investing ₹10,000 a month will end up with significantly more wealth than a 40-year-old investing ₹30,000 a month by the time they both reach 60.

      ### Dividend Reinvestment
      When a company pays you a dividend, you can either spend it or reinvest it by buying more shares. Reinvesting dividends accelerates the compounding process drastically. Over a 30-year period, reinvested dividends can account for more than half of a portfolio's total return.
    `
  }
];
