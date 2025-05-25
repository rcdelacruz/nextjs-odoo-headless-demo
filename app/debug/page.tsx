'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DebugPage() {
  const [results, setResults] = useState<string[]>([]);

  const addLog = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    setResults([]);
    addLog('Starting connection test...');

    // Test 1: Check environment variables
    addLog(`Environment check:`);
    addLog(`  ODOO_BASE_URL: ${process.env.NEXT_PUBLIC_ODOO_BASE_URL || 'undefined'}`);
    addLog(`  ODOO_DATABASE: ${process.env.NEXT_PUBLIC_ODOO_DATABASE || 'undefined'}`);

    // Test 2: Direct fetch to Odoo
    try {
      addLog('Testing direct connection to Odoo...');
      const odooUrl = process.env.NEXT_PUBLIC_ODOO_BASE_URL || 'http://localhost:8069';
      
      const response = await fetch(`${odooUrl}/web/session/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {
            db: process.env.NEXT_PUBLIC_ODOO_DATABASE || 'odoo',
            login: 'test',
            password: 'test'
          }
        })
      });

      addLog(`Response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        addLog(`Odoo is reachable!`);
        addLog(`Response: ${JSON.stringify(data, null, 2)}`);
      } else {
        addLog(`HTTP error: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      addLog(`Connection failed: ${error.message}`);
      
      if (error.message.includes('CORS')) {
        addLog('CORS issue detected - this is common with localhost development');
      } else if (error.message.includes('fetch')) {
        addLog('Network error - check if Odoo is running on the specified URL');
      }
    }

    // Test 3: Check if Next.js env vars are properly set
    addLog('Checking Next.js configuration...');
    if (typeof window !== 'undefined') {
      addLog(`  Window location: ${window.location.origin}`);
      addLog(`  User agent: ${navigator.userAgent.slice(0, 50)}...`);
    }
  };

  const testEnvVars = () => {
    setResults([]);
    addLog('Environment Variables Check:');
    addLog(`NODE_ENV: ${process.env.NODE_ENV}`);
    addLog(`NEXT_PUBLIC_ODOO_BASE_URL: ${process.env.NEXT_PUBLIC_ODOO_BASE_URL || 'NOT SET'}`);
    addLog(`NEXT_PUBLIC_ODOO_DATABASE: ${process.env.NEXT_PUBLIC_ODOO_DATABASE || 'NOT SET'}`);
    
    // Check .env.local
    addLog('');
    addLog('Make sure your .env.local file has:');
    addLog('NEXT_PUBLIC_ODOO_BASE_URL=http://localhost:8069');
    addLog('NEXT_PUBLIC_ODOO_DATABASE=your_database_name');
    addLog('ODOO_USERNAME=admin');
    addLog('ODOO_PASSWORD=your_password');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Odoo Connection Debug Tool</CardTitle>
          <p className="text-gray-600">
            Use this page to debug connection issues with Odoo
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={testConnection}>
              Test Odoo Connection
            </Button>
            <Button onClick={testEnvVars} variant="outline">
              Check Environment
            </Button>
            <Button onClick={() => setResults([])} variant="outline">
              Clear
            </Button>
          </div>

          {results.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Debug Results:</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="mb-1">
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Common Issues & Solutions:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li><strong>CORS Error:</strong> Normal for localhost development. Odoo should still work.</li>
              <li><strong>Connection Refused:</strong> Check if Odoo is running on port 8069</li>
              <li><strong>Environment Variables:</strong> Make sure .env.local has NEXT_PUBLIC_ prefixes</li>
              <li><strong>Database Name:</strong> Must match exactly what you created in Odoo</li>
              <li><strong>Network Error:</strong> Try changing localhost to 127.0.0.1 or your actual IP</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">Quick Fixes:</h3>
            <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
              <li>Restart your Next.js dev server after changing .env.local</li>
              <li>Make sure Odoo is accessible at: <code>http://localhost:8069</code></li>
              <li>Try logging into Odoo web interface directly first</li>
              <li>Check browser console for additional error details</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
