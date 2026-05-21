import { AgentBase } from './AgentBase';

export default class SimulationAgent extends AgentBase {
  constructor(name) {
    super(name);
  }
  // Placeholder for simulation related methods
  async simulate() {
    // future implementation: run simulations, manage state, etc.
    console.log(`SimulationAgent ${this.name} simulate called`);
    return true;
  }
}
