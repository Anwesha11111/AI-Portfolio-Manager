import { create } from 'zustand';
import { supabase } from '../lib/supabase';

// 2005-01-01 in timestamp
const START_DATE = new Date('2005-01-01').getTime();
const END_DATE = new Date('2023-12-31').getTime();

const useSimulationStore = create((set, get) => ({
  // Core Time Engine
  currentSimulatedDate: START_DATE,
  isRunning: false,
  initialized: false,
  
  simulationSpeedMs: 60000,
  
  // Actions
  toggleSimulation: () => set((state) => ({ isRunning: !state.isRunning })),
  
  setSimulationSpeed: (ms) => set({ simulationSpeedMs: ms }),
  
  advanceTime: (days = 1) => set((state) => {
    const newDate = state.currentSimulatedDate + (days * 86400000);
    // Don't go past end date
    if (newDate > END_DATE) {
      return { currentSimulatedDate: END_DATE, isRunning: false };
    }
    return { currentSimulatedDate: newDate };
  }),
  
  setSimulatedDate: (dateString) => {
    const timestamp = new Date(dateString).getTime();
    if (isNaN(timestamp) || timestamp < START_DATE || timestamp > END_DATE) return;
    set({ currentSimulatedDate: timestamp });
    // Immediately persist so the date survives page refresh
    get().saveDate();
  },

  // Load saved date from Supabase
  loadSavedDate: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('users').select('current_simulated_date').eq('id', user.id).maybeSingle();
      if (data && data.current_simulated_date && data.current_simulated_date > START_DATE) {
        set({ currentSimulatedDate: data.current_simulated_date, initialized: true });
      } else {
        set({ initialized: true });
      }
    } catch (err) {
      console.error('Failed to load saved date:', err);
      set({ initialized: true });
    }
  },

  // Save current date to Supabase (called periodically)
  saveDate: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from('users').update({ 
        current_simulated_date: get().currentSimulatedDate 
      }).eq('id', user.id);
    } catch (err) {
      console.error('Failed to save date:', err);
    }
  },
  // Market Data Cache to prevent duplicate requests
  marketDataCache: {},
  fetchMarketData: async (timeframe = '1M') => {
    const simDate = get().currentSimulatedDate;
    const cacheKey = `${simDate}-${timeframe}`;
    
    // Return cached data if available for this specific date and timeframe
    if (get().marketDataCache[cacheKey]) {
      return get().marketDataCache[cacheKey];
    }
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/market/batch?date=${simDate}&timeframe=${timeframe}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        set((state) => ({
          marketDataCache: { ...state.marketDataCache, [cacheKey]: data }
        }));
        return data;
      }
      return [];
    } catch (err) {
      console.error("Failed to fetch market data:", err);
      return [];
    }
  },
}));

export default useSimulationStore;
