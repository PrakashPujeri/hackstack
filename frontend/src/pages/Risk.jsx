import React from 'react';

export default function Risk() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Risk Analysis</h1>
        <p className="text-muted-foreground">Comprehensive risk metrics and portfolio risk assessment</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold">Value at Risk (95%)</h3>
          <p className="text-2xl font-bold">5.2%</p>
          <p className="text-sm text-gray-600">Potential loss over 1 day at 95% confidence</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold">Maximum Drawdown</h3>
          <p className="text-2xl font-bold">12.3%</p>
          <p className="text-sm text-gray-600">Largest peak-to-trough decline</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold">Volatility (Annual)</h3>
          <p className="text-2xl font-bold">15.2%</p>
          <p className="text-sm text-gray-600">Annualized standard deviation</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold">Sharpe Ratio</h3>
          <p className="text-2xl font-bold">1.85</p>
          <p className="text-sm text-gray-600">Risk-adjusted return</p>
        </div>
      </div>
      
      <div className="p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Risk Summary</h2>
        <p>Portfolio risk metrics show moderate volatility with acceptable drawdown levels.</p>
      </div>
    </div>
  );
}
