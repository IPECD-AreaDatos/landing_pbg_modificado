'use client';

import { useState } from 'react';

interface TestResult {
  status: number | string;
  ok?: boolean;
  data?: any;
  url?: string;
  error?: string;
}

export default function DiagnosticsPage() {
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [loading, setLoading] = useState(false);

  const testAPI = async (endpoint: string) => {
    setLoading(true);
    try {
      console.log(`Testing: ${endpoint}`);
      const response = await fetch(endpoint);
      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        [endpoint]: {
          status: response.status,
          ok: response.ok,
          data: data,
          url: response.url
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [endpoint]: {
          status: 'ERROR',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Diagnostics</h1>
      
      <div className="space-y-4">
        <button
          onClick={() => testAPI(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/diagnostics`)}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          disabled={loading}
        >
          Test /api/diagnostics
        </button>
        
        <button
          onClick={() => testAPI(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/statistics`)}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          disabled={loading}
        >
          Test /api/statistics
        </button>

        <button
          onClick={() => testAPI(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/charts`)}
          className="bg-purple-500 text-white px-4 py-2 rounded mr-2"
          disabled={loading}
        >
          Test /api/charts
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Results:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Current URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
        <p>Base Path: {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}</p>
      </div>
    </div>
  );
}