<script setup>
import { webProjects } from '../../data/projects.js';
import '../../styles/editorial.css';
// Every logo ships on a white ground, so all are inverted to light monochrome and blended onto the page.
</script>
<template>
  <section id="clientes" class="ed-section ed-work" aria-labelledby="trabajo-heading" data-ed-section>
    <div class="ed-shell">
      <header class="ed-head" data-ed-item>
        <p class="ed-kicker">Trabajo real</p>
        <h2 id="trabajo-heading" class="ed-title">Empresas y organizaciones con las que trabajamos.</h2>
      </header>

      <ul class="work-logos" aria-label="Sitios web desarrollados" data-ed-item>
        <li v-for="project in webProjects" :key="project.url">
          <a :href="project.url" target="_blank" rel="noopener noreferrer" :aria-label="'Visitar sitio de ' + project.name" data-analytics-cta="home_client_site" :data-analytics-label="project.name">
            <img v-if="project.logo" :src="project.logo" :alt="project.name" width="280" height="160" loading="lazy" decoding="async" />
            <span v-else>{{ project.name }}</span>
          </a>
        </li>
      </ul>

      <article id="femag" class="work-femag" data-ed-item>
        <div>
          <p class="work-femag-state">Proyecto en desarrollo</p>
          <h3>FEMAG</h3>
        </div>
        <div>
          <p class="work-femag-line">Gestión operativa para una fábrica de fécula de mandioca.</p>
          <p class="work-femag-copy">Aplicación de escritorio conectada a MySQL para ordenar clientes, productos, transporte, órdenes de carga, remitos, cuenta corriente, permisos y auditoría.</p>
          <details class="ed-detail">
            <summary>Ver alcance</summary>
            <ul class="work-femag-scope">
              <li>Aplicación local para 5/6 puestos en red interna</li>
              <li>Dashboard central y menú operativo simple</li>
              <li>Órdenes de carga y remitos imprimibles</li>
              <li>Importación incremental desde MySQL y DBF</li>
            </ul>
          </details>
          <a class="ed-link" href="https://femag.com.ar/" target="_blank" rel="noopener noreferrer">femag.com.ar</a>
        </div>
      </article>
    </div>
  </section>
</template>
