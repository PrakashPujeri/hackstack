import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Shield, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import { Badge } from '../ui/badge';

export default function RiskMetrics({ metrics }) {
  const getRiskLevel = (value) => {
    if (value < 0.1) return { label: 'Low', variant: 'success' };
    if (value < 0.2) return { label: 'Medium', variant: 'warning' };
    return { label: 'High', variant: 'destructive' };
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Value at Risk (95%)</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics?.var ? `${(metrics.var * 100).toFixed(2)}%` : 'N/A'}
          </div>
          <Badge variant={getRiskLevel(metrics?.var || 0).variant} className="mt-2">
            {getRiskLevel(metrics?.var || 0).label} Risk
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics?.maxDrawdown ? `${(metrics.maxDrawdown * 100).toFixed(2)}%` : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Largest peak-to-trough decline
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Volatility</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics?.volatility ? `${(metrics.volatility * 100).toFixed(2)}%` : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Annualized standard deviation
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics?.sharpeRatio ? metrics.sharpeRatio.toFixed(2) : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Risk-adjusted return measure
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
