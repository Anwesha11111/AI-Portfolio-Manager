# Requirements Document: Groq Multi-Agent AI Trading System

## Introduction

This document specifies the requirements for integrating a market-integrated Groq multi-agent AI system into the existing stock trading platform. The system consists of three specialized AI agents powered by Groq API (Llama 3.3-70b-versatile model) that work together to provide comprehensive investment analysis and recommendations. The agents evaluate risk metrics, analyze market sentiment, and synthesize these insights into actionable trading strategies. This feature enhances the platform's decision-support capabilities by providing AI-driven consultation for users on the Market Discovery page and enabling direct execution of agent-recommended trades.

## Glossary

- **Groq_API**: The Groq cloud API service providing access to Llama 3.3-70b-versatile language model for real-time inference
- **Risk_Scoring_Agent**: AI agent that evaluates asset risk metrics including volatility, drawdowns, and beta using historical market data
- **Sentiment_Analysis_Agent**: AI agent that evaluates short-term momentum, trend lines, RSI, and SMA crossovers to determine market sentiment
- **Strategy_Developer_Agent**: AI agent that consumes risk and sentiment reports to generate investment strategies with specific actions (BUY/SELL/HOLD) and risk parameters
- **Multi_Agent_Consultation**: The process of sequentially running all three agents and synthesizing their outputs into a unified recommendation
- **Fallback_Engine**: Local rule-based algorithmic system that generates recommendations when Groq API is unavailable
- **Consultation_Drawer**: Interactive UI modal/drawer on the Market Discovery page where users can request and view agent recommendations
- **Agent_Ratings_Badges**: Visual indicators on the watchlist and market listing showing Risk, Sentiment, and Strategy scores
- **Watchlist**: User's collection of tracked stocks with associated metrics and ratings
- **Portfolio**: User's current holdings and cash balance managed through Supabase
- **Simulation_Date**: The current date in the simulated trading environment (not real-time)
- **Historical_Market_Data**: OHLCV (Open, High, Low, Close, Volume) candle data for 50 NIFTY stocks stored in backend cache
- **Technical_Indicators**: Computed metrics including RSI(14), SMA(50), SMA(200), volatility, and price changes
- **Allocation_Target**: The recommended quantity and capital amount for a specific stock purchase
- **Stop_Loss**: The price level at which a position should be automatically or manually closed to limit losses
- **Target_Price**: The price level at which a position should be considered for profit-taking

## Requirements

### Requirement 1: Multi-Agent Consultation Endpoint

**User Story:** As a trader, I want to request AI analysis for a specific stock, so that I can receive comprehensive risk, sentiment, and strategy recommendations before making trading decisions.

#### Acceptance Criteria

1. WHEN a user requests multi-agent consultation for a stock symbol and simulation date, THE Multi_Agent_Consultation_System SHALL call the Groq API with a structured prompt containing the three agent roles
2. WHEN the Groq API is available and responds successfully, THE Multi_Agent_Consultation_System SHALL parse the JSON response and return risk score, sentiment score, strategy action, and agent dialogue
3. WHEN the Groq API is unavailable or returns an error, THE Multi_Agent_Consultation_System SHALL fall back to the Fallback_Engine and return algorithmic ratings with mock agent dialogue
4. WHEN the Multi_Agent_Consultation_System receives a request with missing symbol or date parameters, THE System SHALL return a 400 error with a descriptive message
5. WHEN the Multi_Agent_Consultation_System receives a request for a symbol with no historical data up to the simulation date, THE System SHALL return a 400 error indicating insufficient data
6. THE Multi_Agent_Consultation_System SHALL compute the response within 8 seconds for Groq API calls and within 1 second for fallback responses
7. THE Multi_Agent_Consultation_System SHALL include in the response: risk score (0-100), risk rating (Low/Medium/High), sentiment score (0-100), sentiment rating (Bearish/Neutral/Bullish), strategy action (BUY/SELL/HOLD), target price, stop-loss price, and rationale for each component

### Requirement 2: Risk Scoring Agent Analysis

**User Story:** As a risk-conscious investor, I want the Risk Scoring Agent to evaluate volatility, drawdowns, and historical stability, so that I can understand the downside risk of an asset.

#### Acceptance Criteria

