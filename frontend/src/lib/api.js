import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Portfolio endpoints
export const portfolioAPI = {
  getOverview: () => api.get('/api/portfolio/overview'),
  getPerformance: () => api.get('/api/portfolio/performance'),
  getAllocation: () => api.get('/api/portfolio/allocation'),
  updateConstraints: (data) => api.post('/api/portfolio/constraints', data),
};

// Risk endpoints
export const riskAPI = {
  getMetrics: () => api.get('/api/risk/metrics'),
  getVaR: () => api.get('/api/risk/var'),
  getDrawdown: () => api.get('/api/risk/drawdown'),
};

// Trading endpoints
export const tradingAPI = {
  getSignals: () => api.get('/api/trading/signals'),
  getTrades: () => api.get('/api/trading/trades'),
  executeTrade: (data) => api.post('/api/trading/execute', data),
};

// Data endpoints
export const dataAPI = {
  getMarketData: (params) => api.get('/api/data/market', { params }),
  getFeatures: () => api.get('/api/data/features'),
};

// API Key management
export const apiKeysAPI = {
  getKeys: () => api.get('/api/keys'),
  addKey: (data) => api.post('/api/keys', data),
  deleteKey: (keyId) => api.delete(`/api/keys/${keyId}`),
};

export default api;
