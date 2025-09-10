import React, { useState, useEffect } from 'react';
import api from '../services/api';

const TestPage: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testBackendConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/test/health');
      setHealthStatus(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testBackendConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🧪 RoomiFy Test Page
          </h1>
          
          <div className="space-y-6">
            {/* Backend Connection Test */}
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-3">Backend Connection Test</h2>
              
              <button
                onClick={testBackendConnection}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md mb-4"
              >
                {loading ? 'Testing...' : 'Test Connection'}
              </button>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  ❌ Error: {error}
                </div>
              )}

              {healthStatus && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  ✅ Backend is running!
                  <pre className="mt-2 text-sm">
                    {JSON.stringify(healthStatus, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Application Info */}
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-3">Application Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <strong>Frontend:</strong> React + TypeScript + Vite
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <strong>Backend:</strong> Spring Boot + Java 17
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <strong>Database:</strong> PostgreSQL
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <strong>Authentication:</strong> JWT
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>
              <div className="space-y-2">
                <a
                  href="http://localhost:8080/test/health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  🔗 Backend Health Check (Direct Link)
                </a>
                <a
                  href="http://localhost:8080/api/swagger-ui.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  📚 API Documentation (Swagger)
                </a>
                <a
                  href="/login"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  🔐 Go to Login Page
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
