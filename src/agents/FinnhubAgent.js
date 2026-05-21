export default class FinnhubAgent {
  constructor(name) {
    this.name = name;
  }
  async getQuote(symbol) {
    // Dynamically import fetchQuote to avoid circular dependencies
    const { fetchQuote } = await import('../utils/finnhub');
    return await fetchQuote(symbol);
  }
}
