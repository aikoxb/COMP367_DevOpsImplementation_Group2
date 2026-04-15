// study-planner-client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], // add the React plugin
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",  // Forward API requests to Express server running on port 4000
        changeOrigin: true, // Changes the origin of the request to match the target server (helps prevent CORS issues)
      },
    },
  },
});
