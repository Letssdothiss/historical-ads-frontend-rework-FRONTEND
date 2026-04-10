import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Stencil lazy-loadar *.entry.js med relativa dynamiska imports. Om Vite
  // pre-bundlar dessa paket hamnar importen under .vite/deps/ och chunken
  // laddas med fel MIME / trasig sökväg.
  optimizeDeps: {
    exclude: ['@taxonomy/yrkesvaljaren', '@designsystem-se/af'],
  },
})
