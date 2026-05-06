import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { Search, Filter } from 'lucide-react';

export default function TradeLogs({ trades }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredTrades = trades?.filter(trade => {
    const matchesSearch = trade.asset?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.signal?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || trade.signal === filterType;
    return matchesSearch && matchesFilter;
  }) || [];

  const getSignalBadge = (signal) => {
    const variants = {
      'BUY': 'success',
      'SELL': 'destructive',
      'HOLD': 'secondary',
    };
    return variants[signal] || 'outline';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade History</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by asset or signal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === 'all' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
            >
              All
            </Button>
            <Button
              variant={filterType === 'BUY' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setFilterType('BUY')}
            >
              Buy
            </Button>
            <Button
              variant={filterType === 'SELL' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setFilterType('SELL')}
            >
              Sell
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Signal</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Rationale</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No trades found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTrades.map((trade, index) => (
                  <TableRow key={index}>
                    <TableCell>{trade.date}</TableCell>
                    <TableCell className="font-medium">{trade.asset}</TableCell>
                    <TableCell>
                      <Badge variant={getSignalBadge(trade.signal)}>
                        {trade.signal}
                      </Badge>
                    </TableCell>
                    <TableCell>{trade.quantity}</TableCell>
                    <TableCell>${trade.price?.toFixed(2)}</TableCell>
                    <TableCell>${trade.totalValue?.toFixed(2)}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {trade.rationale}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
