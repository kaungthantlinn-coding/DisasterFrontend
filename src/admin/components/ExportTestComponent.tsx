import React, { useState } from 'react';
import { testExportConfigs, runAllExportTests, testExportFunctionality } from '../../utils/exportTestUtils';

interface ExportTestComponentProps {
  onExport: (format: string, fields: string[], filters: any) => Promise<void>;
}

export const ExportTestComponent: React.FC<ExportTestComponentProps> = ({ onExport }) => {
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');

  const runSingleTest = async (configIndex: number) => {
    const config = testExportConfigs[configIndex];
    setTesting(true);
    setCurrentTest(`Testing ${config.format.toUpperCase()} export...`);

    try {
      const result = await testExportFunctionality(onExport, config);
      setTestResults(prev => [...prev, { config, result, timestamp: new Date() }]);
      setCurrentTest(`${config.format.toUpperCase()} test completed`);
    } catch (error) {
      console.error('Test failed:', error);
      setCurrentTest(`${config.format.toUpperCase()} test failed`);
    } finally {
      setTesting(false);
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    setTestResults([]);
    setCurrentTest('Running comprehensive export tests...');

    try {
      await runAllExportTests(onExport);
      setCurrentTest('All tests completed');
    } catch (error) {
      console.error('Test suite failed:', error);
      setCurrentTest('Test suite failed');
    } finally {
      setTesting(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
    setCurrentTest('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Functionality Tests</h3>
      
      {/* Test Controls */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={runAllTests}
          disabled={testing}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {testing ? 'Testing...' : 'Run All Tests'}
        </button>
        
        <button
          onClick={() => runSingleTest(0)}
          disabled={testing}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Test CSV Export
        </button>
        
        <button
          onClick={() => runSingleTest(1)}
          disabled={testing}
          className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Test Excel Export
        </button>
        
        <button
          onClick={() => runSingleTest(2)}
          disabled={testing}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Test PDF Export
        </button>
        
        <button
          onClick={clearResults}
          disabled={testing}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear Results
        </button>
      </div>

      {/* Current Test Status */}
      {currentTest && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center">
            {testing && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            )}
            <span className="text-blue-800">{currentTest}</span>
          </div>
        </div>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Test Results:</h4>
          {testResults.map((test, index) => (
            <div
              key={index}
              className={`p-3 rounded-md border ${
                test.result.success
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span
                    className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      test.result.success ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></span>
                  <span className="font-medium">
                    {test.config.format.toUpperCase()} Export
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {test.result.duration}ms
                </span>
              </div>
              
              {test.result.error && (
                <div className="mt-2 text-sm text-red-700">
                  Error: {test.result.error}
                </div>
              )}
              
              <div className="mt-2 text-sm text-gray-600">
                Fields: {test.config.fields.join(', ')}
                {test.config.filters && Object.keys(test.config.filters).length > 0 && (
                  <div>
                    Filters: {JSON.stringify(test.config.filters, null, 2)}
                  </div>
                )}
              </div>
              
              <div className="mt-1 text-xs text-gray-500">
                Tested at: {test.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Test Configuration Preview */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h4 className="font-medium text-gray-900 mb-2">Available Test Configurations:</h4>
        <div className="space-y-2 text-sm text-gray-600">
          {testExportConfigs.map((config, index) => (
            <div key={index} className="flex items-start">
              <span className="font-medium w-16">{config.format.toUpperCase()}:</span>
              <div>
                <div>Fields: {config.fields.join(', ')}</div>
                {config.filters && (
                  <div>Filters: {Object.entries(config.filters).map(([key, value]) => `${key}=${value}`).join(', ')}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExportTestComponent;
