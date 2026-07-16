import assert from 'node:assert/strict';
import { getProtectedLayout, intersects } from './marketing-layout.mjs';

const personAssets = [
  'instagram-01-portada',
  'instagram-07-cta-diagnostico',
  'facebook-01-automatizacion-procesos',
  'facebook-02-ia-proceso-ordenado',
  'facebook-03-automatizaciones-arca'
];

for (const id of personAssets) {
  const layout = getProtectedLayout(id);
  assert.equal(layout.panel, null, `${id}: no transparency may cover the portrait`);
  assert.equal(intersects(layout.titleBox, layout.faceBox), false, `${id}: title covers face`);
  assert.equal(intersects(layout.bodyBox, layout.faceBox), false, `${id}: body covers face`);
  assert.equal(intersects(layout.titleBox, {x:18,y:18,w:110,h:110}), false, `${id}: title covers logo`);
}

console.log('ok - portrait-safe text and transparency zones');
