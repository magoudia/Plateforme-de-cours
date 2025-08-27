import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement en fonction du mode (dev/prod)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react']
    },
    // Configuration du serveur de développement
    server: {
      port: 5173,
      strictPort: true,
      cors: true
    },
    // Configuration pour le build
    build: {
      outDir: 'dist',
      sourcemap: true,
      target: 'esnext',
      commonjsOptions: {
        include: /node_modules/
      }
    },
    // Configuration pour les alias d'import
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  };
});
