# Implementation Plan: Groq Multi-Agent AI Trading System

## Overview

This implementation plan breaks down the Groq multi-agent AI trading system into sequential, manageable tasks. The system will provide AI-driven investment analysis through three specialized agents (Risk Scoring, Sentiment Analysis, Strategy Development) integrated into the existing stock trading platform.

**Implementation Language**: JavaScript (Node.js backend, React frontend)

## Tasks

### Phase 1: Backend Infrastructure & Technical Indicators

- [x] 1. Create technical indicator utility functions
  - Create `backend/utils/technicalIndicators.js` with functions for RSI(14), SMA(50), SMA(200), volatility, and price change calculations
  - Implement RSI using Wilder's smoothing method with 14-period default
  - Implement SMA as simple arithmetic mean of closing prices
  - Implement volatility as annualized standard deviation (sqrt(variance) * sqrt(252))
  - Add helper function to calculate daily returns from price series
  - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

  - [ ]* 1.1 Write unit tests for technical indicator calculations
    - Test RSI calculation with known values
    - Test SMA calculation with edge cases (insufficient data)
    - Test volatility calculation with various price series
    - Test price change calculation
    - _Requirements: 2.1, 3.1_

- [x] 2. Implement fallback engine with algorithmic agent logic
  - Create `backend/utils/fallbackEngine.js` with deterministic recommendation generation
  - Implement risk scoring: volatility * 1.8, clamped to [10, 100], with Low/Medium/High ratings
  - Implement sentiment scoring: base 50 + technical indicator adjustments, clamped to [0, 100], with Bearish/Neutral/Bullish ratings
  - Implement strategy decision logic: BUY (bullish + low/medium risk), SELL (bearish), HOLD (neutral)
  - Calculate target price (BUY: +15%, SELL: -15%, HOLD: current) and stop-loss (BUY: -8%, SELL: +5%, HOLD: -10%)
  - Generate mock agent dialogue referencing computed metrics and simulated date
  - _Requirements: 1.3, 1.7, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7_

  - [ ]* 2.1 Write unit tests for fallback engine
    - Test risk score calculation and rating assignment
    - Test sentiment score calculation with various technical indicator combinations
    - Test strategy action selection logic
    - Test determinism: same input produces same output
    - Test target price and stop-loss calculations
    - _Requirements: 15.1, 15.7_

- [x] 3. Set up Groq API integration layer
  - Create `backend/utils/groqClient.js` with Groq API client
  - Implement function to call Groq API with multi-agent prompt
  - Use Llama 3.3-70b-versatile model with JSON response format
  - Set temperature to 0.2 for consistency
  - Implement 8-second timeout with error handling
  - Parse JSON response and validate required fields (risk, sentiment, strategy, conversation)
  - _Requirements: 1.1, 1.2, 5.1, 5.2, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8_

  - [ ]* 3.1 Write unit tests for Groq API integration
    - Mock Groq API responses and test parsing
    - Test error handling for API failures
    - Test timeout handling
    - Test JSON validation
    - _Requirements: 1.2, 5.2_

### Phase 2: Multi-Agent Consultation Endpoint

- [x] 4. Create POST /api/ai/multiagent endpoint
  - Create `backend/routes/aiRoutes.js` with multi-agent endpoint
  - Validate request: symbol (string), date (integer timestamp)
  - Normalize symbol to uppercase
  - Filter historical data to include only candles with rawTimestamp <= simulation_date
  - Return 400 error if symbol not found or no data available up to simulation date
  - Calculate technical indicators (RSI, SMA, volatility) from filtered data
  - Attempt Groq API call with structured prompt containing all three agent roles
  - On Groq success: parse and return AI-generated recommendations
  - On Groq failure/timeout/unavailable: fall back to algorithmic engine
  - Return 400 for missing/invalid parameters, 404 for missing symbol, 500 for internal errors
  - Ensure response includes: symbol, date, risk (score/rating/rationale), sentiment (score/rating/rationale), strategy (action/targetPrice/stopLoss/rationale), conversation array
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 11.1, 11.2, 11.3, 11.4, 11.5, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8_

  - [ ]* 4.1 Write integration tests for multi-agent endpoint
    - Test successful Groq API call and response parsing
    - Test fallback to algorithmic engine when Groq unavailable
    - Test error handling for missing symbol/date
    - Test data filtering by simulation date
    - Test response structure and required fields
    - _Requirements: 1.1, 1.2, 1.3, 1.7, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8_

