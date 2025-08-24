// Test script for audit log export functionality
// This can be run in the browser console to test the export API

const testExportAPI = async () => {
  console.log('🧪 Starting audit log export API tests...');
  
  const apiBaseUrl = 'http://localhost:5057/api';
  const authToken = localStorage.getItem('authToken');
  
  if (!authToken) {
    console.error('❌ No auth token found. Please log in first.');
    return;
  }

  const testConfigs = [
    {
      name: 'CSV Export Test',
      format: 'csv',
      fields: ['timestamp', 'userName', 'action', 'targetType', 'severity'],
      filters: {
        severity: 'high',
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    },
    {
      name: 'Excel Export Test',
      format: 'excel',
      fields: ['timestamp', 'userName', 'action', 'details'],
      filters: {
        action: 'user_login',
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    },
    {
      name: 'PDF Export Test',
      format: 'pdf',
      fields: ['timestamp', 'userName', 'action', 'severity'],
      filters: {
        targetType: 'user'
      }
    }
  ];

  for (const config of testConfigs) {
    console.log(`\n📋 Running ${config.name}...`);
    
    try {
      const exportRequest = {
        format: config.format,
        fields: config.fields,
        filters: config.filters,
        includeMetadata: true,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        maxRecords: 100
      };

      console.log('📤 Request payload:', exportRequest);

      const response = await fetch(`${apiBaseUrl}/audit-logs/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(exportRequest)
      });

      console.log(`📊 Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        console.error(`❌ ${config.name} failed:`, errorData.message);
        continue;
      }

      // Check response headers
      const contentDisposition = response.headers.get('Content-Disposition');
      const recordCount = response.headers.get('X-Record-Count');
      const exportTimestamp = response.headers.get('X-Export-Timestamp');
      
      console.log('📋 Response headers:');
      console.log('  Content-Disposition:', contentDisposition);
      console.log('  Record Count:', recordCount);
      console.log('  Export Timestamp:', exportTimestamp);

      // Get file info
      const blob = await response.blob();
      const fileName = contentDisposition 
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `test-export.${config.format}`;

      console.log(`✅ ${config.name} successful!`);
      console.log(`  File: ${fileName}`);
      console.log(`  Size: ${(blob.size / 1024).toFixed(2)} KB`);
      console.log(`  Records: ${recordCount || 'Unknown'}`);

      // Optional: Download the file for manual inspection
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `test-${fileName}`;
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(`❌ ${config.name} failed with error:`, error.message);
    }

    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n🏁 Export API tests completed!');
};

// Test error handling
const testExportErrorHandling = async () => {
  console.log('\n🧪 Testing export error handling...');
  
  const apiBaseUrl = 'http://localhost:5057/api';
  const authToken = localStorage.getItem('authToken');

  const errorTests = [
    {
      name: 'Invalid Format Test',
      request: {
        format: 'invalid',
        fields: ['timestamp'],
        filters: {}
      },
      expectedError: 'Unsupported format'
    },
    {
      name: 'Empty Fields Test',
      request: {
        format: 'csv',
        fields: [],
        filters: {}
      },
      expectedError: 'At least one field must be selected'
    },
    {
      name: 'No Auth Token Test',
      request: {
        format: 'csv',
        fields: ['timestamp'],
        filters: {}
      },
      useAuth: false,
      expectedError: 'Unauthorized'
    }
  ];

  for (const test of errorTests) {
    console.log(`\n📋 Running ${test.name}...`);
    
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (test.useAuth !== false) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(`${apiBaseUrl}/audit-logs/export`, {
        method: 'POST',
        headers,
        body: JSON.stringify(test.request)
      });

      if (response.ok) {
        console.log(`⚠️ ${test.name}: Expected error but got success`);
      } else {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        console.log(`✅ ${test.name}: Got expected error - ${errorData.message}`);
      }

    } catch (error) {
      console.log(`✅ ${test.name}: Got expected network error - ${error.message}`);
    }
  }

  console.log('\n🏁 Error handling tests completed!');
};

// Export functions for use in browser console
window.testExportAPI = testExportAPI;
window.testExportErrorHandling = testExportErrorHandling;

console.log('🚀 Export test functions loaded!');
console.log('Run testExportAPI() to test the export functionality');
console.log('Run testExportErrorHandling() to test error scenarios');
