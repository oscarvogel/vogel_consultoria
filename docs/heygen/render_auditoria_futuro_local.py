from __future__ import annotations

import math
import shutil
import subprocess
import wave
from functools import lru_cache
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "docs" / "heygen" / "auditoria-futuro-local"
FRAMES_DIR = OUT_DIR / "frames_render"
VIDEO_NO_AUDIO = OUT_DIR / "auditoria-del-futuro-video.mp4"
AUDIO_PATH = OUT_DIR / "auditoria-del-futuro-ambient.wav"
FINAL_PATH = OUT_DIR / "auditoria-del-futuro-local.mp4"

WIDTH = 1080
HEIGHT = 1920
FPS = 24
DURATION = 42.0
TOTAL_FRAMES = int(DURATION * FPS)

NAVY = (10, 38, 65)
DEEP = (16, 58, 94)
SLATE = (22, 47, 73)
BLUE = (30, 95, 168)
BRIGHT = (25, 110, 207)
LIGHT = (139, 197, 255)
AMBER = (242, 169, 0)
WHITE = (255, 255, 255)
GRAY = (229, 231, 235)
MUTED = (142, 168, 195)

FONT = Path("C:/Windows/Fonts/segoeui.ttf")
FONT_BOLD = Path("C:/Windows/Fonts/segoeuib.ttf")
FONT_SEMIBOLD = Path("C:/Windows/Fonts/arialbd.ttf")


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_BOLD if bold else FONT), size=size)


def clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(high, value))


def smoothstep(x: float) -> float:
    x = clamp(x)
    return x * x * (3 - 2 * x)


def ease_out(x: float) -> float:
    return 1 - (1 - clamp(x)) ** 3


def scene_progress(t: float, start: float, end: float) -> float:
    return clamp((t - start) / (end - start))


def draw_round(draw: ImageDraw.ImageDraw, box, radius: int, fill, outline=None, width: int = 1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def centered_text(draw: ImageDraw.ImageDraw, text: str, y: int, fnt, fill=WHITE):
    box = draw.textbbox((0, 0), text, font=fnt)
    draw.text(((WIDTH - (box[2] - box[0])) / 2, y), text, font=fnt, fill=fill)


def wrap_text(draw: ImageDraw.ImageDraw, text: str, fnt, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        trial = f"{current} {word}".strip()
        if draw.textbbox((0, 0), trial, font=fnt)[2] <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_wrapped(draw: ImageDraw.ImageDraw, text: str, xy, fnt, fill, max_width: int, line_gap: int = 8):
    x, y = xy
    for line in wrap_text(draw, text, fnt, max_width):
        draw.text((x, y), line, font=fnt, fill=fill)
        y += fnt.size + line_gap


@lru_cache(maxsize=1)
def base_background() -> Image.Image:
    strip = Image.new("RGB", (1, HEIGHT))
    pix = strip.load()
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        pix[0, y] = (
            int(NAVY[0] * (1 - ratio) + DEEP[0] * ratio),
            int(NAVY[1] * (1 - ratio) + DEEP[1] * ratio),
            int(NAVY[2] * (1 - ratio) + DEEP[2] * ratio),
        )
    img = strip.resize((WIDTH, HEIGHT)).convert("RGBA")
    vignette = Image.new("L", (WIDTH, HEIGHT), 0)
    vd = ImageDraw.Draw(vignette)
    vd.ellipse((-420, -220, WIDTH + 420, HEIGHT + 220), fill=255)
    vignette = vignette.filter(ImageFilter.GaussianBlur(120))
    dark = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 52))
    img = Image.composite(img, Image.alpha_composite(img, dark), vignette)

    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((620, 160, 1450, 760), fill=(30, 95, 168, 42))
    gd.ellipse((-420, 1050, 430, 1870), fill=(242, 169, 0, 22))
    glow = glow.filter(ImageFilter.GaussianBlur(95))
    return Image.alpha_composite(img, glow)


def make_background(t: float) -> Image.Image:
    img = base_background().copy()
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for i in range(30):
        x = int((i * 173 + 40 * math.sin(t * 0.28 + i)) % WIDTH)
        y = int((i * 311 + 30 * math.cos(t * 0.19 + i)) % HEIGHT)
        r = 2 + (i % 3)
        alpha = 35 + int(20 * math.sin(t * 0.5 + i))
        d.ellipse((x - r, y - r, x + r, y + r), fill=(*LIGHT, max(8, alpha)))
        if i > 0:
            x2 = int(((i - 1) * 173 + 40 * math.sin(t * 0.28 + i - 1)) % WIDTH)
            y2 = int(((i - 1) * 311 + 30 * math.cos(t * 0.19 + i - 1)) % HEIGHT)
            if abs(x - x2) < 420 and abs(y - y2) < 420:
                d.line((x, y, x2, y2), fill=(*LIGHT, 24), width=2)

    return Image.alpha_composite(img, overlay)