- [x] 5. Checkpoint - Ensure backend API works correctly
  - Test endpoint with curl or Postman for various stocks and dates
  - Verify Groq API integration (if key configured) or fallback engine activation
  - Verify response structure matches specification
  - Ensure all tests pass, ask the user if questions arise.

### Phase 3: Frontend Components

- [x] 6. Create Consultation Drawer component
  - Create `src/components/ConsultationDrawer.jsx` as modal/drawer overlay
  - Display feature description and "Get Consultation" button
  - Show loading spinner during API call
  - Display risk score badge (0-100) with Low/Medium/High rating and color coding
  - Display sentiment score badge (0-100) with Bearish/Neutral/Bullish rating and color coding
  - Display strategy action badge (BUY/SELL/HOLD) with color coding
  - Show target price and stop-loss price
  - Display agent dialogue in conversational format (RiskAgent → SentimentAgent → StrategyAgent)
  - Implement "Buy" button for single trade execution
  - Implement "Buy Full Portfolio" button for batch execution
  - Handle trade execution errors (insufficient funds) with user-friendly messages
  - Implement close button and click-outside-to-close functionality
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10_

  - [ ]* 6.1 Write component tests for Consultation Drawer
    - Test rendering of loading state
    - Test rendering of recommendation display
    - Test badge color coding for different ratings
    - Test button click handlers
    - Test error message display
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 7. Create Rating Badges component
  - Create `src/components/RatingBadges.jsx` for displaying risk/sentiment/strategy ratings
  - Implement Risk badge: Green (Low), Yellow (Medium), Red (High) with icon
  - Implement Sentiment badge: Green (Bullish), Gray (Neutral), Red (Bearish) with icon
  - Implement Strategy badge: Green (BUY), Yellow (HOLD), Red (SELL) with icon
  - Add tooltip on hover showing numeric score (0-100) and brief explanation
  - Make component reusable for market listing and watchlist pages
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 7.11, 7.12_

  - [ ]* 7.1 Write component tests for Rating Badges
    - Test badge rendering for all rating combinations
    - Test color coding correctness
    - Test tooltip display on hover
    - Test accessibility (ARIA labels)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 7.11, 7.12_

### Phase 4: Integration & Market Page Updates

- [x] 8. Integrate Consultation Drawer into Market.jsx
  - Update `src/pages/Market.jsx` to include Consultation Drawer component
  - Add "AI Architect" button to controls bar (already exists in code)
  - Wire button click to open/close Consultation Drawer
  - Pass current stock symbol and simulation date to drawer
  - Ensure drawer opens as modal overlay without blocking market listing
  - Test drawer integration with existing Market page functionality
  - _Requirements: 6.1, 6.2, 6.3, 6.6, 6.7, 6.8, 6.9, 6.10_

- [x] 9. Add Rating Badges to market listing
  - Update market listing rows in Market.jsx to display Rating Badges for each stock
  - Fetch batch ratings from `/api/market/batch` endpoint (already exists)
  - Display risk, sentiment, and strategy badges for each stock
  - Ensure badges are clickable to open Consultation Drawer for that stock
  - Add loading state while badges are being fetched
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 7.11, 7.12, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.10, 8.11, 8.12_

- [x] 10. Implement trade execution from recommendations
  - Create `src/utils/tradeExecution.js` with trade execution logic
  - Implement function to calculate required capital (quantity × current_price)
  - Implement function to check user balance sufficiency
  - Implement function to execute trade via Supabase (insert transaction, update holdings, update balance)
  - Handle error cases: insufficient funds, database errors
  - Return success/error status with message
  - Ensure atomic execution: all updates succeed or all fail (no partial updates)
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10_

  - [ ]* 10.1 Write unit tests for trade execution logic
    - Test capital calculation
    - Test balance checking
    - Test successful trade execution
    - Test insufficient funds error
    - Test database error handling
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10_

- [x] 11. Wire trade execution to Consultation Drawer
  - Update ConsultationDrawer to call trade execution function on "Buy" button click
  - Update ConsultationDrawer to call trade execution in sequence for "Buy Full Portfolio"
  - Display success message with trade details after execution
  - Display error message with required amount and available balance on failure
  - Update portfolio display after successful trade
  - _Requirements: 6.6, 6.7, 6.8, 6.9, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10_

- [x] 12. Checkpoint - Ensure frontend integration works correctly
  - Test Consultation Drawer opens/closes correctly
  - Test "Get Consultation" button fetches recommendations
  - Test Rating Badges display correctly on market listing
  - Test trade execution from recommendations
  - Test error handling (insufficient funds, API errors)
  - Ensure all tests pass, ask the user if questions arise.

