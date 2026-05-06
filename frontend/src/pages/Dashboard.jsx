import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, PieChart, Activity } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import AllocationChart from '../components/dashboard/AllocationChart';
import RiskMetrics from '../components/dashboard/RiskMetrics';
import TradeLogs from '../components/dashboard/TradeLogs';
import { portfolioAPI, riskAPI } from '../lib/api';

export default function Dashboard() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockPerformanceData = [
    { date: '2024-01', cumulativeReturn: 0, drawdown: 0 },
    { date: '2024-02', cumulativeReturn: 0.05, drawdown: -0.02 },
    { date: '2024-03', cumulativeReturn: 0.08, drawdown: -0.01 },
    { date: '2024-04', cumulativeReturn: 0.12, drawdown: -0.03 },
    { date: '2024-05', cumulativeReturn: 0.15, drawdown: -0.05 },
    { date: '2024-06', cumulativeReturn: 0.18, drawdown: -0.04 },
    { date: '2024-07', cumulativeReturn: 0.22, drawdown: -0.06 },
    { date: '2024-08', cumulativeReturn: 0.25, drawdown: -0.05 },
    { date: '2024-09', cumulativeReturn: 0.28, drawdown: -0.07 },
    { date: '2024-10', cumulativeReturn: 0.32, drawdown: -0.06 },
    { date: '2024-11', cumulativeReturn: 0.35, drawdown: -0.08 },
    { date: '2024-12', cumulativeReturn: 0.38, drawdown: -0.05 },
  ];

  const mockAllocationData = [
    { name: 'Equities', value: 35 },
    { name: 'Bonds', value: 25 },
    { name: 'Commodities', value: 20 },
    { name: 'Real Estate', value: 12 },
    { name: 'Cash', value: 8 },
  ];

  const mockTrades = [
    { date: '2024-12-15', asset: 'AAPL', signal: 'BUY', quantity: 100, price: 195.50, totalValue: 19550, rationale: 'Momentum indicator positive' },
    { date: '2024-12-14', asset: 'MSFT', signal: 'SELL', quantity: 50, price: 378.20, totalValue: 18910, rationale: 'Risk limit reached' },
    { date: '2024-12-13', asset: 'GOOGL', signal: 'BUY', quantity: 75, price: 142.30, totalValue: 10672.50, rationale: 'Volatility below threshold' },
    { date: '2024-12-12', asset: 'AMZN', signal: 'HOLD', quantity: 0, price: 178.40, totalValue: 0, rationale: 'Neutral signal' },
    { date: '2024-12-11', asset: 'TSLA', signal: 'SELL', quantity: 30, price: 251.80, totalValue: 7554, rationale: 'Drawdown warning triggered' },
  ];

  const mockRiskMetrics = {
    var: 0.08,
    maxDrawdown: 0.12,
    volatility: 0.15,
    sharpeRatio: 1.85,
  };

  useEffect(() => {
    // Simulate API calls
    setLoading(true);
    setTimeout(() => {
      setPortfolioData({
        totalValue: 1380000,
        totalReturn: 0.38,
        annualizedReturn: 0.32,
        cashBalance: 110400,
      });
      setRiskData(mockRiskMetrics);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>
        <p className="text-muted-foreground">Overview of your hedge fund performance and risk metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Portfolio Value"
          value={`$${(portfolioData?.totalValue || 0).toLocaleString()}`}
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
        />
        <MetricCard
          title="Total Return"
          value={`${((portfolioData?.totalReturn || 0) * 100).toFixed(1)}%`}
          change="+5.2%"
          changeType="positive"
          icon={TrendingUp}
        />
        <MetricCard
          title="Annualized Return"
          value={`${((portfolioData?.annualizedReturn || 0) * 100).toFixed(1)}%`}
          change="+3.8%"
          changeType="positive"
          icon={Activity}
        />
        <MetricCard
          title="Cash Balance"
          value={`$${(portfolioData?.cashBalance || 0).toLocaleString()}`}
          change="-2.1%"
          changeType="negative"
          icon={PieChart}
        />
      </div>

      {/* Risk Metrics */}
      <RiskMetrics metrics={riskData} />

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <PerformanceChart data={mockPerformanceData} />
        <AllocationChart data={mockAllocationData} />
      </div>

      {/* Trade Logs */}
      <TradeLogs trades={mockTrades} />
    </div>
  );
}