1. WHEN the Risk_Scoring_Agent analyzes a stock, THE Agent SHALL calculate annualized volatility using the last 60 trading days of historical data
2. WHEN volatility is calculated, THE Agent SHALL map it to a risk score between 10 and 100 using the formula: risk_score = min(100, max(10, volatility_pct * 1.8))
3. WHEN the risk score is below 35, THE Agent SHALL assign a "Low" risk rating
4. WHEN the risk score is between 35 and 65, THE Agent SHALL assign a "Medium" risk rating
5. WHEN the risk score is above 65, THE Agent SHALL assign a "High" risk rating
6. WHEN historical data is insufficient (fewer than 10 candles), THE Agent SHALL use a default volatility of 20% and assign a "Medium" risk rating
7. THE Risk_Scoring_Agent SHALL provide a 2-sentence rationale explaining the volatility calculation and risk classification

### Requirement 3: Sentiment Analysis Agent Evaluation

**User Story:** As a momentum trader, I want the Sentiment Analysis Agent to evaluate RSI, SMA crossovers, and price trends, so that I can identify bullish or bearish market conditions.

#### Acceptance Criteria

1. WHEN the Sentiment_Analysis_Agent analyzes a stock, THE Agent SHALL retrieve the current RSI(14), SMA(50), and SMA(200) values from the latest candle
2. WHEN the current price is above SMA(50), THE Agent SHALL add 10 points to the base sentiment score of 50
3. WHEN the current price is below SMA(50), THE Agent SHALL subtract 10 points from the base sentiment score
4. WHEN the current price is above SMA(200), THE Agent SHALL add 10 points to the sentiment score
5. WHEN the current price is below SMA(200), THE Agent SHALL subtract 10 points from the sentiment score
6. WHEN RSI(14) is above 55, THE Agent SHALL add (RSI - 55) * 1.2 points to the sentiment score
7. WHEN RSI(14) is below 45, THE Agent SHALL subtract (45 - RSI) * 1.2 points from the sentiment score
8. WHEN the final sentiment score is 60 or above, THE Agent SHALL assign a "Bullish" rating
9. WHEN the final sentiment score is 40 or below, THE Agent SHALL assign a "Bearish" rating
10. WHEN the final sentiment score is between 40 and 60, THE Agent SHALL assign a "Neutral" rating
11. THE Sentiment_Analysis_Agent SHALL clamp the final sentiment score between 0 and 100
12. THE Sentiment_Analysis_Agent SHALL provide a 2-sentence rationale explaining the technical indicators and sentiment classification

### Requirement 4: Strategy Developer Agent Synthesis

**User Story:** As a strategic investor, I want the Strategy Developer Agent to synthesize risk and sentiment analysis into a specific action (BUY/SELL/HOLD) with entry/exit targets, so that I can execute trades with clear risk management parameters.

#### Acceptance Criteria

1. WHEN the Strategy_Developer_Agent receives Bullish sentiment and Low/Medium risk ratings, THE Agent SHALL recommend a "BUY" action
2. WHEN the Strategy_Developer_Agent receives Bullish sentiment and High risk rating, THE Agent SHALL recommend an "Aggressive BUY" action with a note to watch volatility
3. WHEN the Strategy_Developer_Agent receives Bearish sentiment, THE Agent SHALL recommend a "SELL" or "AVOID" action
4. WHEN the Strategy_Developer_Agent receives Neutral sentiment, THE Agent SHALL recommend a "HOLD" action
5. WHEN recommending a BUY action, THE Agent SHALL set target_price = current_price * 1.15 (15% upside target)
6. WHEN recommending a SELL action, THE Agent SHALL set target_price = current_price * 0.85 (15% downside target)
7. WHEN recommending a HOLD action, THE Agent SHALL set target_price = current_price (no directional target)
8. WHEN recommending a BUY action, THE Agent SHALL set stop_loss = current_price * 0.92 (8% downside protection)
9. WHEN recommending a SELL action, THE Agent SHALL set stop_loss = current_price * 1.05 (5% upside protection)
10. WHEN recommending a HOLD action, THE Agent SHALL set stop_loss = current_price * 0.90 (10% downside protection)
11. THE Strategy_Developer_Agent SHALL provide a 2-sentence rationale explaining the action, target price, and stop-loss logic

### Requirement 5: Groq API Integration with Fallback

**User Story:** As a platform operator, I want the system to use Groq API when available but gracefully fall back to algorithmic recommendations when the API is unavailable, so that users always receive recommendations regardless of external service status.

#### Acceptance Criteria

