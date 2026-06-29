import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/heif-to-jpeg-converter/" : "./",
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
  },
  optimizeDeps: {
    exclude: ["libheif-js"],
  },
});
