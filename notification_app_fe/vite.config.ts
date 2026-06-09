import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/evaluation-service': {
        target: 'http://4.224.186.213',
        changeOrigin: true,
      },
    },
  },
});