1. WHEN the Groq API key is configured in environment variables, THE System SHALL attempt to call the Groq API with the multi-agent prompt
2. WHEN the Groq API responds with a 200 status and valid JSON, THE System SHALL parse and return the AI-generated recommendations
3. WHEN the Groq API is not configured (missing GROQ_API_KEY), THE System SHALL immediately use the Fallback_Engine
4. WHEN the Groq API returns an error status (4xx, 5xx), THE System SHALL log the error and fall back to the Fallback_Engine
5. WHEN the Groq API times out (exceeds 8 seconds), THE System SHALL fall back to the Fallback_Engine
6. WHEN using the Fallback_Engine, THE System SHALL compute risk, sentiment, and strategy scores using the same algorithmic logic as the agents
7. WHEN using the Fallback_Engine, THE System SHALL generate mock agent dialogue that references the computed metrics and simulated date
8. THE Fallback_Engine SHALL return a response with the same JSON structure as the Groq API response for consistency
9. THE System SHALL include a "conversation" array in the response containing dialogue from all three agents (Risk, Sentiment, Strategy)

### Requirement 6: Consultation Drawer UI Component

**User Story:** As a user, I want to open an interactive consultation drawer on the Market Discovery page, so that I can request and view AI recommendations for stocks without leaving the market listing.

#### Acceptance Criteria

1. WHEN the user clicks the "AI Architect" button on the Market Discovery page, THE Consultation_Drawer SHALL open as a modal or side panel
2. WHEN the Consultation_Drawer is open, THE System SHALL display a description of the multi-agent consultation feature
3. WHEN the user clicks "Get Consultation" for a specific stock, THE System SHALL show a loading state with a spinner
4. WHEN the multi-agent consultation completes, THE Consultation_Drawer SHALL display the risk score, sentiment score, strategy action, target price, and stop-loss price
5. WHEN the Consultation_Drawer displays recommendations, THE System SHALL show the agent dialogue in a conversational format
6. WHEN the user clicks "Buy" on a recommendation, THE System SHALL execute the trade if sufficient funds are available
7. WHEN the user clicks "Buy Full Portfolio", THE System SHALL execute all recommended trades in sequence
8. WHEN a trade fails due to insufficient funds, THE System SHALL display an error message with the required amount and available balance
9. WHEN a trade succeeds, THE System SHALL update the user's portfolio and display a success message
10. THE Consultation_Drawer SHALL close when the user clicks the "Close" button or clicks outside the drawer

### Requirement 7: Agent Ratings Badges on Market Listing

**User Story:** As a trader browsing the market, I want to see Risk, Sentiment, and Strategy ratings for each stock, so that I can quickly identify promising opportunities without opening the consultation drawer.

#### Acceptance Criteria

1. WHEN the Market Discovery page loads, THE System SHALL fetch batch data including risk, sentiment, and strategy ratings for all 50 NIFTY stocks
2. WHEN displaying each stock in the market listing, THE System SHALL show three badges: Risk Rating, Sentiment Rating, and Strategy Action
3. WHEN the Risk Rating is "Low", THE Badge SHALL display in green with a low-risk icon
4. WHEN the Risk Rating is "Medium", THE Badge SHALL display in yellow with a medium-risk icon
5. WHEN the Risk Rating is "High", THE Badge SHALL display in red with a high-risk icon
6. WHEN the Sentiment Rating is "Bullish", THE Badge SHALL display in green with an upward trend icon
7. WHEN the Sentiment Rating is "Neutral", THE Badge SHALL display in gray with a neutral icon
8. WHEN the Sentiment Rating is "Bearish", THE Badge SHALL display in red with a downward trend icon
9. WHEN the Strategy Action is "BUY", THE Badge SHALL display in green with a buy icon
10. WHEN the Strategy Action is "SELL", THE Badge SHALL display in red with a sell icon
11. WHEN the Strategy Action is "HOLD", THE Badge SHALL display in yellow with a hold icon
12. WHEN the user hovers over a badge, THE System SHALL display a tooltip with the numeric score (0-100) and brief explanation

### Requirement 8: Watchlist Integration with Agent Ratings

**User Story:** As a portfolio manager, I want to see agent ratings on my watchlist, so that I can monitor recommended actions for my tracked stocks.

#### Acceptance Criteria

1. WHEN the user views their watchlist, THE System SHALL display Risk, Sentiment, and Strategy ratings for each watched stock
2. WHEN a stock's rating changes (e.g., from Neutral to Bullish), THE System SHALL update the badge in real-time or on next refresh
3. WHEN the user clicks on a stock in the watchlist, THE System SHALL navigate to the stock detail page with the latest agent ratings
4. WHEN the user clicks on an agent rating badge in the watchlist, THE System SHALL open the Consultation_Drawer with that stock's detailed analysis

### Requirement 9: Direct Trade Execution from Agent Recommendations

**User Story:** As a trader, I want to execute BUY/SELL trades directly from agent recommendations, so that I can quickly act on AI insights without manual order entry.

