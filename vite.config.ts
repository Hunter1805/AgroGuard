import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Divide o bundle gigante em chunks menores: primeiro carregamento muito
    // mais rápido em celular/4G (o cliente vai usar bastante via celular).
    rolldownOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/ },
            { name: 'supabase', test: /node_modules[\\/]@supabase[\\/]/ },
            // PDF e Excel só são baixados quando o usuário exporta um relatório
            { name: 'pdf', test: /node_modules[\\/](jspdf|jspdf-autotable|canvg|dompurify|fflate|attn\.js)[\\/]/ },
            { name: 'xlsx', test: /node_modules[\\/](xlsx|xlsx-js)[\\/]/ },
            { name: 'vendor', test: /node_modules[\\/]/ },
          ],
        },
      },
    },
  },
})
