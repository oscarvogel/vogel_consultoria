import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const buildStamp = Date.now();

export default defineConfig({
  plugins: [vue()],
  server: {
    watch: {
      usePolling: true,
    },
  },
  build: {
    emptyOutDir: false,
    rollupOptions: {
      output: {
        assetFileNames: `assets/[name]-[hash]-${buildStamp}[extname]`,
      },
      input: {
        main: "index.html",
        ia: "ia.html",
      },
    },
  },
});
