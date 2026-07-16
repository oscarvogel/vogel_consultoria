import assert from 'node:assert/strict';
import { getCtaMetrics, getProtectedLayout, intersects } from './marketing-layout.mjs';

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

const storyCta = getCtaMetrics('whatsapp', 936);
assert.ok(storyCta.height >= 104, 'WhatsApp CTA must be at least 104 px high');
assert.ok(storyCta.fontSize >= 40, 'WhatsApp CTA text must be at least 40 px');
assert.ok(storyCta.domainSize >= 28, 'WhatsApp domain must be at least 28 px');

for (const platform of ['instagram','facebook']) {
  const cta = getCtaMetrics(platform, 936);
  assert.ok(cta.height >= 88, `${platform} CTA must be at least 88 px high`);
  assert.ok(cta.fontSize >= 30, `${platform} CTA text must be at least 30 px`);
}

console.log('ok - CTA minimum sizes by platform');