#### Acceptance Criteria

1. WHEN the user views a multi-agent recommendation with a "BUY" action, THE System SHALL display a "Buy" button with the recommended quantity and price
2. WHEN the user clicks the "Buy" button, THE System SHALL calculate the required capital (quantity × current_price)
3. WHEN the user's available balance is sufficient, THE System SHALL execute the trade and update the portfolio
4. WHEN the user's available balance is insufficient, THE System SHALL display an error message showing the shortfall
5. WHEN a trade is executed, THE System SHALL create a transaction record with symbol, type (BUY/SELL), quantity, price, and simulation date
6. WHEN a trade is executed, THE System SHALL update the user's holdings (create new holding or update existing quantity and average cost)
7. WHEN a trade is executed, THE System SHALL deduct the capital from the user's virtual balance
8. WHEN a trade is executed, THE System SHALL display a success message with trade details
9. WHEN the user clicks "Buy Full Portfolio", THE System SHALL execute all recommended trades in the order they appear
10. WHEN any trade in the portfolio fails, THE System SHALL stop execution and display which trade failed and why

### Requirement 10: API Contract and Response Format

**User Story:** As a backend developer, I want a well-defined API contract for the multi-agent endpoint, so that I can reliably integrate the AI system with the frontend and other services.

#### Acceptance Criteria

1. THE Multi_Agent_Consultation_Endpoint SHALL accept POST requests to `/api/ai/multiagent`
2. THE Request body SHALL include: symbol (string), date (integer timestamp in milliseconds)
3. THE Response body SHALL include:
   - symbol (string): The stock symbol analyzed
   - date (integer): The simulation date timestamp
   - risk (object): { score (0-100), rating (Low/Medium/High), rationale (string) }
   - sentiment (object): { score (0-100), rating (Bearish/Neutral/Bullish), rationale (string) }
   - strategy (object): { action (BUY/SELL/HOLD), targetPrice (number), stopLoss (number), rationale (string) }
   - conversation (array): Array of agent dialogue objects with { agent (string), message (string) }
4. WHEN the request is invalid, THE System SHALL return a 400 status with error message
5. WHEN the symbol is not found, THE System SHALL return a 404 status with error message
6. WHEN an internal error occurs, THE System SHALL return a 500 status with error message
7. THE Response JSON SHALL be valid and parseable by standard JSON parsers
8. THE Response SHALL be returned within 8 seconds for Groq API calls and 1 second for fallback

### Requirement 11: Historical Data Filtering by Simulation Date

**User Story:** As a simulation platform, I want to ensure agents only analyze data available up to the current simulation date, so that backtesting results are realistic and not influenced by future data.

#### Acceptance Criteria

1. WHEN the Multi_Agent_Consultation_System receives a simulation date, THE System SHALL filter historical data to include only candles with rawTimestamp <= simulation_date
2. WHEN calculating technical indicators (RSI, SMA, volatility), THE System SHALL use only the filtered historical data
3. WHEN the filtered data is empty or insufficient, THE System SHALL return an error indicating no data available up to the simulation date
4. WHEN the filtered data contains fewer than 10 candles, THE System SHALL use default values for technical indicators
5. THE System SHALL NOT include future price data in any calculations or recommendations

### Requirement 12: Error Handling and Edge Cases

**User Story:** As a platform operator, I want robust error handling for edge cases, so that the system remains stable and provides helpful feedback when issues occur.

#### Acceptance Criteria

1. WHEN a stock symbol is provided in any case (uppercase, lowercase, mixed), THE System SHALL normalize it to uppercase for lookup
2. WHEN historical data for a symbol is missing from the cache, THE System SHALL return a 404 error with a descriptive message
3. WHEN the simulation date is in the future (beyond available data), THE System SHALL use the latest available data and note this in the response
4. WHEN the Groq API returns malformed JSON, THE System SHALL log the error and fall back to the Fallback_Engine
5. WHEN the Groq API response is missing required fields, THE System SHALL log the error and fall back to the Fallback_Engine
6. WHEN the user requests consultation more than once per minute for the same stock, THE System SHALL allow it but log the frequency for monitoring
7. WHEN the Fallback_Engine is used, THE System SHALL include a note in the response indicating fallback mode was activated
8. WHEN a trade execution fails due to database error, THE System SHALL roll back any partial updates and return an error message

### Requirement 13: Performance and Scalability

**User Story:** As a platform operator, I want the multi-agent system to handle concurrent requests efficiently, so that multiple users can request consultations simultaneously without degradation.

#### Acceptance Criteria

