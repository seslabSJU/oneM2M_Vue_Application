import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
})

module.exports = {
  devServer: {
    proxy: {
      '/notifications': {
        target: 'http://localhost:5000', // Node.js 서버
        changeOrigin: true
      }
    }
  }
};
