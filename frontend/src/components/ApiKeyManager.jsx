import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Key, Plus, Trash2, Eye, EyeOff, Copy, Check } from 'lucide-react';

export default function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'Alpha Vantage', key: 'av_************************', lastUsed: '2 hours ago' },
    { id: 2, name: 'Yahoo Finance', key: 'yf_************************', lastUsed: '1 day ago' },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const handleAddKey = () => {
    if (newKeyName && newKeyValue) {
      const maskedKey = `${newKeyName.substring(0, 3)}_${'*'.repeat(20)}`;
      setApiKeys([
        ...apiKeys,
        {
          id: Date.now(),
          name: newKeyName,
          key: maskedKey,
          lastUsed: 'Never',
        },
      ]);
      setNewKeyName('');
      setNewKeyValue('');
      setShowAddForm(false);
    }
  };

  const handleDeleteKey = (id) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Key Management
          </CardTitle>
          <CardDescription>
            Manage your API keys for external data providers. Keys are stored securely in environment variables.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold">Your API Keys</h3>
              <p className="text-sm text-muted-foreground">
                {apiKeys.length} key{apiKeys.length !== 1 ? 's' : ''} configured
              </p>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Key
            </Button>
          </div>

          {showAddForm && (
            <div className="mb-6 p-4 border rounded-lg bg-muted/50 space-y-4">
              <div>
                <Label htmlFor="keyName">Provider Name</Label>
                <Input
                  id="keyName"
                  placeholder="e.g., Alpha Vantage, Yahoo Finance"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="keyValue">API Key</Label>
                <Input
                  id="keyValue"
                  type="password"
                  placeholder="Enter your API key"
                  value={newKeyValue}
                  onChange={(e) => setNewKeyValue(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddKey}>Save Key</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{apiKey.name}</h4>
                    <code className="text-sm text-muted-foreground font-mono">{apiKey.key}</code>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-muted-foreground">Last used</p>
                    <p className="text-sm font-medium">{apiKey.lastUsed}</p>
                  </div>
                  <Badge variant="outline" className="hidden sm:inline-flex">
                    Active
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyKey(apiKey.key)}
                    >
                      {copiedId === apiKey.key ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteKey(apiKey.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {apiKeys.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No API keys configured yet</p>
              <p className="text-sm">Add your first API key to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• API keys are stored securely in environment variables</p>
          <p>• Keys are never exposed to the frontend</p>
          <p>• Rotate your keys regularly for better security</p>
          <p>• Use read-only keys when possible</p>
        </CardContent>
      </Card>
    </div>
  );
}
