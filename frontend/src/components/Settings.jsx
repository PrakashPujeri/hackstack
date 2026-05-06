import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Settings as SettingsIcon, DollarSign, AlertTriangle, Sliders } from 'lucide-react';

export default function Settings() {
  const [constraints, setConstraints] = useState({
    initialCapital: 1000000,
    maxPositionSize: 0.2,
    riskTolerance: 0.15,
    maxDrawdownLimit: 0.2,
    transactionCost: 0.001,
    slippage: 0.0005,
  });

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving constraints:', constraints);
    alert('Settings saved successfully!');
  };

  const handleChange = (field, value) => {
    setConstraints(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Portfolio Constraints
          </CardTitle>
          <CardDescription>
            Set the capital and position limits for your trading strategy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="initialCapital">Initial Capital ($)</Label>
            <Input
              id="initialCapital"
              type="number"
              value={constraints.initialCapital}
              onChange={(e) => handleChange('initialCapital', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="maxPositionSize">Max Position Size (%)</Label>
            <Input
              id="maxPositionSize"
              type="number"
              step="0.01"
              value={constraints.maxPositionSize * 100}
              onChange={(e) => handleChange('maxPositionSize', e.target.value / 100)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Maximum percentage of portfolio allocated to a single asset
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risk Management
          </CardTitle>
          <CardDescription>
            Configure risk tolerance and drawdown limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="riskTolerance">Risk Tolerance (%)</Label>
            <Input
              id="riskTolerance"
              type="number"
              step="0.01"
              value={constraints.riskTolerance * 100}
              onChange={(e) => handleChange('riskTolerance', e.target.value / 100)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Maximum acceptable portfolio volatility
            </p>
          </div>
          <div>
            <Label htmlFor="maxDrawdownLimit">Max Drawdown Limit (%)</Label>
            <Input
              id="maxDrawdownLimit"
              type="number"
              step="0.01"
              value={constraints.maxDrawdownLimit * 100}
              onChange={(e) => handleChange('maxDrawdownLimit', e.target.value / 100)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Strategy will pause if drawdown exceeds this limit
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="h-5 w-5" />
            Trading Parameters
          </CardTitle>
          <CardDescription>
            Configure transaction costs and slippage for realistic simulation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="transactionCost">Transaction Cost (%)</Label>
            <Input
              id="transactionCost"
              type="number"
              step="0.0001"
              value={constraints.transactionCost * 100}
              onChange={(e) => handleChange('transactionCost', e.target.value / 100)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Commission and fees per trade
            </p>
          </div>
          <div>
            <Label htmlFor="slippage">Slippage (%)</Label>
            <Input
              id="slippage"
              type="number"
              step="0.0001"
              value={constraints.slippage * 100}
              onChange={(e) => handleChange('slippage', e.target.value / 100)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Expected price impact per trade
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => setConstraints({
          initialCapital: 1000000,
          maxPositionSize: 0.2,
          riskTolerance: 0.15,
          maxDrawdownLimit: 0.2,
          transactionCost: 0.001,
          slippage: 0.0005,
        })}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </div>
  );
}
