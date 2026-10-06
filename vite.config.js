import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
 const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
 const base = env.VITE_BASE_PATH || '/';
 if (!/^\/(?:[A-Za-z0-9_.-]+\/)*$/.test(base) || base.split('/').some(segment => ['.', '..'].includes(segment))) throw new Error('VITE_BASE_PATH must be / or /project/ with safe path segments.');
 return {
  base,
  plugins: [react()],
  define: { __SITE_BUILD_YEAR__: JSON.stringify(new Date().getFullYear()) },
  build: {
    // Give the stable React runtime its own cacheable chunk across site updates.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react-vendor';
        }
      }
    }
  },
  server: {
    host: '127.0.0.1',
    port: 3000,
    open: true
  }
 };
});
