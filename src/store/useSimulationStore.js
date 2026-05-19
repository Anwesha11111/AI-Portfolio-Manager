import { create } from 'zustand';

// 2005-01-01 in timestamp
const START_DATE = new Date('2005-01-01').getTime();

const useSimulationStore = create((set, get) => ({
  // Core Time Engine
  currentSimulatedDate: START_DATE,
  isRunning: false,
  
  // 2 simulated months = 1 real world hour (approx 60 days per 3600 seconds)
  // Therefore, 1 simulated day = 60 seconds = 60000 ms.
  simulationSpeedMs: 60000,
  
  // User Profile
  virtualBalance: 1000000, // ₹10,00,000
  riskProfile: 'moderate', // conservative, moderate, aggressive
  
  // Actions
  toggleSimulation: () => set((state) => ({ isRunning: !state.isRunning })),
  
  setSimulationSpeed: (ms) => set({ simulationSpeedMs: ms }),
  
  advanceTime: (days = 1) => set((state) => {
    // 86400000 ms in a day
    const newDate = state.currentSimulatedDate + (days * 86400000);
    return { currentSimulatedDate: newDate };
  }),
  
  setRiskProfile: (profile) => set({ riskProfile: profile }),
}));

export default useSimulationStore;
