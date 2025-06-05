import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

import { analyzer } from 'vite-bundle-analyzer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), analyzer()],
  build: {
    outDir: 'build',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('.wasm') || id.includes('libheif-js') || id.includes('wasm-bundle')) {
            return 'wasm-vendor';
          }
          if (id.includes('src/lib/decoders/')) {
            return 'decoders';
          }
        },
      },
    },
  },
  worker: {
    format: 'es',
    rollupOptions: {
      output: {
        format: 'es',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
