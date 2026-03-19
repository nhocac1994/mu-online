'use client';

import React, { useState } from 'react';

export default function TestSecurityPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [baseUrl, setBaseUrl] = useState('http://localhost:3001');
  const [accountId, setAccountId] = useState('mges123');

  // Helper function để parse JSON response an toàn
  async function safeJsonParse(response: Response) {
    try {
      const text = await response.text();
      if (!text) {
        return { error: 'Empty response' };
      }
      try {
        return JSON.parse(text);
      } catch (e) {
        return { error: 'Invalid JSON', raw: text.substring(0, 200) };
      }
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Test All APIs
  async function testAllAPIs() {
    setLoading(true);
    setResults(null);

    const endpoints = [
      { path: '/api/dashboard', method: 'GET', params: { accountId } },
      { path: '/api/characters', method: 'GET', params: { accountId } },
      { path: '/api/accounts', method: 'GET', params: {} },
      { path: '/api/rankings/level', method: 'GET', params: {} },
      { path: '/api/rankings/guild', method: 'GET', params: {} },
    ];

    let testResults: any[] = [];
    let serverReachable = false;

    for (const endpoint of endpoints) {
      try {
        const url = new URL(endpoint.path, baseUrl);
        Object.entries(endpoint.params).forEach(([key, value]) => {
          if (value) {
            url.searchParams.append(key, value as string);
          }
        });

        const response = await fetch(url.toString(), {
          method: endpoint.method,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.status !== 404) {
          serverReachable = true;
        }

        const data = await safeJsonParse(response);

        testResults.push({
          endpoint: endpoint.path,
          status: response.status,
          success: response.status === 200,
          hasSecurity: response.status === 400 || response.status === 401 || response.status === 403,
          is404: response.status === 404,
          data: data
        });
      } catch (error: any) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          serverReachable = false;
        }

        testResults.push({
          endpoint: endpoint.path,
          status: 'ERROR',
          error: error.message,
          isNetworkError: error.message.includes('Failed to fetch') || error.message.includes('NetworkError')
        });
      }
    }

    const summary = {
      total: testResults.length,
      success: testResults.filter(r => r.success).length,
      blocked: testResults.filter(r => r.hasSecurity).length,
      notFound: testResults.filter(r => r.is404 || r.status === 404).length,
      errors: testResults.filter(r => r.status === 'ERROR').length,
      networkErrors: testResults.filter(r => r.isNetworkError).length,
      serverReachable: serverReachable,
      baseUrl: baseUrl
    };

    if (summary.networkErrors === summary.total) {
      (summary as any).warning = '🚨 TẤT CẢ API ĐỀU BỊ LỖI NETWORK!';
      (summary as any).suggestions = [
        '1. ✅ Kiểm tra server có đang chạy không',
        '2. ✅ Kiểm tra URL có đúng không',
        '3. ✅ Kiểm tra CORS settings',
        '4. ✅ Mở DevTools Console để xem lỗi chi tiết'
      ];
    }

    setResults({
      summary,
      details: testResults
    });
    setLoading(false);
  }

  // Test SQL Injection
  async function testSQLInjection() {
    setLoading(true);
    setResults(null);

    const payloads = [
      { name: 'UNION SELECT', value: `${accountId}' UNION SELECT * FROM MEMB_INFO--` },
      { name: 'OR 1=1', value: `${accountId}' OR '1'='1` },
      { name: 'Comment', value: `${accountId}'--` },
    ];

    const testResults: any[] = [];

    for (const payload of payloads) {
      try {
        const url = `${baseUrl}/api/dashboard?accountId=${encodeURIComponent(payload.value)}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await safeJsonParse(response);

        testResults.push({
          payload: payload.name,
          status: response.status,
          blocked: response.status === 400 || response.status === 403,
          data: data
        });
      } catch (error: any) {
        testResults.push({
          payload: payload.name,
          status: 'ERROR',
          error: error.message
        });
      }
    }

    setResults({
      summary: {
        total: testResults.length,
        blocked: testResults.filter(r => r.blocked).length
      },
      details: testResults
    });
    setLoading(false);
  }

  return (
    <div className="min-h-screen mu-retro-bg p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="mu-retro-title text-center mb-8">🔒 TEST BẢO MẬT WEBSITE</h1>

        <div className="mu-retro-card-blur p-6 mb-6">
          <div className="mb-4">
            <label className="mu-text-gold block mb-2">Base URL:</label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="mu-retro-input w-full"
              placeholder="http://localhost:3001"
            />
          </div>
          <div className="mb-4">
            <label className="mu-text-gold block mb-2">Account ID:</label>
            <input
              type="text"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="mu-retro-input w-full"
              placeholder="mges123"
            />
          </div>
          <div className="flex gap-4">
            <button onClick={testAllAPIs} className="mu-retro-btn" disabled={loading}>
              {loading ? 'Đang test...' : 'Test Tất Cả API'}
            </button>
            <button onClick={testSQLInjection} className="mu-retro-btn" disabled={loading}>
              {loading ? 'Đang test...' : 'Test SQL Injection'}
            </button>
          </div>
        </div>

        {results && (
          <div className="mu-retro-card-blur p-6">
            <h2 className="mu-retro-title-small mb-4">Kết Quả Test</h2>
            
            {/* Summary */}
            {results.summary && (
              <div className="mb-6 p-4 rounded" style={{
                background: results.summary.blocked === results.summary.total 
                  ? 'rgba(0, 255, 0, 0.1)' 
                  : results.summary.errors > 0 
                    ? 'rgba(255, 0, 0, 0.1)' 
                    : 'rgba(255, 170, 0, 0.1)',
                border: `2px solid ${
                  results.summary.blocked === results.summary.total 
                    ? '#00ff00' 
                    : results.summary.errors > 0 
                      ? '#ff0000' 
                      : '#ffaa00'
                }`
              }}>
                <h3 className="mu-text-gold text-lg mb-3">📊 Tổng Kết</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-gray-400 text-sm">Tổng số test</div>
                    <div className="mu-text-gold text-xl font-bold">{results.summary.total}</div>
                  </div>
                  {results.summary.blocked !== undefined && (
                    <div>
                      <div className="text-gray-400 text-sm">Đã chặn</div>
                      <div className="text-green-400 text-xl font-bold">
                        {results.summary.blocked} ✅
                      </div>
                    </div>
                  )}
                  {results.summary.success !== undefined && (
                    <div>
                      <div className="text-gray-400 text-sm">Thành công</div>
                      <div className="text-blue-400 text-xl font-bold">{results.summary.success}</div>
                    </div>
                  )}
                  {results.summary.errors !== undefined && (
                    <div>
                      <div className="text-gray-400 text-sm">Lỗi</div>
                      <div className="text-red-400 text-xl font-bold">{results.summary.errors}</div>
                    </div>
                  )}
                </div>
                
                {results.summary.blocked === results.summary.total && (
                  <div className="mt-4 p-3 rounded bg-green-500/20 border border-green-500">
                    <div className="text-green-400 font-bold text-lg">
                      ✅ BẢO MẬT HOẠT ĐỘNG TỐT!
                    </div>
                    <div className="text-gray-300 text-sm mt-1">
                      Tất cả các SQL injection attempts đã bị chặn thành công.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Details */}
            {results.details && results.details.length > 0 && (
              <div>
                <h3 className="mu-text-gold text-lg mb-3">📋 Chi Tiết</h3>
                <div className="space-y-3">
                  {results.details.map((detail: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 rounded"
                      style={{
                        background: detail.blocked 
                          ? 'rgba(0, 255, 0, 0.1)' 
                          : detail.status === 'ERROR'
                            ? 'rgba(255, 0, 0, 0.1)'
                            : detail.success
                              ? 'rgba(0, 100, 255, 0.1)'
                              : 'rgba(255, 170, 0, 0.1)',
                        border: `2px solid ${
                          detail.blocked 
                            ? '#00ff00' 
                            : detail.status === 'ERROR'
                              ? '#ff0000'
                              : detail.success
                                ? '#0066ff'
                                : '#ffaa00'
                        }`
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="mu-text-gold font-bold">
                            {detail.endpoint || detail.payload}
                          </div>
                          <div className="text-gray-400 text-sm mt-1">
                            Status: <span className="text-white">{detail.status}</span>
                          </div>
                        </div>
                        {detail.blocked && (
                          <span className="px-3 py-1 rounded text-xs font-bold bg-green-500 text-black">
                            ✅ BLOCKED
                          </span>
                        )}
                        {detail.success && (
                          <span className="px-3 py-1 rounded text-xs font-bold bg-blue-500 text-white">
                            ✓ SUCCESS
                          </span>
                        )}
                        {detail.status === 'ERROR' && (
                          <span className="px-3 py-1 rounded text-xs font-bold bg-red-500 text-white">
                            ✗ ERROR
                          </span>
                        )}
                      </div>
                      
                      {detail.data && (
                        <div className="mt-3 p-3 rounded bg-black/30">
                          <div className="text-gray-300 text-sm">
                            <strong>Response:</strong>
                            <pre className="mt-2 text-xs overflow-auto">
                              {JSON.stringify(detail.data, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                      
                      {detail.error && (
                        <div className="mt-3 p-3 rounded bg-red-500/20 border border-red-500">
                          <div className="text-red-400 text-sm">
                            <strong>Error:</strong> {detail.error}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw JSON (Collapsible) */}
            <details className="mt-6">
              <summary className="mu-text-gold cursor-pointer text-sm">
                📄 Xem JSON Raw
              </summary>
              <pre className="bg-black/50 p-4 rounded overflow-auto text-xs text-white mt-2">
                {JSON.stringify(results, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}

