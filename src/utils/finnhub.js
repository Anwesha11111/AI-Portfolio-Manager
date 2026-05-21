/**
 * Helper for Finnhub API calls.
 * Requires VITE_FINNHUB_API_KEY in the .env file.
 */
const BASE_URL = "https://finnhub.io/api/v1";

export async function fetchQuote(symbol) {
  const key = import.meta.env.VITE_FINNHUB_API_KEY;
  const res = await fetch(`${BASE_URL}/quote?symbol=${symbol}&token=${key}`);
  if (!res.ok) throw new Error(`Finnhub quote error: ${res.status}`);
  return await res.json(); // {c: current, d: change, dp: percent, h: high, l: low, o: open, pc: previousClose, v: volume }
}
