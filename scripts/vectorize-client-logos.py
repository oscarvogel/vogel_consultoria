"""Generate path-based SVGs from the official raster originals.

Requires the local vtracer/Pillow tools; neither is a website dependency.
Usage: python scripts/vectorize-client-logos.py <originals-directory>
The original bitmaps stay outside the repo. No bitmap is embedded in the SVG.
"""
from pathlib import Path
import sys
import xml.etree.ElementTree as ET
from PIL import Image
import vtracer

originals=Path(sys.argv[1])
output=Path('public/clients')
for name in ['an-asociados','indufor','forestal-paraguay','forestal-garuhape','h21','amitrac']:
    source=next(p for p in originals.glob(name+'.*') if p.suffix in ('.png','.jpeg'))
    destination=output/(name+'.svg')
    image=Image.open(source).convert('RGBA')
    trace_source=source
    scale=3 if name=='h21' else 1
    if scale>1:
        trace_source=originals/(name+'-trace.png')
        image.resize((image.width*scale,image.height*scale),Image.Resampling.LANCZOS).save(trace_source)
    vtracer.convert_image_to_svg_py(str(trace_source),str(destination),colormode='color',
        hierarchical='stacked',mode='spline',filter_speckle=4 if name=='indufor' else 8 if scale>1 else 2,
        color_precision=4 if name=='indufor' else 5 if scale>1 else 6,
        layer_difference=32 if name=='indufor' else 24 if scale>1 else 16,
        corner_threshold=60,length_threshold=3.5,
        max_iterations=10,splice_threshold=45,path_precision=2)
    # Tighten only the SVG viewport. The original image and its colours are untouched.
    pixels=image.load();xs=[];ys=[]
    for y in range(image.height):
        for x in range(image.width):
            r,g,b,a=pixels[x,y]
            if a>16 and min(r,g,b)<240:
                xs.append(x);ys.append(y)
    left,top,right,bottom=min(xs),min(ys),max(xs)+1,max(ys)+1
    pad=max(3,round(max(right-left,bottom-top)*.025))
    left=max(0,left-pad);top=max(0,top-pad)
    right=min(image.width,right+pad);bottom=min(image.height,bottom+pad)
    svg=destination.read_text(encoding='utf8')
    import re
    svg=re.sub(r'(<svg\b[^>]*)(>)',lambda m:m[1]+f' viewBox="{left*scale} {top*scale} {(right-left)*scale} {(bottom-top)*scale}"'+m[2],svg,count=1)
    destination.write_text(svg,encoding='utf8')
    root=ET.fromstring(svg)
    assert len(root)>0 and not any(el.tag.endswith('image') for el in root.iter())
    print(f'{name}: {len(svg):,} bytes; viewport {right-left}x{bottom-top}')
