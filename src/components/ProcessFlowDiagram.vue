<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  nodes: { type: Array, required: true },
});
</script>

<template>
  <figure class="process-flow" :aria-label="title">
    <figcaption class="process-flow__caption">
      <span>Esquema de trabajo</span>
      <p>{{ description }}</p>
    </figcaption>
    <ol class="process-flow__nodes">
      <li v-for="(node, index) in nodes" :key="node.title" class="process-flow__node">
        <span class="process-flow__index">{{ String(index + 1).padStart(2, '0') }}</span>
        <h3>{{ node.title }}</h3>
        <p>{{ node.description }}</p>
      </li>
    </ol>
    <p class="process-flow__note">{{ title }}</p>
  </figure>
</template>

<style scoped>
.process-flow {
  --flow-line: rgb(var(--vogel-amber) / 0.28);
  min-width: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-frame);
  padding: clamp(22px, 3.5vw, 40px);
  background: var(--color-panel);
}

.process-flow__caption > span,
.process-flow__note {
  color: var(--color-action);
  font-size: 0.75rem;
  font-weight: 650;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.process-flow__caption > p {
  max-width: 40ch;
  margin-top: 0.75rem;
  color: var(--color-text);
  font-size: clamp(1.2rem, 2.2vw, 1.65rem);
  line-height: 1.3;
}

.process-flow__nodes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 16px;
  margin: 34px 0 0;
  padding: 0;
  list-style: none;
}

.process-flow__node {
  position: relative;
  min-width: 0;
  padding-top: 24px;
  border-top: 1px solid var(--flow-line);
}

.process-flow__node::before {
  position: absolute;
  top: -6px;
  left: 0;
  width: 11px;
  height: 11px;
  border: 2px solid var(--color-action);
  border-radius: 50%;
  background: var(--color-background);
  content: "";
}

.process-flow__index {
  display: block;
  margin-bottom: 12px;
  color: var(--color-link);
  font-size: 0.7rem;
  font-variant-numeric: tabular-nums;
}

.process-flow__node h3 {
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 550;
  line-height: 1.25;
}

.process-flow__node p {
  margin-top: 8px;
  color: var(--color-muted);
  font-size: 0.82rem;
  line-height: 1.55;
}

.process-flow__note {
  margin-top: 28px;
  color: var(--color-muted);
  font-size: 0.65rem;
}

@media (max-width: 639px) {
  .process-flow__nodes {
    grid-template-columns: 1fr;
    gap: 0;
    margin-top: 26px;
  }

  .process-flow__node {
    padding: 0 0 22px 26px;
    border-top: 0;
    border-left: 1px solid var(--flow-line);
  }

  .process-flow__node::before {
    top: 3px;
    left: -6px;
  }

  .process-flow__node:last-child {
    padding-bottom: 0;
    border-left-color: transparent;
  }

  .process-flow__index {
    margin-bottom: 6px;
  }
}
</style>
