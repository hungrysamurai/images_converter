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
        // manualChunks(id) {
        //   if (id.includes('src/lib/decoders/singlePage/heic')) {
        //     return 'heic-decoder';
        //   }
        // },
        manualChunks: {
          heic: ['src/lib/decoders/singlePage/heic.ts'],
        },
      },
    },
  },
  worker: {
    format: 'es',
    rollupOptions: {
      output: {
        format: 'es',
        // manualChunks(id) {
        //   if (id.includes('src/lib/decoders/singlePage/heic')) {
        //     return 'heic-decoder';
        //   }
        // },
        manualChunks: {
          heic: ['src/lib/decoders/singlePage/heic.ts'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
