import assert from 'node:assert/strict';
import fs from 'node:fs';
import { capabilities, alsoServices } from '../src/data/capabilities.js';
import { methodSteps, methodInputs } from '../src/data/method.js';
import { oscarExperience, oscarMilestones, oscarCapabilities, oscarSkills, oscarProfile } from '../src/data/oscar.js';
import { resources } from '../src/data/resources.js';
import { servicePages } from '../src/data/servicePages.js';
import { phase03Moments, narrativeChapters } from '../src/lib/narrativeScenes.js';

// Capability Index: six rows, real routes, and every service route stays reachable from the home.
assert.equal(capabilities.length, 6);
const routes = new Set([...Object.values(servicePages).map(s => s.path), '/inteligencia-artificial/', '/automatizaciones/']);
for (const c of [...capabilities, ...alsoServices]) {
  assert(routes.has(c.href), `capability ${c.title || c.label} points to an unknown route ${c.href}`);
  assert(c.cta && c.cta.startsWith('home_'), 'analytics hook preserved');
}
const reachable = new Set([...capabilities, ...alsoServices].map(c => c.href));
for (const route of routes) assert(reachable.has(route), `service route ${route} would no longer be reachable from the home`);
assert.equal(new Set(capabilities.map(c => c.id)).size, 6);

// The index must not repeat the spatial arc's chapter titles.
const arcTitles = ['Sistemas que ordenan.', 'Procesos que avanzan.', 'Datos que explican.', 'IA con criterio.', ...phase03Moments.map(m => m.title)];
for (const c of capabilities) for (const title of arcTitles) assert.notEqual(c.title.toLowerCase(), title.toLowerCase(), `index repeats arc title: ${title}`);

// Método Vogel: five steps in order, own vocabulary, numbered 01–05.
assert.deepEqual(methodSteps.map(s => s.label), ['Observar', 'Ordenar', 'Conectar', 'Decidir', 'Mejorar']);
assert.deepEqual(methodSteps.map(s => s.number), ['01', '02', '03', '04', '05']);
assert.deepEqual(methodInputs, ['Personas', 'Procesos', 'Datos', 'Tecnología']);
for (const legacy of ['Diagnóstico', 'Diseño', 'Implementación', 'Resultados']) assert(!methodSteps.some(s => s.label === legacy), `${legacy} is the old generic method`);
assert(methodSteps.every(s => s.text.length > 10 && !/patent|registrad/i.test(s.text)), 'presented as working language, never as a registered methodology');

// Oscar: milestones come from the real experience; nothing is invented.
assert.equal(oscarMilestones.length, oscarExperience.length);
for (const item of oscarExperience) assert(item.period.includes(item.year), `${item.title}: year ${item.year} not in period ${item.period}`);
assert.deepEqual(oscarMilestones.map(m => m.year), ['1998', '2008', '2021', '2024']);
assert.deepEqual(oscarCapabilities, ['Sistemas de gestión', 'Automatización', 'Integraciones', 'Datos y reporting', 'Desarrollo', 'Capacitación']);
assert(oscarSkills.length >= 6 && oscarProfile.years === 25 && oscarProfile.cv === '/cv-jose-oscar-vogel.pdf');
assert(fs.existsSync('public/cv-jose-oscar-vogel.pdf'), 'CV stays downloadable');
for (const file of ['480', '720', '1024']) assert(fs.existsSync(`src/assets/oscar/oscar-vogel-${file}.webp`));
const provenance = JSON.parse(fs.readFileSync('src/assets/oscar/provenance.json', 'utf8'));
assert(/real/i.test(provenance.origin) && /sin retoque/i.test(provenance.derivation), 'portrait provenance documents a real, untouched photo');

// Perspectivas: three real guides from the resources data.
assert(resources.length >= 3);
for (const r of resources.slice(0, 3)) assert(r.path.startsWith('/recursos/') && r.shortTitle && r.eyebrow && r.readTime, `resource ${r.id} lacks editorial fields`);

// Evidence copy: one discreet note that keeps the exact required sentence.
// (forestCase.js imports image assets Node cannot load, so it is checked as source.)
const forest = fs.readFileSync('src/data/forestCase.js', 'utf8');
assert(forest.includes("caveat:'Las cifras no representan resultados de un cliente.'"));
assert(/footnote:'[^']*interfaz real[^']*'/.test(forest) && !/footnote:'[^']*Las cifras/.test(forest));
assert(!/intro:'[^']*datos de demostración/.test(forest), 'the demo-data note lives once, in the footnote');

// Chapter numbering is untouched: the editorial half is not part of the spatial catalog.
assert.equal(narrativeChapters.length, 8);

// Flag wiring: P05 implies P04, the sections exist and the base path is untouched.
const app = fs.readFileSync('src/App.vue', 'utf8');
assert(/phase05Enabled\s*=\s*import\.meta\.env\.VITE_SPATIAL_PHASE_05\s*===\s*'true'/.test(app));
assert(/phase04Enabled\s*=\s*phase05Enabled\s*\|\|/.test(app));
for (const name of ['CapabilityIndex', 'MethodVogel', 'PersonChapter', 'RealWork', 'PerspectivesSection', 'ConversationSection']) assert(app.includes(`<${name} />`), `${name} not rendered`);
for (const name of ['ServicesSection', 'ProcessSection', 'AboutSection', 'CTASection', 'EvidenceSection']) assert(app.includes(`<${name} />`), `${name} must stay available for the base home`);
assert(fs.readFileSync('.env.example', 'utf8').includes('VITE_SPATIAL_PHASE_05=false'), 'flag off by default');

// No generic-SaaS shapes in the editorial CSS: radii ≤ 8px for controls/frames (22px only on the device frame elsewhere), no shadows, no cards.
const css = fs.readFileSync('src/styles/editorial.css', 'utf8');
for (const [, value] of css.matchAll(/border-radius:\s*([^;}]+)/g)) {
  for (const n of value.match(/\d+(?:\.\d+)?px/g) || []) assert(parseFloat(n) <= 8 || value.includes('50%'), `border-radius ${value} exceeds the 8px editorial limit`);
}
assert(!/box-shadow/.test(css), 'editorial surfaces rely on borders and space, not shadows');
assert(!/backdrop-filter/.test(css), 'no glass in the editorial system');
assert(!/<canvas|three/i.test(fs.readFileSync('src/components/editorial/ConversationSection.vue', 'utf8')), 'no WebGL in the closing');

// Form logic is shared, not duplicated.
const composable = fs.readFileSync('src/composables/useContactForm.js', 'utf8');
assert(composable.includes('api.web3forms.com/submit') && composable.includes('contact_form_submit'));
for (const file of ['src/components/CTASection.vue', 'src/components/editorial/ConversationSection.vue']) {
  const source = fs.readFileSync(file, 'utf8');
  assert(source.includes('useContactForm') && !source.includes('api.web3forms.com'), `${file} must use the shared composable`);
}
console.log('ok - Phase 5 data: capability index, Método Vogel, Oscar milestones, perspectives, flag wiring, editorial CSS limits and shared form logic');
