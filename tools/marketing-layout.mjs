const layouts = {
  'instagram-01-portada': {
    panel: null,
    faceBox: {x:730,y:145,w:350,h:935},
    titleBox: {x:72,y:165,w:620,h:220},
    bodyBox: {x:72,y:430,w:610,h:95},
    x:72, top:205, titleSize:58, titleStep:63, bodyY:430, bodySize:27, bodyStep:36
  },
  'instagram-07-cta-diagnostico': {
    panel: null,
    faceBox: {x:0,y:100,w:600,h:980},
    titleBox: {x:620,y:135,w:410,h:205},
    bodyBox: {x:620,y:375,w:400,h:95},
    x:620, top:175, titleSize:47, titleStep:52, bodyY:375, bodySize:25, bodyStep:34, ctaX:620
  },
  'facebook-01-automatizacion-procesos': {
    panel: null,
    faceBox: {x:430,y:270,w:650,h:1080},
    titleBox: {x:72,y:135,w:500,h:125},
    bodyBox: {x:72,y:300,w:340,h:125},
    x:72, top:170, titleSize:38, titleStep:42, bodyY:300, bodySize:25, bodyStep:34, ctaX:72
  },
  'facebook-02-ia-proceso-ordenado': {
    panel: null,
    faceBox: {x:0,y:200,w:530,h:1150},
    titleBox: {x:550,y:105,w:470,h:175},
    bodyBox: {x:550,y:330,w:460,h:125},
    x:550, top:145, titleSize:46, titleStep:51, bodyY:330, bodySize:24, bodyStep:33, ctaX:550
  },
  'facebook-03-automatizaciones-arca': {
    panel: null,
    faceBox: {x:570,y:210,w:510,h:1140},
    titleBox: {x:72,y:135,w:480,h:135},
    bodyBox: {x:72,y:330,w:470,h:125},
    x:72, top:170, titleSize:40, titleStep:44, bodyY:330, bodySize:24, bodyStep:33, ctaX:72
  }
};

export function getProtectedLayout(id) {
  const layout = layouts[id];
  if (!layout) throw new Error(`No protected layout for ${id}`);
  return layout;
}

export function getOptionalProtectedLayout(id) {
  return layouts[id] ?? null;
}

export function intersects(a,b) {
  return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
}
