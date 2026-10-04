import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',        // bind to all interfaces so Docker can expose the port
    port: 5173,
    strictPort: true,
    // On Windows/macOS Docker Desktop, filesystem events don't cross the VM
    // boundary — polling is required for HMR to detect file changes.
    watch: {
      usePolling: true,
      interval: 300,
    },
    hmr: {
      // Tell the browser to connect the HMR WebSocket back to localhost:5173
      // (the mapped port), not the container's internal address.
      clientPort: 5173,
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL ?? 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
