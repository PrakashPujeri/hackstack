import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Shield, AlertTriangle, Activity, TrendingUp, BarChart3, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Risk() {
  const [riskMetrics, setRiskMetrics] = React.useState([
    {
      title: 'Value at Risk (95%)',
      value: '5.2%',
      description: 'Potential loss over 1 day at 95% confidence',
      icon: Shield,
      status: 'acceptable',
    },
    {
      title: 'Value at Risk (99%)',
      value: '8.5%',
      description: 'Potential loss over 1 day at 99% confidence',
      icon: Shield,
      status: 'acceptable',
    },
    {
      title: 'Maximum Drawdown',
      value: '12.3%',
      description: 'Largest peak-to-trough decline',
      icon: AlertTriangle,
      status: 'warning',
    },
    {
      title: 'Current Drawdown',
      value: '5.1%',
      description: 'Current decline from peak',
      icon: Activity,
      status: 'acceptable',
    },
    {
      title: 'Volatility (Annual)',
      value: '15.2%',
      description: 'Annualized standard deviation',
      icon: BarChart3,
      status: 'acceptable',
    },
    {
      title: 'Sharpe Ratio',
      value: '1.85',
      description: 'Risk-adjusted return (vs risk-free rate)',
      icon: TrendingUp,
      status: 'good',
    },
    {
      title: 'Sortino Ratio',
      value: '2.45',
      description: 'Downside risk-adjusted return',
      icon: Target,
      status: 'good',
    },
    {
      title: 'Beta',
      value: '0.85',
      description: 'Sensitivity to market movements',
      icon: Activity,
      status: 'acceptable',
    },
  ]);

  const varHistory = [
    { month: 'Jan', var95: 0.05, var99: 0.08 },
    { month: 'Feb', var95: 0.06, var99: 0.09 },
    { month: 'Mar', var95: 0.04, var99: 0.07 },
    { month: 'Apr', var95: 0.07, var99: 0.10 },
    { month: 'May', var95: 0.05, var99: 0.08 },
    { month: 'Jun', var95: 0.06, var99: 0.09 },
  ];

  const drawdownData = [
    { date: '2024-01', drawdown: -0.02 },
    { date: '2024-02', drawdown: -0.05 },
    { date: '2024-03', drawdown: -0.03 },
    { date: '2024-04', drawdown: -0.08 },
    { date: '2024-05', drawdown: -0.06 },
    { date: '2024-06', drawdown: -0.04 },
    { date: '2024-07', drawdown: -0.07 },
    { date: '2024-08', drawdown: -0.05 },
    { date: '2024-09', drawdown: -0.09 },
    { date: '2024-10', drawdown: -0.06 },
    { date: '2024-11', drawdown: -0.08 },
    { date: '2024-12', drawdown: -0.05 },
  ];

  const getStatusBadge = (status) => {
    const variants = {
      good: 'success',
      acceptable: 'secondary',
      warning: 'warning',
      danger: 'destructive',
    };
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Risk Analysis</h1>
        <p className="text-muted-foreground">Comprehensive risk metrics and portfolio risk assessment</p>
      </div>

      {/* Risk Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {riskMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                <div className="mt-2">{getStatusBadge(metric.status)}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* VaR History Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Value at Risk History</CardTitle>
          <CardDescription>Historical VaR at 95% and 99% confidence levels</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={varHistory}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
                formatter={(value) => `${(value * 100).toFixed(1)}%`}
              />
              <Legend />
              <Bar dataKey="var95" fill="hsl(var(--primary))" name="VaR 95%" />
              <Bar dataKey="var99" fill="hsl(var(--destructive))" name="VaR 99%" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Drawdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Drawdown Analysis</CardTitle>
          <CardDescription>Portfolio drawdown over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={drawdownData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
                formatter={(value) => `${(value * 100).toFixed(1)}%`}
              />
              <Line
                type="monotone"
                dataKey="drawdown"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                fill="hsl(var(--destructive))"
                fillOpacity={0.3}
                name="Drawdown"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Asset Risk Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-semibold">Overall Risk Status: Moderate</h4>
              <p className="text-sm text-muted-foreground">
                Portfolio risk metrics show moderate volatility with acceptable drawdown levels. Multi-asset diversification is reducing correlation risk.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="font-semibold">Cross-Asset Correlation</h4>
              <p className="text-sm text-muted-foreground">
                Oil-Gold correlation at historical lows. Consider rebalancing commodity allocation to optimize returns.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-semibold">Macro Economic Impact</h4>
              <p className="text-sm text-muted-foreground">
                Rising inflation with stable interest rates creates favorable bond conditions. Monitor Fed policy changes.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <BarChart3 className="h-5 w-5 text-purple-500 mt-0.5" />
            <div>
              <h4 className="font-semibold">Volatility Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Commodity volatility decreasing while equity volatility stable. Adjust position sizes accordingly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