def draw_logo(draw: ImageDraw.ImageDraw, x: int, y: int, scale: float = 1.0):
    logo_path = ROOT / "public" / "logo-vogel.png"
    if logo_path.exists():
        logo = Image.open(logo_path).convert("RGBA")
        target_w = int(260 * scale)
        logo.thumbnail((target_w, int(target_w * 0.55)))
        return logo, (x, y)
    draw.text((x, y), "Vogel Consultoria", font=font(int(28 * scale), True), fill=WHITE)
    return None, None


def draw_kpi_card(draw, x, y, w, h, label, value, progress, accent=AMBER):
    draw_round(draw, (x, y, x + w, y + h), 18, (16, 41, 65, 218), (255, 255, 255, 34), 2)
    draw.text((x + 28, y + 24), label.upper(), font=font(24, True), fill=MUTED)
    draw.text((x + 28, y + 66), value, font=font(54, True), fill=WHITE)
    bar_w = int((w - 56) * progress)
    draw_round(draw, (x + 28, y + h - 42, x + w - 28, y + h - 26), 8, (255, 255, 255, 26))
    draw_round(draw, (x + 28, y + h - 42, x + 28 + bar_w, y + h - 26), 8, accent)


def draw_scene_header(draw, eyebrow: str, title: str, subtitle: str | None = None, y: int = 230):
    draw.text((80, y), eyebrow.upper(), font=font(26, True), fill=AMBER)
    draw_wrapped(draw, title, (80, y + 52), font(72, True), WHITE, 900, 8)
    if subtitle:
        draw_wrapped(draw, subtitle, (80, y + 235), font(34), GRAY, 880, 10)


