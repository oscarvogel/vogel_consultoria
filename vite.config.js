import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    preserveSymlinks: true,
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
  build: {
    emptyOutDir: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        manualChunks: {
          vue: ["vue"],
        },
      },
      input: {
        main: "index.html",
        iaLegacy: "ia.html",
        inteligenciaArtificial: "inteligencia-artificial/index.html",
        encuestaContadores: "encuesta-contadores/index.html",
        automatizaciones: "automatizaciones/index.html",
        sistemas: "sistemas-a-medida/index.html",
        dashboards: "dashboards-ejecutivos/index.html",
        automatizacion: "automatizacion-de-procesos/index.html",
        contaflow: "contaflow-api-facturacion-electronica/index.html",
        web: "desarrollo-web/index.html",
        talleres: "talleres-ia/index.html",
        recursos: "recursos/index.html",
        recursoSistema: "recursos/cuando-conviene-sistema-a-medida/index.html",
        recursoDashboards: "recursos/dashboards-ejecutivos-pymes/index.html",
        recursoAutomatizacion: "recursos/automatizacion-procesos-administrativos/index.html",
      },
    },
  },
});
