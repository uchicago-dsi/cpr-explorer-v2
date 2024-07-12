import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'procces.env': {
      'VITE_DATA_ENDOINT': ''
    }
  }
})
