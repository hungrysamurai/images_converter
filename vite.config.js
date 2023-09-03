import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/projects/images_converter",
  plugins: [react()],
  build: {
    outDir: "./build",
    emptyOutDir: true,
  },
});
