"""Computes an alpha matte of Oscar Vogel's portrait (background removal only).

Run from a throw-away virtualenv kept OUTSIDE the repository:
    python -m venv <short-path>/vm && <short-path>/vm/Scripts/pip install "rembg[cpu]" pillow
    <short-path>/vm/Scripts/python scripts/oscar-matte.py <matte-output.png>

The model is downloaded once by rembg; the photo is processed locally. The matte is then refined and applied by
scripts/derive-oscar-cutout.mjs. Facial features are never modified: only the alpha channel is produced.
"""
import sys
from pathlib import Path
from PIL import Image
from rembg import new_session, remove

source = Path("src/assets/oscar_vogel_imagen.png")
target = Path(sys.argv[1])
model = sys.argv[2] if len(sys.argv) > 2 else "birefnet-portrait"
session = new_session(model)
cutout = remove(Image.open(source).convert("RGB"), session=session, only_mask=True, post_process_mask=False)
cutout.save(target)
print(f"matte written to {target} with {model} ({cutout.size[0]}x{cutout.size[1]})")
