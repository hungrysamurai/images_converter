import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Served by nginx at /projects/images_converter/ (see wrapper repo nginx/locations.conf).
  // The standalone convert-it.ru build overrides it with --base=./
  base: '/projects/images_converter/',
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
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
});
