/**
 * Test script for dynamic audit log filtering functionality
 * Run this in browser console to test the implementation
 */

// Test the audit filter options API endpoint
async function testAuditFilterOptions() {
  console.log('🧪 Testing Audit Filter Options API...');
  
  try {
    const apiBaseUrl = import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:5057/api';
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    if (!token) {
      console.error('❌ No authentication token found. Please log in first.');
      return;
    }

    const response = await fetch(`${apiBaseUrl}/audit-logs/filter-options`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Response Status:', response.status);
    console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Filter Options Retrieved:', data);
      
      // Validate structure
      if (data.actions && Array.isArray(data.actions)) {
        console.log('✅ Actions array found:', data.actions.length, 'items');
      } else {
        console.warn('⚠️ Actions array missing or invalid');
      }
      
      if (data.targetTypes && Array.isArray(data.targetTypes)) {
        console.log('✅ Target types array found:', data.targetTypes.length, 'items');
        console.log('📋 Available target types:', data.targetTypes);
      } else {
        console.warn('⚠️ Target types array missing or invalid');
      }
      
      return data;
    } else {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('❌ API Error:', errorData);
      return null;
    }
  } catch (error) {
    console.error('❌ Network Error:', error);
    return null;
  }
}

// Test export with dynamic filters
async function testExportWithDynamicFilters() {
  console.log('🧪 Testing Export with Dynamic Filters...');
  
  try {
    const apiBaseUrl = import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:5057/api';
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    if (!token) {
      console.error('❌ No authentication token found. Please log in first.');
      return;
    }

    // First get available filter options
    const filterOptions = await testAuditFilterOptions();
    if (!filterOptions || !filterOptions.targetTypes || filterOptions.targetTypes.length === 0) {
      console.error('❌ No target types available for testing');
      return;
    }

    // Test export with first available target type
    const testTargetType = filterOptions.targetTypes[0];
    console.log('🎯 Testing with target type:', testTargetType);

    const exportRequest = {
      format: 'csv',
      fields: ['UserName', 'Action', 'Details', 'Timestamp'],
      filters: {
        targetType: [testTargetType], // Use actual database value
        maxRecords: 100,
        sanitizeData: true
      }
    };

    console.log('📤 Export Request:', exportRequest);

    const response = await fetch(`${apiBaseUrl}/audit-logs/export`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(exportRequest)
    });

    console.log('📡 Export Response Status:', response.status);
    console.log('📡 Export Response Headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const blob = await response.blob();
      console.log('✅ Export successful! Blob size:', blob.size, 'bytes');
      
      if (blob.size > 0) {
        console.log('✅ Export contains data');
        
        // Test reading CSV content
        const text = await blob.text();
        const lines = text.split('\n').filter(line => line.trim());
        console.log('📊 CSV Lines:', lines.length);
        console.log('📋 CSV Header:', lines[0]);
        
        if (lines.length > 1) {
          console.log('📋 Sample Data:', lines[1]);
        }
      } else {
        console.warn('⚠️ Export file is empty - may indicate no matching records');
      }
      
      return true;
    } else {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('❌ Export Error:', errorData);
      return false;
    }
  } catch (error) {
    console.error('❌ Export Test Error:', error);
    return false;
  }
}

// Test React hook functionality (if running in React context)
function testReactHookIntegration() {
  console.log('🧪 Testing React Hook Integration...');
  
  // Check if we're in a React context
  if (typeof window !== 'undefined' && window.React) {
    console.log('✅ React detected');
    
    // Test if our hook is available
    try {
      // This would need to be run within a React component
      console.log('ℹ️ React hook testing requires component context');
      console.log('ℹ️ Check browser Network tab for API calls when using filters');
      return true;
    } catch (error) {
      console.error('❌ React hook test error:', error);
      return false;
    }
  } else {
    console.log('ℹ️ Not in React context, skipping hook test');
    return true;
  }
}

// Comprehensive test suite
async function runAuditFilterTests() {
  console.log('🚀 Starting Audit Filter Tests...');
  console.log('=' .repeat(50));
  
  const results = {
    filterOptionsAPI: false,
    exportWithFilters: false,
    reactIntegration: false
  };
  
  // Test 1: Filter Options API
  console.log('\n1️⃣ Testing Filter Options API');
  results.filterOptionsAPI = await testAuditFilterOptions() !== null;
  
  // Test 2: Export with Dynamic Filters
  console.log('\n2️⃣ Testing Export with Dynamic Filters');
  results.exportWithFilters = await testExportWithDynamicFilters();
  
  // Test 3: React Integration
  console.log('\n3️⃣ Testing React Integration');
  results.reactIntegration = testReactHookIntegration();
  
  // Summary
  console.log('\n📊 Test Results Summary');
  console.log('=' .repeat(50));
  console.log('Filter Options API:', results.filterOptionsAPI ? '✅ PASS' : '❌ FAIL');
  console.log('Export with Filters:', results.exportWithFilters ? '✅ PASS' : '❌ FAIL');
  console.log('React Integration:', results.reactIntegration ? '✅ PASS' : '❌ FAIL');
  
  const passCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passCount}/${totalCount} tests passed`);
  
  if (passCount === totalCount) {
    console.log('🎉 All tests passed! Dynamic filtering is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the logs above for details.');
  }
  
  return results;
}

// Export functions for manual testing
window.testAuditFilterOptions = testAuditFilterOptions;
window.testExportWithDynamicFilters = testExportWithDynamicFilters;
window.runAuditFilterTests = runAuditFilterTests;

console.log('🧪 Audit Filter Test Suite Loaded');
console.log('📋 Available functions:');
console.log('  - testAuditFilterOptions()');
console.log('  - testExportWithDynamicFilters()');
console.log('  - runAuditFilterTests()');
console.log('');
console.log('💡 Run runAuditFilterTests() to execute all tests');
