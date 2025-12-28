import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5003",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    css: true,
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      all: true,
      include: ['src/**/*.{jsx,js}'],
      exclude: ['src/setupTests.js', 'src/**/*.test.{jsx,js}']
    }
  },
});
