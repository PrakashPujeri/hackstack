import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function Performance() {
  const performanceData = [
    { month: 'Jan', return: 2.5, benchmark: 1.8 },
    { month: 'Feb', return: 3.2, benchmark: 2.1 },
    { month: 'Mar', return: 1.8, benchmark: 1.5 },
    { month: 'Apr', return: 4.1, benchmark: 2.8 },
    { month: 'May', return: 2.9, benchmark: 2.2 },
    { month: 'Jun', return: 3.5, benchmark: 2.4 },
    { month: 'Jul', return: 4.2, benchmark: 2.9 },
    { month: 'Aug', return: 3.8, benchmark: 2.6 },
    { month: 'Sep', return: 2.1, benchmark: 1.9 },
    { month: 'Oct', return: 4.5, benchmark: 3.1 },
    { month: 'Nov', return: 3.9, benchmark: 2.8 },
    { month: 'Dec', return: 4.8, benchmark: 3.2 },
  ];

  const cumulativeData = [
    { month: 'Jan', portfolio: 102500, benchmark: 101800 },
    { month: 'Feb', portfolio: 105780, benchmark: 103938 },
    { month: 'Mar', portfolio: 107686, benchmark: 105498 },
    { month: 'Apr', portfolio: 112101, benchmark: 108460 },
    { month: 'May', portfolio: 115354, benchmark: 110846 },
    { month: 'Jun', portfolio: 119391, benchmark: 113506 },
    { month: 'Jul', portfolio: 124403, benchmark: 116795 },
    { month: 'Aug', portfolio: 129135, benchmark: 119835 },
    { month: 'Sep', portfolio: 131845, benchmark: 122109 },
    { month: 'Oct', portfolio: 137778, benchmark: 125894 },
    { month: 'Nov', portfolio: 143150, benchmark: 129418 },
    { month: 'Dec', portfolio: 150061, benchmark: 133559 },
  ];

  const metrics = [
    { name: 'Total Return', portfolio: '50.1%', benchmark: '33.6%' },
    { name: 'Annualized Return', portfolio: '38.2%', benchmark: '25.4%' },
    { name: 'Alpha', value: '12.8%' },
    { name: 'Beta', value: '0.85' },
    { name: 'Information Ratio', value: '1.45' },
    { name: 'Tracking Error', value: '4.2%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Performance Analysis</h1>
        <p className="text-muted-foreground">Detailed performance metrics and benchmark comparison</p>
      </div>

      {/* Monthly Returns */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Returns vs Benchmark</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="return" stroke="hsl(var(--primary))" strokeWidth={2} name="Portfolio" />
              <Line type="monotone" dataKey="benchmark" stroke="hsl(var(--secondary))" strokeWidth={2} name="Benchmark" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cumulative Growth */}
      <Card>
        <CardHeader>
          <CardTitle>Cumulative Portfolio Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={cumulativeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
                formatter={(value) => `$${value.toLocaleString()}`}
              />
              <Legend />
              <Area type="monotone" dataKey="portfolio" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} name="Portfolio" />
              <Area type="monotone" dataKey="benchmark" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.3} name="Benchmark" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold">{metric.portfolio}</div>
                {metric.benchmark && (
                  <div className="text-sm text-muted-foreground">Benchmark: {metric.benchmark}</div>
                )}
                {metric.value && (
                  <div className="text-sm text-muted-foreground">{metric.value}</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
