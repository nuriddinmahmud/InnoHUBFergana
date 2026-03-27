import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const popupSafeHeaders = {
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
  "Cross-Origin-Embedder-Policy": "unsafe-none",
};

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    headers: popupSafeHeaders,
  },
  preview: {
    headers: popupSafeHeaders,
  },
});
