// src/agents/AgentBase.js
export class AgentBase {
  constructor(name) {
    this.name = name;
    this.handlers = {};
  }
  on(event, handler) {
    this.handlers[event] = handler;
  }
  emit(event, payload) {
    if (this.handlers[event]) {
      this.handlers[event](payload);
    }
  }
}
