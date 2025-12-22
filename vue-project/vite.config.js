import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port:4000,
    proxy:{
      '/TinyIoT': {
        target: 'https://onem2m.iotcoss.ac.kr',
        changeOrigin: true,
        secure: true
      }, 
      '/Mobius': {
        target: 'https://onem2m.iotcoss.ac.kr',
        changeOrigin: true,
        secure: true
      }
    },
  },
})
