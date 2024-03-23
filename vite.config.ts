import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // base: "/",
  base: "/projects/images_converter",
  plugins: [react()],
  build: {
    outDir: "./dist",
    emptyOutDir: true,
  },
});
