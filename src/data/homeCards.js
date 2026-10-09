import { forestCase } from './forestCase.js';
import { portfolioProjects } from './projects.js';
import projectColors from './projectColors.json';
// Generated card art (scripts/derive-card-art.mjs). Covers the card only: the reader keeps the real captures.
// position frames each logo in the tall crops (4:5 grid, phone carousel); in the 16:9 desktop crop only the vertical value matters; fit/background are only for plates that must not be cropped.
const cardArt = {
  'caso-forestal': { position: '20% 45%' },
  'an-asociados': { position: '26% 45%' },
  indufor: { position: '50% 30%' },
  'forestal-paraguay': { position: '50% 40%' },
  'forestal-garuhape': { position: '15% 50%' },
  amitrac: { position: '0% 40%' },
  h21: { position: '82% 38%' },
  'municipalidad-garuhape': { position: '77% 45%' },
  'servin-lgsm': { position: '50% 50%', fit: 'contain', background: '#021c3d' },
  femag: { position: '50% 50%', fit: 'contain', background: '#020f1f', width: 1280, height: 1600 },
  pyfe: { position: '50% 50%', fit: 'contain', background: '#020f1f', width: 1280, height: 1600 },
  mantenimiento: { position: '50% 50%', fit: 'contain', background: '#07182d', width: 1280, height: 1600 },
  'vogel-whatsapp-api': { position: '50% 50%', fit: 'contain', background: '#071514', width: 1280, height: 1600 },
};
const withArt = (id, card) => cardArt[id]
  ? { ...card, art: `/projects/${id}/art.webp`, artSmall: `/projects/${id}/art-800.webp`, artPosition: cardArt[id].position, artFit: cardArt[id].fit, artBackground: cardArt[id].background, artWidth: cardArt[id].width, artHeight: cardArt[id].height }
  : card;
export const forestProject = withArt('caso-forestal', {
  id: 'caso-forestal', title: 'Sistema Registro de Producción', category: 'Digitalización operativa',
  tag: 'Datos de demostración', href: '/proyectos/caso-forestal/', image: forestCase.steps[2].desktopDisplayImage,
  alt: forestCase.steps[2].alt, description: forestCase.intro, context: forestCase.context,
  cta: 'home_case_forestal', forest: true, accent: projectColors['caso-forestal'],
});
// Soluciones lives in Info. The portfolio contains verified work; card art only dresses the card.
const cards = [forestProject, ...portfolioProjects.filter(project => project.available).map(project => withArt(project.id, {
  ...project, title: project.id==='mantenimiento'?'Gestión de flotas':project.name, category: project.type, tag: project.tag || 'Proyecto web',
  href: `/proyectos/${project.id}/`, image: project.cover, imageSmall: project.cover.replace('cover.webp', 'cover-800.webp'), cta: `home_case_${project.id}`,
  accent: projectColors[project.id],
}))];
// Display order: neighbouring projects must not share a backdrop colour (greens, cool blues and the olive are interleaved).
// The first card stays the Sistema Registro de Producción: index.html preloads its art as the LCP image.
// scripts/test-motion.mjs fails if two neighbours are less than 30° apart in hue.
export const displayOrder = ['caso-forestal', 'amitrac', 'indufor', 'an-asociados', 'forestal-paraguay', 'h21', 'forestal-garuhape', 'servin-lgsm', 'femag', 'pyfe', 'vogel-whatsapp-api', 'mantenimiento', 'municipalidad-garuhape'];
export const homeCards = [...cards].sort((a, b) => {
  const position = id => { const at = displayOrder.indexOf(id); return at === -1 ? displayOrder.length : at; };
  return position(a.id) - position(b.id);
});
export const getProject = id => homeCards.find(project => project.id === id) || null;
