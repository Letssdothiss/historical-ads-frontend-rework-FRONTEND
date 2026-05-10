import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
  plugins: [react()],
  define: {
    'process.env.REACT_APP_BASE_URL': JSON.stringify(env.REACT_APP_BASE_URL ?? 'http://localhost:5000'),
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.js',
    passWithNoTests: true,
  },
  // Stencil lazy-loadar *.entry.js med relativa dynamiska imports. Om Vite
  // pre-bundlar dessa paket hamnar importen under .vite/deps/ och chunken
  // laddas med fel MIME / trasig sökväg.
  optimizeDeps: {
    exclude: ['@taxonomy/yrkesvaljaren', '@designsystem-se/af'],
  },
  }
})
