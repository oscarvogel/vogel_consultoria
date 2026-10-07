import { POST_BUDGET } from './postPipeline.js';

// Scene objects per mode, in scene order. Tests read these instead of literal counts.
const core = ['grid', 'terrain', 'pillars', 'pillarTips'];
const narrative = ['grid', 'terrain', 'clusters', 'threads', 'pillars', 'pillarTips'];
const phase03 = ['grid', 'terrain', 'clusters', 'threads', 'extra', 'dust', 'threadFlow', 'pillars', 'pillarTips'];

const budget = objects => Object.freeze({
  objects: Object.freeze(objects),
  sceneCalls: objects.length,
  postCalls: POST_BUDGET.calls,
  calls: objects.length + POST_BUDGET.calls,
  geometries: objects.length + POST_BUDGET.geometries,
  textures: POST_BUDGET.textures,
});

export const RENDER_BUDGET = Object.freeze({ core: budget(core), narrative: budget(narrative), phase03: budget(phase03) });
export const renderMode = ({ narrative: n = false, phase03: p = false } = {}) => p ? 'phase03' : n ? 'narrative' : 'core';
