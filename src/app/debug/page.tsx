'use client';
import { apiUrl } from '@/lib/api-client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [apiTests, setApiTests] = useState<any>({});
  const [networkInfo, setNetworkInfo] = useState<any>({});

  useEffect(() => {
    // Información del entorno
    setNetworkInfo({
      url: window.location.href,
      origin: window.location.origin,
      pathname: window.location.pathname,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });

    runTests();
  }, []);

  const runTests = async () => {
    const results: any = {};

    // Test API Statistics
    try {
      console.log('Testing /api/statistics...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/statistics`);
      const responseText = await response.text();
      
      results.statistics = {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries()),
        responseSize: responseText.length,
        responsePreview: responseText.substring(0, 500),
        isJson: responseText.startsWith('{') || responseText.startsWith('[')
      };

      // Si es JSON válido, parsearlo
      if (results.statistics.isJson) {
        try {
          const json = JSON.parse(responseText);
          results.statistics.parsedJson = json;
        } catch (e) {
          results.statistics.jsonError = e instanceof Error ? e.message : 'Parse error';
        }
      }
    } catch (error) {
      results.statistics = {
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Test API Charts
    try {
      console.log('Testing /api/charts...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/charts`);
      const responseText = await response.text();
      
      results.charts = {
        status: response.status,
        ok: response.ok,
        url: response.url,
        responseSize: responseText.length,
        responsePreview: responseText.substring(0, 200)
      };
    } catch (error) {
      results.charts = {
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Test API Sectors
    try {
      console.log('Testing /api/sectors...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/sectors`);
      const responseText = await response.text();
      
      results.sectors = {
        status: response.status,
        ok: response.ok,
        url: response.url,
        responseSize: responseText.length,
        responsePreview: responseText.substring(0, 200)
      };
    } catch (error) {
      results.sectors = {
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    setApiTests(results);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug Information</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Info */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Network Information</h2>
          <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
            {JSON.stringify(networkInfo, null, 2)}
          </pre>
        </div>

        {/* API Tests */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">API Tests</h2>
          <button 
            onClick={runTests}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm mb-3"
          >
            Run Tests Again
          </button>
          <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-96">
            {JSON.stringify(apiTests, null, 2)}
          </pre>
        </div>
      </div>

      {/* Statistics Detailed */}
      {apiTests.statistics && (
        <div className="mt-6 bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Statistics API Detailed Response</h2>
          <div className="space-y-2">
            <p><strong>Status:</strong> {apiTests.statistics.status} - {apiTests.statistics.statusText}</p>
            <p><strong>OK:</strong> {apiTests.statistics.ok ? 'Yes' : 'No'}</p>
            <p><strong>URL:</strong> {apiTests.statistics.url}</p>
            <p><strong>Response Size:</strong> {apiTests.statistics.responseSize} bytes</p>
            
            {apiTests.statistics.headers && (
              <div>
                <strong>Headers:</strong>
                <pre className="text-xs bg-gray-50 p-2 rounded mt-1">
                  {JSON.stringify(apiTests.statistics.headers, null, 2)}
                </pre>
              </div>
            )}

            <div>
              <strong>Response Preview:</strong>
              <pre className="text-xs bg-gray-50 p-2 rounded mt-1 max-h-40 overflow-auto">
                {apiTests.statistics.responsePreview}
              </pre>
            </div>

            {apiTests.statistics.parsedJson && (
              <div>
                <strong>Parsed JSON:</strong>
                <pre className="text-xs bg-gray-50 p-2 rounded mt-1 max-h-40 overflow-auto">
                  {JSON.stringify(apiTests.statistics.parsedJson, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
