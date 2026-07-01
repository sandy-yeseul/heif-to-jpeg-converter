import { defineConfig } from "vitest/config";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/heif-to-jpeg-converter/" : "./",
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
  },
  define: {
    __BUNDLED_DEV__: false,
    __SERVER_FORWARD_CONSOLE__: false,
  },
  test: {
    environment: "jsdom",
    include: ["src/__tests__/**/*.test.ts"],
  },
});
