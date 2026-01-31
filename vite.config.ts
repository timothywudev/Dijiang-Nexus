import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vite.dev/config/
export default defineConfig({
  base: '/Dijiang-Nexus/',
  plugins: [
    react(),
    tsconfigPaths({
      projects: ['./tsconfig.json']
    }),
    ViteImageOptimizer({}),
  ],

})
