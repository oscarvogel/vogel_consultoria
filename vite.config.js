import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { PrimeVueResolver } from "@primevue/auto-import-resolver";

export default defineConfig({
  plugins: [
    vue(),
    // Auto-importa componentes PrimeVue al usarlos en plantillas; sin uso no añade nada al bundle.
    Components({ dts: false, resolvers: [PrimeVueResolver()] }),
  ],
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
        portfolio0: "info/index.html",
        portfolioSolutions: "soluciones/index.html",
        portfolioStudio: "estudio/index.html",
        portfolioContact: "contacto/index.html",
        portfolio1: "proyectos/caso-forestal/index.html",
        portfolio2: "proyectos/an-asociados/index.html",
        portfolio3: "proyectos/indufor/index.html",
        portfolio4: "proyectos/forestal-paraguay/index.html",
        portfolio5: "proyectos/forestal-garuhape/index.html",
        portfolio6: "proyectos/servin-lgsm/index.html",
        portfolio7: "proyectos/h21/index.html",
        portfolio8: "proyectos/amitrac/index.html",
        portfolio9: "proyectos/municipalidad-garuhape/index.html",
        portfolio10: "proyectos/femag/index.html",
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
        mantenimiento: "mantenimiento-de-equipos/index.html",
        whatsapp: "integraciones-whatsapp/index.html",
        recursos: "recursos/index.html",
        recursoSistema: "recursos/cuando-conviene-sistema-a-medida/index.html",
        recursoDashboards: "recursos/dashboards-ejecutivos-pymes/index.html",
        recursoAutomatizacion: "recursos/automatizacion-procesos-administrativos/index.html",
      },
    },
  },
});
