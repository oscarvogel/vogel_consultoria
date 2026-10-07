import { forestCase } from './forestCase.js';
import { webProjects } from './projects.js';
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
};
const withArt = (id, card) => cardArt[id]
  ? { ...card, art: `/projects/${id}/art.webp`, artSmall: `/projects/${id}/art-800.webp`, artPosition: cardArt[id].position, artFit: cardArt[id].fit, artBackground: cardArt[id].background }
  : card;
export const forestProject = withArt('caso-forestal', {
  id: 'caso-forestal', title: 'Sistema Registro de Producción', category: 'Digitalización operativa',
  tag: 'Datos de demostración', href: '/proyectos/caso-forestal/', image: forestCase.steps[2].desktopDisplayImage,
  alt: forestCase.steps[2].alt, description: forestCase.intro, context: forestCase.context,
  cta: 'home_case_forestal', forest: true, accent: projectColors['caso-forestal'],
});
// Soluciones lives in Info. The portfolio contains verified work; card art only dresses the card.
export const homeCards = [forestProject, ...webProjects.filter(project => project.available).map(project => withArt(project.id, {
  ...project, title: project.name, category: project.type, tag: 'Proyecto web',
  href: `/proyectos/${project.id}/`, image: project.cover, imageSmall: project.cover.replace('cover.webp', 'cover-800.webp'), cta: `home_case_${project.id}`,
  accent: projectColors[project.id],
}))];
export const getProject = id => homeCards.find(project => project.id === id) || null;