def draw_frame(i: int) -> Image.Image:
    t = i / FPS
    img = make_background(t)
    draw = ImageDraw.Draw(img, "RGBA")

    # Subtle safe-area frame for social cropping.
    draw_round(draw, (34, 34, WIDTH - 34, HEIGHT - 34), 30, (0, 0, 0, 0), (255, 255, 255, 18), 1)

    if t < 5:
        p = smoothstep(scene_progress(t, 0, 5))
        y = int(400 - 45 * (1 - p))
        draw.text((80, 130), "VOGEL CONSULTORIA", font=font(28, True), fill=MUTED)
        draw.text((80, y), "Tu empresa ya", font=font(74, True), fill=WHITE)
        draw.text((80, y + 92), "tiene los datos.", font=font(74, True), fill=WHITE)
        draw.text((80, y + 225), "El problema es que muchas veces llegan tarde.", font=font(36), fill=GRAY)
        draw_round(draw, (80, 1180, 1000, 1298), 22, (255, 255, 255, 18), (255, 255, 255, 38), 2)
        scan_x = 110 + int(840 * ((t * 0.55) % 1))
        draw.line((scan_x, 1200, scan_x, 1278), fill=(*AMBER, 170), width=5)
        for idx, txt in enumerate(["ventas.xlsx", "stock", "WhatsApp", "reportes"]):
            x = 120 + idx * 210
            draw.text((x, 1223), txt, font=font(26, True), fill=LIGHT if idx != 2 else AMBER)

    elif t < 11:
        p = scene_progress(t, 5, 11)
        draw_scene_header(draw, "Diagnostico", "La informacion esta dispersa", "Planillas, mensajes y sistemas que no se hablan entre si.", 180)
        nodes = [
            (145, 820, "Ventas"),
            (630, 760, "Stock"),
            (160, 1120, "Admin"),
            (625, 1200, "Reportes"),
        ]
        center = (540, 1000)
        for idx, (x, y, label) in enumerate(nodes):
            active = smoothstep(clamp(p * 1.5 - idx * 0.18))
            draw.line((x + 135, y + 55, center[0], center[1]), fill=(*LIGHT, int(100 * active)), width=4)
            draw_round(draw, (x, y, x + 270, y + 112), 18, (16, 41, 65, int(190 * active)), (255, 255, 255, int(50 * active)), 2)
            draw.text((x + 28, y + 34), label, font=font(32, True), fill=WHITE)
        r = 72 + int(7 * math.sin(t * 4))
        draw.ellipse((center[0] - r, center[1] - r, center[0] + r, center[1] + r), outline=(*AMBER, 190), width=6)
        centered_text(draw, "FUGAS DE TIEMPO", 1410, font(44, True), AMBER)

    elif t < 18:
        p = scene_progress(t, 11, 18)
        draw_scene_header(draw, "Auditoria del Futuro", "Miramos el negocio como un sistema", None, 160)
        cx, cy = 540, 900
        for r in [150, 260, 370]:
            a = int(70 + 60 * math.sin(t * 1.2 + r))
            draw.ellipse((cx - r, cy - r, cx + r, cy + r), outline=(*LIGHT, a), width=3)
        angle = t * 1.5
        draw.line((cx, cy, cx + int(370 * math.cos(angle)), cy + int(370 * math.sin(angle))), fill=(*AMBER, 180), width=5)
        checklist = ["Procesos", "Reportes", "Tareas repetitivas", "Indicadores", "Oportunidades IA"]
        for idx, item in enumerate(checklist):
            y = 1280 + idx * 76
            reveal = smoothstep(clamp(p * 2 - idx * 0.2))
            draw_round(draw, (100, y, 980, y + 54), 14, (255, 255, 255, int(18 * reveal)))
            draw.ellipse((126, y + 15, 150, y + 39), fill=(*AMBER, int(230 * reveal)))
            draw.text((176, y + 8), item, font=font(32, True), fill=(*WHITE, int(255 * reveal)))

    elif t < 27:
        p = scene_progress(t, 18, 27)
        draw_scene_header(draw, "Hallazgos", "Donde se escapa la rentabilidad", "La auditoria ordena prioridades por impacto y esfuerzo.", 150)
        cards = [
            (90, 720, "Tiempo perdido", "tareas manuales", AMBER),
            (560, 720, "Errores", "copiar y pegar", LIGHT),
            (90, 1085, "Reportes", "llegan tarde", BRIGHT),
            (560, 1085, "KPIs", "no visibles", AMBER),
        ]
        for idx, (x, y, title, desc, color) in enumerate(cards):
            reveal = smoothstep(clamp(p * 1.7 - idx * 0.18))
            draw_round(draw, (x, y, x + 430, y + 270), 22, (16, 41, 65, int(210 * reveal)), (255, 255, 255, int(42 * reveal)), 2)
            draw.text((x + 28, y + 30), title, font=font(34, True), fill=(*WHITE, int(255 * reveal)))
            draw.text((x + 28, y + 82), desc, font=font(26), fill=(*MUTED, int(255 * reveal)))
            for b in range(5):
                h = int((50 + 26 * math.sin(t * 1.3 + b + idx)) * reveal)
                bx = x + 42 + b * 62
                draw_round(draw, (bx, y + 220 - h, bx + 34, y + 220), 8, (*color, int(220 * reveal)))
        centered_text(draw, "Primero se mide. Despues se automatiza.", 1550, font(38, True), GRAY)

    elif t < 35:
        p = scene_progress(t, 27, 35)
        draw_scene_header(draw, "Implementacion", "Datos conectados. Decisiones claras.", None, 150)
        dash = (95, 650, 985, 1290)
        draw_round(draw, dash, 28, (8, 23, 39, 238), (255, 255, 255, 45), 2)
        draw.text((135, 700), "Panel ejecutivo", font=font(38, True), fill=WHITE)
        draw.text((135, 752), "ventas  stock  costos  rentabilidad", font=font(24, True), fill=MUTED)
        draw_kpi_card(draw, 135, 840, 360, 190, "Ventas", "+18%", smoothstep(p), AMBER)
        draw_kpi_card(draw, 585, 840, 360, 190, "Stock critico", "7", smoothstep(p * 0.9), LIGHT)
        draw_kpi_card(draw, 135, 1080, 360, 190, "Tareas", "-32%", smoothstep(p * 0.8), BRIGHT)
        draw_kpi_card(draw, 585, 1080, 360, 190, "Alertas", "Hoy", smoothstep(p * 0.7), AMBER)
        for idx, label in enumerate(["Sistema", "Dashboard", "Automatizacion", "IA aplicada"]):
            x = 95 + idx * 245
            y = 1450
            draw_round(draw, (x, y, x + 220, y + 76), 20, (16, 41, 65, 230), (255, 255, 255, 42), 2)
            draw.text((x + 22, y + 20), label, font=font(24, True), fill=WHITE if idx != 3 else AMBER)
            if idx < 3:
                draw.line((x + 220, y + 38, x + 245, y + 38), fill=(*LIGHT, 120), width=4)

    else:
        p = smoothstep(scene_progress(t, 35, 42))
        logo, pos = draw_logo(draw, 120, 205, 1.1)
        if logo is not None and pos is not None:
            img.alpha_composite(logo, pos)
        draw.text((90, 520), "Auditoria", font=font(82, True), fill=WHITE)
        draw.text((90, 616), "del Futuro", font=font(82, True), fill=WHITE)
        draw.text((90, 790), "Ordena procesos.", font=font(48, True), fill=GRAY)
        draw.text((90, 858), "Automatiza tareas.", font=font(48, True), fill=GRAY)
        draw.text((90, 926), "Decidi con datos.", font=font(48, True), fill=AMBER)
        draw_round(draw, (90, 1220, 990, 1380), 24, (255, 255, 255, 18), (255, 255, 255, 34), 2)
        draw_wrapped(draw, "Sistemas, dashboards, automatizacion e IA aplicada a decisiones concretas.", (130, 1250), font(32), WHITE, 820, 8)
        draw.text((90, 1620), "vogelconsultoria.com.ar", font=font(34, True), fill=LIGHT)
        draw.line((90, 1575, 90 + int(900 * p), 1575), fill=(*AMBER, 220), width=6)

    # Progress line.
    draw.line((90, HEIGHT - 92, 990, HEIGHT - 92), fill=(255, 255, 255, 32), width=5)
    draw.line((90, HEIGHT - 92, 90 + int(900 * (t / DURATION)), HEIGHT - 92), fill=(*AMBER, 210), width=5)
    return img.convert("RGB")


