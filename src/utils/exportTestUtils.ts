// Test utilities for audit log export functionality
export interface ExportTestConfig {
  format: 'csv' | 'excel' | 'pdf';
  fields: string[];
  filters?: any;
  expectedRecordCount?: number;
}

export const defaultExportFields = [
  'timestamp',
  'userName',
  'action',
  'targetType',
  'targetName',
  'severity',
  'ipAddress'
];

export const testExportConfigs: ExportTestConfig[] = [
  {
    format: 'csv',
    fields: defaultExportFields,
    filters: {
      severity: 'High',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // Last 7 days
    }
  },
  {
    format: 'excel',
    fields: ['timestamp', 'userName', 'action', 'details'],
    filters: {
      action: 'Login',
      startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Last 24 hours
    }
  },
  {
    format: 'pdf',
    fields: ['timestamp', 'userName', 'action', 'severity'],
    filters: {
      targetType: 'User'
    }
  }
];

export async function testExportFunctionality(
  exportFunction: (format: string, fields: string[], filters: any) => Promise<void>,
  config: ExportTestConfig
): Promise<{ success: boolean; error?: string; duration: number }> {
  const startTime = Date.now();
  
  try {
    console.log(`Testing export with config:`, config);
    
    await exportFunction(config.format, config.fields, config.filters || {});
    
    const duration = Date.now() - startTime;
    console.log(`Export test completed successfully in ${duration}ms`);
    
    return { success: true, duration };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error(`Export test failed:`, error);
    
    return { success: false, error: errorMessage, duration };
  }
}

export async function runAllExportTests(
  exportFunction: (format: string, fields: string[], filters: any) => Promise<void>
): Promise<void> {
  console.log('Starting comprehensive export functionality tests...');
  
  const results = [];
  
  for (const config of testExportConfigs) {
    const result = await testExportFunctionality(exportFunction, config);
    results.push({ config, result });
    
    // Wait between tests to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  const successful = results.filter(r => r.result.success).length;
  const failed = results.filter(r => !r.result.success).length;
  
  console.log(`\n=== Export Test Results ===`);
  console.log(`Total tests: ${results.length}`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${failed}`);
  
  if (failed > 0) {
    console.log(`\nFailed tests:`);
    results
      .filter(r => !r.result.success)
      .forEach(({ config, result }) => {
        console.log(`- ${config.format.toUpperCase()} export: ${result.error}`);
      });
  }
  
  console.log(`\nAverage duration: ${Math.round(results.reduce((sum, r) => sum + r.result.duration, 0) / results.length)}ms`);
}

// Mock data for testing when backend is not available
export const mockAuditLogData = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    userName: 'admin@disaster.gov',
    action: 'User Login',
    targetType: 'Authentication',
    targetName: 'System',
    severity: 'Low',
    ipAddress: '192.168.1.100',
    details: 'Successful login from admin panel'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    userName: 'john.doe@emergency.gov',
    action: 'Incident Created',
    targetType: 'Incident',
    targetName: 'INC-2024-001',
    severity: 'High',
    ipAddress: '10.0.0.45',
    details: 'Emergency incident reported in downtown area'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    userName: 'jane.smith@police.gov',
    action: 'Evidence Upload',
    targetType: 'Evidence',
    targetName: 'EVD-2024-015',
    severity: 'Critical',
    ipAddress: '172.16.0.23',
    details: 'Digital evidence uploaded for case investigation'
  }
];

export function generateMockCSV(data: any[], fields: string[]): string {
  const headers = fields.join(',');
  const rows = data.map(item => 
    fields.map(field => `"${item[field] || ''}"`).join(',')
  );
  
  return [headers, ...rows].join('\n');
}
