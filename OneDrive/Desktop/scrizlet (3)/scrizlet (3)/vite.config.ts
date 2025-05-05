import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Provides React Fast Refresh, JSX transform, etc.
    react(),
    // Removed: Custom "mocha-error-reporter" plugin and watermark injection
  ],

  server: {
    // Allow requests from any host (useful for LAN testing)
    allowedHosts: true,
  },
});
// When you run:
// npm run dev
// THis lets me run that and i get a instant change of whatever i fucked up at the given timen 