def render_frames():
    if FRAMES_DIR.exists():
        shutil.rmtree(FRAMES_DIR)
    FRAMES_DIR.mkdir(parents=True, exist_ok=True)
    for i in range(TOTAL_FRAMES):
        frame = draw_frame(i)
        frame.save(FRAMES_DIR / f"frame_{i:05d}.jpg", quality=92, optimize=True)
        if i % 120 == 0:
            print(f"rendered frame {i}/{TOTAL_FRAMES}")


def render_audio():
    sample_rate = 48000
    n = int(DURATION * sample_rate)
    with wave.open(str(AUDIO_PATH), "wb") as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(sample_rate)
        for idx in range(n):
            t = idx / sample_rate
            swell = 0.45 + 0.25 * math.sin(t * 0.35)
            pulse = 0.5 + 0.5 * math.sin(2 * math.pi * 0.5 * t)
            value = (
                math.sin(2 * math.pi * 82.41 * t) * 0.15
                + math.sin(2 * math.pi * 123.47 * t) * 0.08
                + math.sin(2 * math.pi * 196.00 * t) * 0.04 * pulse
                + math.sin(2 * math.pi * 440.00 * t) * 0.012 * (1 if int(t * 2) % 8 == 0 else 0)
            )
            fade_in = clamp(t / 2.5)
            fade_out = clamp((DURATION - t) / 2.5)
            amp = 0.38 * swell * fade_in * fade_out
            sample = int(max(-1, min(1, value * amp)) * 32767)
            wav.writeframesraw(sample.to_bytes(2, "little", signed=True) * 2)


def run_ffmpeg():
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise RuntimeError("ffmpeg not found on PATH")
    subprocess.run(
        [
            ffmpeg,
            "-y",
            "-framerate",
            str(FPS),
            "-i",
            str(FRAMES_DIR / "frame_%05d.jpg"),
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-r",
            str(FPS),
            "-movflags",
            "+faststart",
            str(VIDEO_NO_AUDIO),
        ],
        check=True,
    )
    subprocess.run(
        [
            ffmpeg,
            "-y",
            "-i",
            str(VIDEO_NO_AUDIO),
            "-i",
            str(AUDIO_PATH),
            "-shortest",
            "-c:v",
            "copy",
            "-c:a",
            "aac",
            "-b:a",
            "128k",
            "-movflags",
            "+faststart",
            str(FINAL_PATH),
        ],
        check=True,
    )


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    render_frames()
    render_audio()
    run_ffmpeg()
    print(FINAL_PATH)


if __name__ == "__main__":
    main()
