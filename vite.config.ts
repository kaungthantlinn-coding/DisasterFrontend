import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    cors: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none'
    }
  },
  optimizeDeps: {
    // Force pre-bundling of dependencies to reduce memory usage
    include: ['react', 'react-dom', 'react-router-dom'],
    // Exclude large dependencies from pre-bundling if not needed immediately
    exclude: ['@playwright/test']
  },
  build: {
    // Reduce memory usage during build
    sourcemap: false,
    // Increase chunk size warning limit to reduce number of chunks
    chunkSizeWarningLimit: 1000
  },
  // Limit the number of workers to reduce memory consumption
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})
