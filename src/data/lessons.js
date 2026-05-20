import { Landmark, BookOpen, PieChart, BarChart3, TrendingUp, TrendingDown, ShieldCheck, Briefcase, Search } from 'lucide-react';

export const LESSONS = [
  {
    id: 'indian-market-ecosystem',
    icon: ShieldCheck,
    title: 'The Indian Market: NIFTY & SEBI',
    readTime: '6 min read',
    content: `
      ### Understanding the NIFTY 50
      When financial news channels say "The market is up today," they are usually referring to a benchmark index. In India, the most tracked index is the **NIFTY 50** (National Stock Exchange Fifty). 
      
      The NIFTY 50 tracks the behavior of the 50 largest and most liquid Indian companies. It is a "market-capitalization weighted" index. This means a massive company like Reliance Industries has a much higher impact on the index's movement than a smaller company like Apollo Hospitals. If the top 5 companies in the NIFTY 50 are doing well, the entire index will likely be green, even if the bottom 20 companies are falling.

      ### The Role of SEBI
      The stock market involves trillions of rupees, which naturally attracts manipulation and fraud. The **Securities and Exchange Board of India (SEBI)** is the regulatory body tasked with protecting retail investors. 
      
      SEBI enforces strict rules against:
      - **Insider Trading:** Buying or selling stock based on confidential company information before it is released to the public.
      - **Price Rigging:** Groups of operators artificially inflating a stock's price to trap retail investors (often called "Pump and Dump" schemes).
      
      Before trusting any broker, portfolio manager, or research analyst, you must ensure they are SEBI-registered.

      ### BSE SENSEX
      While NIFTY represents the National Stock Exchange, the **SENSEX** (Sensitivity Index) represents the Bombay Stock Exchange (BSE). The SENSEX tracks the 30 largest companies. Because the top companies in both indices overlap significantly, NIFTY and SENSEX generally move in the exact same direction.
    `
  },
  {
    id: 'stock-market-basics',
    icon: Landmark,
    title: 'The Stock Market Ecosystem',
    readTime: '6 min read',
    content: `
      ### The Core Concept of Equities
      At its most basic level, the stock market is a marketplace where ownership in businesses is bought and sold. When you buy a "share" or "stock," you are not just trading a ticker symbol on a screen—you are buying a fractional piece of a real, operating business. If you own 1 share of Reliance Industries, you own a tiny percentage of its refineries, telecom towers, and retail stores.

      ### The Mechanics of an IPO
      Why do companies issue stock in the first place? When a private business wants to expand aggressively—perhaps to build a massive new factory or acquire a global competitor—it needs capital. The founders could borrow money from a bank, but that requires paying high, rigid interest rates. 
      
      Instead, they can sell a portion of their ownership to the public in an **Initial Public Offering (IPO)**. They surrender some control and future profits, but in exchange, they receive a massive influx of debt-free cash. Once public, those shares trade freely among investors on an exchange like the **NSE (National Stock Exchange)** or **BSE (Bombay Stock Exchange)**.

      ### Two Avenues of Wealth Creation
      There are two primary ways investors make money from stocks:
      
      - **Capital Appreciation:** You buy a share for ₹1,000. Over 5 years, the company grows its profits significantly. The market recognizes this growth, and other investors are now willing to pay ₹2,500 for that same share. You sell it, making a ₹1,500 profit.
      - **Dividends:** Highly profitable, mature companies (like ITC or Coal India) often generate more cash than they know what to do with. Instead of hoarding it, they distribute a portion of their net income directly to shareholders as cash. This is called a dividend. It provides a steady stream of passive income regardless of market volatility.

      ### Voting Machine vs. Weighing Machine
      Benjamin Graham, the father of value investing, famously stated: *"In the short run, the market is a voting machine but in the long run, it is a weighing machine."*
      
      On any given day, a stock's price is driven by human emotion, news headlines, fear, and greed. But over a 10-year period, the stock's price is driven almost entirely by the company's ability to generate cash and grow its earnings. Your job as an investor is to ignore the voting and focus on the weighing.
    `
  },
  {
    id: 'compounding',
    icon: TrendingUp,
    title: 'The Math of Wealth: Compounding',
    readTime: '5 min read',
    content: `
      ### The Eighth Wonder of the World
      Albert Einstein supposedly called compound interest *"the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it."*
      
      Simple interest pays you returns only on your principal amount. **Compounding** happens when the returns on your investments start generating their own returns. It is the snowball effect applied to money.

      ### The Exponential Curve
      Let's look at the math. If you invest a lump sum of ₹1,00,000 at a realistic 15% annual return:
      
      - **Year 1:** You make ₹15,000 in profit. Your total portfolio is now ₹1,15,000.
      - **Year 2:** You don't just make 15% on your initial ₹1 Lakh. You make 15% on the new ₹1.15 Lakh. That's ₹17,250 in profit. Your total is ₹1,32,250.
      - **Year 10:** Your investment is worth ₹4,04,555.
      - **Year 20:** Your investment is worth ₹16,36,653.
      - **Year 30:** Your investment is worth ₹66,21,177.
      
      Notice the exponential nature of the curve. It took 10 years to make the first ₹3 Lakh in profit, but between Year 20 and Year 30, the portfolio grew by nearly ₹50 Lakhs doing absolutely nothing new. The vast majority of wealth is generated in the later years of compounding.

      ### The Ultimate Weapon: Time
      Because compounding is an exponential function, **time** is the most powerful weapon an investor possesses—far more powerful than a high salary. 
      
      A 25-year-old investing just ₹5,000 a month will end up with significantly more wealth by age 60 than a 40-year-old investing ₹25,000 a month, assuming identical returns. The 40-year-old can never buy back those 15 lost years of compounding.

      ### Dividend Reinvestment Programs (DRIP)
      When a company pays you a dividend, you have a choice: spend it on a nice dinner, or use it to buy more shares of that company. Reinvesting your dividends accelerates the compounding process drastically because you are constantly increasing the base number of shares that will generate future dividends. Over a multi-decade period, reinvested dividends can account for more than 50% of a portfolio's total return.
    `
  },
  {
    id: 'fundamental-analysis',
    icon: BookOpen,
    title: 'Valuing a Business (Fundamentals)',
    readTime: '8 min read',
    content: `
      ### Price vs Value
      Warren Buffett's golden rule is simple: *"Price is what you pay. Value is what you get."* Just because a stock's price is going up rapidly does not mean it is a good investment. You must understand the underlying business fundamentals to determine if you are buying a ₹100 bill for ₹80, or a ₹50 bill for ₹120.

      ### Core Valuation Metrics
      To analyze a company, you must look at its financial statements (Income Statement, Balance Sheet, Cash Flow Statement). Here are the most critical metrics:
      
      - **P/E Ratio (Price-to-Earnings):** This ratio tells you how much you are paying for ₹1 of the company's profit. Calculated as: \`Current Stock Price / Earnings Per Share\`. If a stock trades at ₹1,000 and earns ₹50 per share, its P/E is 20. A very high P/E (like 100) means the market expects massive future growth. A low P/E (like 10) might indicate a bargain, or a business in severe decline.
      - **ROE (Return on Equity):** This measures how efficiently management uses shareholders' capital to generate profit. Calculated as: \`Net Income / Shareholder's Equity\`. If a company has an ROE of 20%, it generates ₹20 of profit for every ₹100 invested in it. Consistently high ROE (15%+) without excessive debt is a hallmark of an elite business.
      - **Debt-to-Equity Ratio:** This measures financial risk and leverage. A company with massive debt might go bankrupt during an economic downturn because it cannot meet its interest payments. Look for companies with a D/E ratio of less than 1.0.
      - **Free Cash Flow (FCF):** Net income can be manipulated by accounting tricks. Free Cash Flow is the actual, hard cash left over after a company has paid all its expenses and capital expenditures (like buying new equipment). It is the truest measure of profitability.

      ### The Economic Moat
      A fundamental investor looks for an **"economic moat"**—a structural competitive advantage that protects a company's profits from competitors. 
      
      Moats come in several forms:
      - **Brand Power:** People willingly pay a premium for an Apple iPhone over an Android with similar specs.
      - **Network Effects:** A credit card network like Visa becomes more valuable to merchants as more consumers use it, and vice versa.
      - **Switching Costs:** Once an enterprise integrates Microsoft Azure or AWS into its infrastructure, the cost and headache of switching to a competitor is astronomically high.

      Before buying a stock, ask yourself: *Does this company have a moat? Is revenue growing? Is debt manageable? Is the P/E ratio reasonable compared to its peers?* If you cannot answer these questions, you are gambling, not investing.
    `
  },
  {
    id: 'case-study-reliance-hdfc',
    icon: Search,
    title: 'Case Study: Reliance vs HDFC Bank',
    readTime: '7 min read',
    content: `
      ### Analyzing the Giants
      To understand how different businesses behave in a portfolio, let's look at two of the heaviest lifters in the Indian stock market: Reliance Industries and HDFC Bank.

      ### Reliance Industries (The Growth Conglomerate)
      Reliance is not just an oil refinery company anymore. It is a massive conglomerate heavily invested in retail (Reliance Retail) and telecom (Jio). 
      
      - **The Catalyst:** When Reliance launched Jio in 2016, it disrupted the entire telecom sector, absorbing massive upfront capital costs but eventually capturing hundreds of millions of users.
      - **Stock Behavior:** Reliance often trades based on future growth expectations (like the expansion of Jio Financial Services or green energy). Its stock can remain stagnant for years while building infrastructure, followed by massive, rapid price breakouts when those investments start generating cash.

      ### HDFC Bank (The Stable Compounder)
      HDFC Bank operates in a completely different paradigm. As India's largest private sector bank, its business model revolves around borrowing money at low interest rates (from your savings accounts) and lending it out at higher rates (for home loans and credit cards).
      
      - **The Catalyst:** HDFC Bank's growth is directly tied to the growth of the Indian middle class and overall credit expansion in the country.
      - **Stock Behavior:** Unlike tech startups or conglomerates, HDFC Bank is valued for its strict asset quality and consistent 15-20% annual profit growth. It is often viewed as a "defensive" stock. During market panics, investors flock to HDFC Bank because of its massive cash reserves and stable dividend payouts.

      ### The Portfolio Lesson
      Holding both in a portfolio provides balance. Reliance offers aggressive capital appreciation through sector disruption, while HDFC Bank acts as a resilient anchor that steadily compounds wealth regardless of global economic shocks.
    `
  },
  {
    id: 'passive-investing-etfs',
    icon: Briefcase,
    title: 'Passive Investing & ETFs',
    readTime: '5 min read',
    content: `
      ### The Difficulty of Stock Picking
      Actively picking individual stocks is notoriously difficult. Statistics show that over a 10-year period, a vast majority of professional mutual fund managers fail to beat the benchmark index (like the NIFTY 50). If highly paid professionals struggle to win consistently, retail investors face a massive uphill battle.

      ### Enter the ETF
      An **Exchange Traded Fund (ETF)** solves this problem. Instead of trying to find the needle in the haystack, an ETF allows you to simply buy the entire haystack. 
      
      When you buy a single unit of a NIFTY 50 ETF (such as Nippon India Nifty BeES or SBI Nifty ETF), your money is automatically distributed across the top 50 largest companies in India in the exact proportion of their market weight.

      ### Why Indexing Wins
      - **Self-Cleansing:** The index automatically kicks out failing companies (e.g., Yes Bank in 2020) and replaces them with growing ones. You never have to manually monitor and rebalance your portfolio.
      - **Ultra-Low Cost:** Because ETFs are managed by algorithms rather than highly paid fund managers, the expense ratio is a fraction of a percent (often 0.05% vs 1.5% for active mutual funds).
      - **Guaranteed Market Returns:** While you will never "beat" the market with an index fund, you are mathematically guaranteed to earn the market's return, which historically doubles your money every 5 to 7 years in growing economies.
    `
  },
  {
    id: 'portfolio-diversification',
    icon: PieChart,
    title: 'Diversification & Risk Management',
    readTime: '7 min read',
    content: `
      ### The Only Free Lunch in Finance
      Investing heavily in a single stock is incredibly risky. If you put all your capital into a highly touted tech startup and it goes bankrupt, your wealth is permanently destroyed. **Diversification** is the strategy of spreading your capital across different, uncorrelated assets to minimize the impact of any single failure.

      ### Modern Portfolio Theory
      True diversification isn't just owning 20 different stocks; it's owning stocks that behave differently from one another under the same economic conditions. 
      
      - **Sector Diversification:** Do not fill your portfolio exclusively with IT companies. If global tech spending slows down, your entire portfolio will crash. Instead, balance an IT company with a major Bank, a Pharmaceutical firm, and a fast-moving consumer goods (FMCG) manufacturer. 
      - **Market Cap Diversification:** Mix large-cap companies (stable, slow growth, dividend-paying) with mid-cap and small-cap companies (volatile, high potential growth).
      - **Asset Class Diversification:** Equities (stocks) should be balanced with fixed-income assets like Government Bonds or Gold. When stocks crash, bonds and gold typically rise or hold steady, cushioning your fall.

      ### The Risk vs Reward Tradeoff
      The fundamental law of investing is that **higher potential returns require taking on higher risk.** 
      
      Government bonds are virtually risk-free but offer low returns (~7% annually), barely beating inflation. Small-cap stocks can double your money in a year, but they can also drop 60% in a month. 
      
      Your portfolio construction must match your **"risk tolerance."** 
      - If you are a 25-year-old with a stable job, you can afford a 90% Equity / 10% Debt portfolio. You have decades to ride out market crashes.
      - If you are 60 and retiring in two years, a market crash would wipe out your retirement fund. Your portfolio should be much more conservative, prioritizing capital preservation (e.g., 40% Equity / 60% Debt).

      ### The Danger of Over-Diversification
      While diversification is crucial, *"diworsification"* is a real threat. Owning 100 different stocks means you are essentially just buying the entire market, guaranteeing average returns while paying higher transaction fees. A balanced, actively managed portfolio usually contains 15-25 carefully selected, high-conviction companies.
    `
  },
  {
    id: 'market-cycles',
    icon: BarChart3,
    title: 'Market Cycles: Bulls and Bears',
    readTime: '6 min read',
    content: `
      ### The Inevitable Rhythm
      The stock market does not move in a straight line. It moves in cyclical waves driven by macroeconomic conditions, central bank policies, and extreme human psychology. Understanding these cycles is the only way to prevent yourself from panicking at the worst possible times.

      ### The Bull Market
      A **bull market** occurs when the economy is strong, unemployment is low, and corporate profits are rising. Investor confidence is incredibly high, and stock prices trend upward for years. 
      
      During the late stages of a bull market, euphoria and greed take over. People begin buying terrible companies purely because the prices are rising. Valuations stretch to absurd levels, creating a "bubble."

      ### The Bear Market & Recessions
      Eventually, the bubble bursts. A **bear market** is defined as a 20% or greater decline in major indices from their recent highs. It is often triggered by a catalyst: a spike in interest rates, runaway inflation, or a global crisis (like the 2008 Financial Crisis or the 2020 Pandemic).
      
      Fear completely dominates the market. Investors sell their stocks indiscriminately, regardless of whether the underlying company is actually struggling or not. 

      ### The Psychology of Wealth Creation
      The greatest generational wealth is built during severe bear markets. When everyone else is panicking and selling, high-quality, elite businesses go on a massive "sale." 
      
      As Baron Rothschild famously advised in the 18th century: *"Buy when there is blood in the streets, even if the blood is your own."* 
      
      Unfortunately, human nature makes us do the exact opposite: we buy at the absolute peak of a bull market out of FOMO (Fear Of Missing Out), and we sell at the rock bottom of a bear market out of terror. 

      ### Your Strategy
      Expect the market to crash by 30-50% at least 3 to 4 times during your investing lifetime. It is a mathematical certainty. Your goal is not to predict when the crash will happen, but to survive it without selling your assets, and ideally, having cash reserves ready to deploy when prices bottom out.
    `
  },
  {
    id: 'market-crashes',
    icon: TrendingDown,
    title: 'Surviving Market Crashes',
    readTime: '7 min read',
    content: `
      ### The Anatomy of a Market Crash
      A market crash is a sudden, dramatic decline of stock prices across a significant cross-section of a stock market. Unlike a simple "correction" (a drop of 10%), crashes usually involve sudden double-digit drops fueled by panic selling. 
      
      Historically, crashes are triggered by:
      - **Economic Bubbles:** When an asset's price rises far beyond its intrinsic value (e.g., the 2000 Dot-Com bubble).
      - **Systemic Financial Failure:** When core banking or financial institutions collapse, freezing global credit (e.g., the 2008 Financial Crisis).
      - **Black Swan Events:** Unpredictable, catastrophic world events that halt economic activity (e.g., the 2020 COVID-19 pandemic).

      ### The Psychology of Panic
      When the market drops 20% in a week, the instinctual human reaction is to sell everything to stop the bleeding. **This is usually the worst possible decision.**
      
      When you panic sell during a crash, you lock in your temporary "paper losses" and turn them into permanent, realized losses. You also guarantee that you will miss the subsequent recovery. Historically, the stock market's best single days of performance almost always occur *during* or immediately after brutal bear markets. Missing just a few of these top days can decimate your long-term returns.

      ### How to Stabilize Your Portfolio
      You cannot prevent a crash, but you can build a portfolio designed to survive one:
      
      1. **Diversification:** Don't put all your eggs in one sector. If the IT sector crashes, your FMCG (Fast-Moving Consumer Goods) and Pharma stocks might hold steady because people still buy toothpaste and medicine during a recession.
      2. **Cash Reserves (Dry Powder):** Always keep a portion of your wealth in cash or liquid assets. When the market crashes, high-quality businesses go on "sale." Having cash allows you to buy these incredible assets at a massive discount.
      3. **Defensive Stocks:** Companies with strong balance sheets, low debt, and consistent dividend payouts tend to fall much less than high-growth, speculative tech stocks during a panic.

      ### The "Buy the Dip" Opportunity
      Warren Buffett famously advises: *"Be fearful when others are greedy, and greedy when others are fearful."*
      
      A market crash is a wealth-transfer event. Weak, panicked investors sell their shares at dirt-cheap prices to disciplined, patient investors. If you hold strong companies that will survive the economic shock, the best strategy is often to hold firm, ignore the noise, and use your available capital to slowly accumulate more shares while they are cheap (a strategy known as Dollar-Cost Averaging).
    `
  },
  {
    id: 'candlestick-charts',
    icon: BarChart3,
    title: 'Reading Technicals: Candlestick Charts',
    readTime: '5 min read',
    content: `
      ### The Anatomy of a Candlestick
      While fundamental analysis tells you *what* to buy, technical analysis and charts tell you *when* to buy. The most common and powerful way to view stock price action is through a **Japanese Candlestick Chart**.
      
      Unlike a simple line graph that only shows the closing price, a single candlestick packs four critical pieces of information for a given timeframe (like one day): the **Open, High, Low,** and **Close** (OHLC).

      ![Candlestick Anatomy](/images/candlestick_anatomy.png)

      ### The Real Body
      The thick, colored part of the candle is called the **Real Body**. It represents the price difference between the opening and closing bell of the market.
      
      - **Bullish Candle (Green):** If the closing price is *higher* than the opening price, the bulls (buyers) won the day. The bottom of the body is the Open, and the top is the Close.
      - **Bearish Candle (Red):** If the closing price is *lower* than the opening price, the bears (sellers) won the day. The top of the body is the Open, and the bottom is the Close.

      ### The Wicks (Shadows)
      The thin lines extending above and below the body are called **Wicks** or **Shadows**. They show the extreme highs and lows the price reached during that day, regardless of where it eventually closed.
      
      - A long upper wick indicates that buyers pushed the price incredibly high, but sellers overwhelmed them and forced the price back down before the close.
      - A long lower wick indicates that sellers hammered the price down, but strong buyers stepped in at the bottom to rescue the stock, pushing it back up.

      ### Why Candlesticks Matter
      Candlesticks visualize the battle between buyers and sellers. By looking at the size of the body and the length of the wicks over consecutive days, experienced traders can identify momentum shifts, panic selling, or aggressive institutional buying before the fundamentals even change.
    `
  },
  {
    id: 'technical-indicators-rsi',
    icon: Activity,
    title: 'Technical Indicators: RSI & Volume',
    readTime: '6 min read',
    content: `
      ### The Relative Strength Index (RSI)
      While moving averages show the direction of a trend, the **RSI** measures the speed and momentum of that price movement. It is an oscillator that fluctuates between 0 and 100.

      - **Overbought (Above 70):** When the RSI crosses above 70, it suggests the stock has been bought too aggressively. It is considered "overbought" and may be due for a short-term pullback or correction. 
      - **Oversold (Below 30):** When the RSI drops below 30, the stock has been heavily dumped. This indicates panic selling and is often viewed by traders as a potential buying opportunity.
      - **The 50 Line:** The midpoint (50) is often used as a trend confirmation tool. An RSI consistently above 50 indicates a bullish trend, while below 50 indicates a bearish trend.

      ![RSI Indicator Chart](/images/rsi_chart.png)

      ### RSI Divergence
      The most powerful signal the RSI generates is **Divergence**. 
      - **Bullish Divergence** occurs when the stock price makes a *lower low*, but the RSI makes a *higher low*. This means the downward momentum is dying, even though the price is falling. A reversal to the upside is likely.
      - **Bearish Divergence** occurs when the price makes a *higher high*, but the RSI makes a *lower high*. The upward momentum is fading, signaling a potential drop.

      ### The Importance of Volume
      Indicators like RSI are useless without **Volume** (the number of shares traded during a given period). Volume acts as the lie detector of the stock market.
      
      - If a stock breaks out to a new high, but the volume is incredibly low, it is likely a "fakeout." There is no institutional conviction behind the move.
      - If a stock breaks out on massive, higher-than-average volume, the move is validated. Large funds and institutions are actively buying the asset.
      
      Always use volume to confirm the signals generated by your RSI and candlestick charts.
    `
  }
];
