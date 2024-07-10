import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: 'src/index.js',
      output: {
        entryFileNames: 'antiquity.js',
        format: 'es',
      },
    },
  },
})