import React from 'react';
import TradeLogs from '../components/dashboard/TradeLogs';

export default function Trades() {
  const mockTrades = [
    { date: '2024-12-15', asset: 'AAPL', signal: 'BUY', quantity: 100, price: 195.50, totalValue: 19550, rationale: 'Momentum indicator positive, RSI at 55' },
    { date: '2024-12-14', asset: 'MSFT', signal: 'SELL', quantity: 50, price: 378.20, totalValue: 18910, rationale: 'Risk limit reached, position size exceeded' },
    { date: '2024-12-13', asset: 'GOOGL', signal: 'BUY', quantity: 75, price: 142.30, totalValue: 10672.50, rationale: 'Volatility below threshold, favorable entry' },
    { date: '2024-12-12', asset: 'AMZN', signal: 'HOLD', quantity: 0, price: 178.40, totalValue: 0, rationale: 'Neutral signal, waiting for confirmation' },
    { date: '2024-12-11', asset: 'TSLA', signal: 'SELL', quantity: 30, price: 251.80, totalValue: 7554, rationale: 'Drawdown warning triggered, reducing exposure' },
    { date: '2024-12-10', asset: 'NVDA', signal: 'BUY', quantity: 40, price: 485.10, totalValue: 19404, rationale: 'Strong momentum, earnings beat expectations' },
    { date: '2024-12-09', asset: 'META', signal: 'SELL', quantity: 25, price: 335.80, totalValue: 8395, rationale: 'Technical resistance level reached' },
    { date: '2024-12-08', asset: 'BRK.B', signal: 'BUY', quantity: 60, price: 362.40, totalValue: 21744, rationale: 'Value opportunity, price below intrinsic value' },
    { date: '2024-12-07', asset: 'JPM', signal: 'HOLD', quantity: 0, price: 172.30, totalValue: 0, rationale: 'Awaiting Fed decision, volatility expected' },
    { date: '2024-12-06', asset: 'V', signal: 'BUY', quantity: 45, price: 258.90, totalValue: 11650.50, rationale: 'Stable performance, low volatility' },
    { date: '2024-12-05', asset: 'JNJ', signal: 'SELL', quantity: 55, price: 156.70, totalValue: 8618.50, rationale: 'Sector rotation, reducing healthcare exposure' },
    { date: '2024-12-04', asset: 'WMT', signal: 'BUY', quantity: 80, price: 163.20, totalValue: 13056, rationale: 'Defensive positioning, economic uncertainty' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Trade History</h1>
        <p className="text-muted-foreground">Complete log of all trading signals and executed trades</p>
      </div>

      <TradeLogs trades={mockTrades} />
    </div>
  );
}
