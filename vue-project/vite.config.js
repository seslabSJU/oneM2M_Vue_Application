import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port:4000,
    proxy:{
      '/tinyIoT': {
        target: 'https://onem2m.iotcoss.ac.kr',
        changeOrigin: true,
        secure: true
      }, 
      '/Mobius': {
        target: 'https://onem2m.iotcoss.ac.kr',
        changeOrigin: true,
        secure: true
      },
      /*'/TinyIoT': {
        target: '127.0.0.1:3000',
        changeOrigin: true,
        secure: false
      }*/
    },
  },
})
