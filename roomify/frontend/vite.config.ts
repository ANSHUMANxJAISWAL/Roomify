import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load all env variables
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks
            'vendor-react': ['react', 'react-dom'],
            'vendor-router': ['react-router-dom'],
            'vendor-ui': ['framer-motion', 'lucide-react', 'sonner'],
            'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
            'vendor-charts': ['recharts'],
            // Supabase and auth
            'vendor-supabase': ['@supabase/supabase-js', '@supabase/auth-helpers-react'],
            // Utilities
            'vendor-utils': ['axios', 'clsx', 'date-fns', 'tailwind-merge'],
          },
        },
      },
      chunkSizeWarningLimit: 600, // Increase warning limit to 600KB
    },
    define: {
      'process.env': {
        VITE_SUPABASE_URL: JSON.stringify(env.VITE_SUPABASE_URL),
        VITE_SUPABASE_ANON_KEY: JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      },
    },
  };
});
