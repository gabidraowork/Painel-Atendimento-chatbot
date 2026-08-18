import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: "frontend",
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/auth": "http://localhost:3000",
      "/clients": "http://localhost:3000",
      "/users": "http://localhost:3000",
      "/automation": "http://localhost:3000",
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
