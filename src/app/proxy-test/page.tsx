'use client';
import { apiUrl } from '@/lib/api-client';

import { useState, useEffect } from 'react';

export default function ProxyTestPage() {
  const [tests, setTests] = useState<any>({});
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
    runTests();
  }, []);

  const runTests = async () => {
    const testResults: any = {};

    // Test 1: API Statistics
    try {
      const response = await fetch(apiUrl('/api/statistics'));
      testResults.apiStatistics = {
        status: response.status,
        ok: response.ok,
        url: response.url
      };
    } catch (error) {
      testResults.apiStatistics = { error: error instanceof Error ? error.message : 'Unknown error' };
    }

    // Test 2: Next.js resources
    try {
      const response = await fetch('/_next/static/css/app/layout.css');
      testResults.nextStatic = {
        status: response.status,
        ok: response.ok,
        url: response.url
      };
    } catch (error) {
      testResults.nextStatic = { error: error instanceof Error ? error.message : 'Unknown error' };
    }

    // Test 3: Root API
    try {
      const response = await fetch(apiUrl('/api/diagnostics'));
      testResults.apiDiagnostics = {
        status: response.status,
        ok: response.ok,
        url: response.url
      };
    } catch (error) {
      testResults.apiDiagnostics = { error: error instanceof Error ? error.message : 'Unknown error' };
    }

    setTests(testResults);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Proxy Test Page</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-blue-800">Current URL Info</h2>
        <p className="text-blue-700">
          <strong>Current URL:</strong> {currentUrl}
        </p>
        <p className="text-blue-700">
          <strong>Expected for proxy:</strong> https://estadistica.corrientes.gob.ar/pbg-dashboard/proxy-test
        </p>
        <p className="text-blue-700">
          <strong>Direct Vercel:</strong> https://landing-pbg-modificado.vercel.app/proxy-test
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <TestCard 
          title="API Statistics" 
          result={tests.apiStatistics}
          expectedUrl="/api/statistics"
        />
        <TestCard 
          title="Next.js Static" 
          result={tests.nextStatic}
          expectedUrl="/_next/static/..."
        />
        <TestCard 
          title="API Diagnostics" 
          result={tests.apiDiagnostics}
          expectedUrl="/api/diagnostics"
        />
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Proxy Configuration Needed</h3>
        <div className="text-sm text-yellow-700 space-y-2">
          <p><strong>If APIs are failing:</strong> The proxy needs to forward /api/* requests</p>
          <p><strong>If static resources fail:</strong> The proxy needs to forward /_next/* requests</p>
          <p><strong>If everything fails:</strong> Check the base proxy configuration</p>
        </div>
      </div>

      <button 
        onClick={runTests}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Run Tests Again
      </button>
    </div>
  );
}

function TestCard({ title, result, expectedUrl }: { title: string, result: any, expectedUrl: string }) {
  const isSuccess = result?.ok === true;
  const isError = result?.error || (result?.status && result.status >= 400);

  return (
    <div className={`border rounded-lg p-4 ${isSuccess ? 'bg-green-50 border-green-200' : isError ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-2">Expected: {expectedUrl}</p>
      
      {result ? (
        <div className="text-xs">
          {result.status && <p>Status: {result.status}</p>}
          {result.ok !== undefined && <p>OK: {result.ok ? 'Yes' : 'No'}</p>}
          {result.url && <p>Actual URL: {result.url}</p>}
          {result.error && <p className="text-red-600">Error: {result.error}</p>}
        </div>
      ) : (
        <p className="text-xs text-gray-500">Testing...</p>
      )}
    </div>
  );
}