### Phase 5: Watchlist Integration

- [x] 13. Add Rating Badges to watchlist
  - Update watchlist display to show Risk, Sentiment, and Strategy ratings for each watched stock
  - Fetch ratings from `/api/market/batch` endpoint
  - Display badges with same styling as market listing
  - Make badges clickable to open Consultation Drawer
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 14. Implement real-time rating updates on watchlist
  - Add mechanism to refresh ratings on watchlist (on page load or periodic refresh)
  - Update badges when ratings change
  - Display loading state during refresh
  - _Requirements: 8.2_

### Phase 6: Error Handling & Edge Cases

- [x] 15. Implement comprehensive error handling
  - Add input validation for symbol (must be in NIFTY 50 list)
  - Add input validation for date (must be valid integer timestamp)
  - Normalize symbol to uppercase for all lookups
  - Handle missing historical data gracefully (return 404 with descriptive message)
  - Handle future simulation dates (use latest available data and note in response)
  - Handle malformed Groq API responses (log error and fall back to algorithmic engine)
  - Handle missing required fields in Groq response (log error and fall back)
  - Handle database errors in trade execution (rollback and return error message)
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 17.1, 17.2, 17.3, 17.4, 17.5, 17.6_

  - [ ]* 15.1 Write tests for error handling and edge cases
    - Test invalid symbol handling
    - Test invalid date handling
    - Test missing data handling
    - Test future date handling
    - Test malformed API response handling
    - Test database error handling
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8_

### Phase 7: Performance & Optimization

- [x] 16. Optimize backend performance
  - Ensure historical data cache is loaded at server startup (already implemented)
  - Verify technical indicators are pre-calculated and cached in data
  - Implement optional response caching for same stock within 60-second window
  - Add performance monitoring: log response times for Groq API and fallback engine
  - Verify batch endpoint returns all 50 stocks within 5 seconds
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

- [x] 17. Implement rate limiting and security measures
  - Add rate limiting to `/api/ai/multiagent` endpoint (e.g., 10 requests per minute per user)
  - Validate symbol against known NIFTY 50 list before processing
  - Ensure GROQ_API_KEY is never logged or exposed in error messages
  - Verify all external API calls use HTTPS with SSL verification
  - Sanitize agent dialogue before rendering in frontend
  - _Requirements: 13.6, 17.1, 17.2, 17.3, 17.4, 17.5, 17.6_

### Phase 8: Testing & Verification

- [x] 18. Write end-to-end tests
  - Test full workflow: request consultation → receive recommendation → execute trade → update portfolio
  - Test error scenarios: missing data, API failures, insufficient funds
  - Test concurrent requests (10+ simultaneous requests)
  - Test fallback engine activation when Groq unavailable
  - Test data filtering by simulation date (no future data leaks)
  - _Requirements: 1.1, 1.2, 1.3, 1.6, 1.7, 11.1, 11.2, 11.3, 11.4, 11.5, 13.1, 13.2, 13.3_

  - [ ]* 18.1 Write integration tests for complete workflow
    - Test consultation request → recommendation → trade execution
    - Test error handling in each step
    - Test portfolio updates after trade
    - Test concurrent request handling
    - _Requirements: 1.1, 1.2, 1.3, 1.6, 1.7, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10_

- [x] 19. Verify API contract compliance
  - Verify endpoint accepts POST requests to `/api/ai/multiagent`
  - Verify request body includes symbol and date
  - Verify response body includes all required fields: symbol, date, risk, sentiment, strategy, conversation
  - Verify response status codes: 200 (success), 400 (invalid input), 404 (not found), 500 (error)
  - Verify response JSON is valid and parseable
  - Verify response time: < 8 seconds for Groq, < 1 second for fallback
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 1.6_

- [x] 20. Final checkpoint - Ensure all components work together
  - Run full test suite (unit, integration, end-to-end)
  - Test with multiple stocks and dates
  - Test with Groq API available and unavailable
  - Verify performance metrics (response times, concurrent requests)
  - Verify error handling for all edge cases
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints (tasks 5, 12, 20) ensure incremental validation
- Technical indicators are pre-calculated in historical data (no need to recalculate)
- Fallback engine ensures system works without Groq API
- Trade execution uses existing Supabase integration
- All timestamps are in milliseconds (JavaScript standard)
- Simulation date filtering prevents future data leaks
