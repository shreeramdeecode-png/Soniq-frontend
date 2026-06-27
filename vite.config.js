import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://soniqbackend.deecodes.io',
        changeOrigin: true,
        secure: true,
      },
      '/webhooks': {
        target: 'https://soniqbackend.deecodes.io',
        changeOrigin: true,
        secure: true,
      },
      '^/screenshots/.+': {
        target: 'https://soniqbackend.deecodes.io',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
