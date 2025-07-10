import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0, // Fixed: cacheTime is now gcTime in newer versions
      },
      mutations: {
        retry: false,
      },
    },
  });

// Custom render function that includes common providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const testQueryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Helper function for components that only need Router
const renderWithRouter = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>{children}</BrowserRouter>
  );
  
  return render(ui, { wrapper: RouterWrapper, ...options });
};

// Helper function for components that only need QueryClient
const renderWithQueryClient = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  const testQueryClient = createTestQueryClient();
  
  const QueryWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
  
  return render(ui, { wrapper: QueryWrapper, ...options });
};

// Mock user object for testing
export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  avatar: 'https://example.com/avatar.jpg',
};

// Mock report data for testing
export const mockReport = {
  id: '1',
  title: 'Test Report',
  description: 'This is a test report',
  location: 'Test Location',
  type: 'flood',
  severity: 'high',
  reportedBy: mockUser,
  createdAt: new Date().toISOString(),
  status: 'active',
};

// Export everything
export * from '@testing-library/react';
export { customRender as render, renderWithRouter, renderWithQueryClient };
export { createTestQueryClient };