1. THE Multi_Agent_Consultation_System SHALL handle at least 10 concurrent requests without timeout or error
2. THE Fallback_Engine response time SHALL be under 1 second for any stock
3. THE Groq API response time SHALL be under 8 seconds for any stock
4. THE Batch endpoint (`/api/market/batch`) SHALL return ratings for all 50 stocks within 5 seconds
5. THE Historical data cache SHALL be loaded into memory at server startup to avoid disk I/O during requests
6. THE System SHALL not make redundant API calls for the same stock within a 60-second window (optional caching)

### Requirement 14: Groq API Prompt Engineering

**User Story:** As an AI system designer, I want a well-structured prompt that guides the Groq API to generate consistent, high-quality multi-agent recommendations, so that users receive reliable and actionable insights.

#### Acceptance Criteria

1. THE Groq_API_Prompt SHALL define three distinct agent roles: Risk_Scoring_Agent, Sentiment_Analysis_Agent, and Strategy_Developer_Agent
2. THE Prompt SHALL include current stock metrics: symbol, price, volatility, RSI, SMA values, and 2-month performance
3. THE Prompt SHALL instruct the agents to run sequentially, with each agent building on the previous analysis
4. THE Prompt SHALL request a JSON response with specific fields: risk, sentiment, strategy, and conversation
5. THE Prompt SHALL include context about the simulated year and Indian stock market (Nifty 50)
6. THE Prompt SHALL use a low temperature (0.2) to encourage consistent, deterministic responses
7. THE Prompt SHALL request the response_format as JSON to ensure valid JSON output
8. THE Prompt SHALL include example metrics and expected output format to guide the model

### Requirement 15: Fallback Engine Algorithmic Logic

**User Story:** As a system architect, I want a deterministic fallback engine that mirrors the agent logic, so that users receive consistent recommendations whether Groq API is available or not.

#### Acceptance Criteria

1. THE Fallback_Engine SHALL compute risk score using the same formula as the Risk_Scoring_Agent
2. THE Fallback_Engine SHALL compute sentiment score using the same technical indicator logic as the Sentiment_Analysis_Agent
3. THE Fallback_Engine SHALL compute strategy action using the same decision logic as the Strategy_Developer_Agent
4. THE Fallback_Engine SHALL generate mock agent dialogue that references the computed metrics
5. THE Fallback_Engine SHALL include the simulated date in the dialogue to provide context
6. THE Fallback_Engine SHALL use the same JSON response structure as the Groq API for consistency
7. THE Fallback_Engine response SHALL be deterministic (same input always produces same output)

### Requirement 16: User Feedback and Recommendation Tracking

**User Story:** As a platform operator, I want to track which recommendations users follow and their outcomes, so that I can measure the effectiveness of the AI system and improve it over time.

#### Acceptance Criteria

1. WHEN a user executes a trade from an agent recommendation, THE System SHALL log the recommendation ID, action, and execution timestamp
2. WHEN a user executes a trade, THE System SHALL record the agent's target price and stop-loss for later comparison
3. WHEN a position is closed, THE System SHALL calculate the actual return vs. the agent's target price
4. THE System SHALL provide analytics showing recommendation accuracy and user adoption rates
5. THE System SHALL allow users to view their recommendation history and outcomes

### Requirement 17: Security and Input Validation

**User Story:** As a security-conscious platform, I want robust input validation and security measures, so that the system is protected against injection attacks and malicious input.

#### Acceptance Criteria

1. WHEN a user provides a stock symbol, THE System SHALL validate it against the list of known NIFTY 50 symbols
2. WHEN a user provides a simulation date, THE System SHALL validate it as a valid integer timestamp
3. WHEN the Groq API key is used, THE System SHALL ensure it is not logged or exposed in error messages
4. WHEN the System makes API calls to Groq, THE System SHALL use HTTPS and verify SSL certificates
5. THE System SHALL sanitize any user input before including it in API prompts or database queries
6. THE System SHALL implement rate limiting to prevent abuse of the multi-agent endpoint

### Requirement 18: Documentation and Developer Experience

**User Story:** As a developer integrating the multi-agent system, I want clear documentation and examples, so that I can quickly understand the API and implement client-side features.

#### Acceptance Criteria

1. THE System SHALL include API documentation with request/response examples
2. THE System SHALL include example curl commands for testing the multi-agent endpoint
3. THE System SHALL include TypeScript/JavaScript client code examples
4. THE System SHALL document the fallback behavior and when it is triggered
5. THE System SHALL document the technical indicator calculations and their thresholds
6. THE System SHALL include troubleshooting guide for common issues (missing API key, invalid symbol, etc.)

