#!/usr/bin/env python3
"""Map a raw ComfyUI image into the site palette so hero art reads as part of
the editorial design system rather than a foreign AI illustration.

Three mappings (pick what looks right on the page):
  duo    ink -> cream            (classic 2-tone; line art becomes site-ink on site-cream)
  accent accent -> cream         (burnt-orange line art on cream; boldest brand read)
  tri    ink -> accent -> cream  (ink lines with an orange mid-tone glow)

The lightest input tone is pushed to exactly --bg cream so the plate blends into
the page; gentle autocontrast preserves the paper grain instead of crushing it.

Usage:
  python3 scripts/comfy/duotone.py --in raw.png --map tri --out hero.png
"""
import argparse

from PIL import Image, ImageOps

INK = (0x1A, 0x18, 0x16)     # --ink
ACCENT = (0xC2, 0x41, 0x0C)  # burnt orange (matches og image #C2410C)
CREAM = (0xFA, 0xF8, 0xF4)   # --bg

STOPS = {
    "duo": [(0.0, INK), (1.0, CREAM)],
    "accent": [(0.0, ACCENT), (1.0, CREAM)],
    "tri": [(0.0, INK), (0.5, ACCENT), (1.0, CREAM)],
}


def lerp(a: int, b: int, t: float) -> int:
    return round(a + (b - a) * t)


def build_lut(stops: list[tuple[float, tuple[int, int, int]]]) -> list[int]:
    """256-entry flat RGB LUT (r0..r255,g0..,b0..) interpolating across stops."""
    r, g, b = [], [], []
    for i in range(256):
        t = i / 255
        for (t0, c0), (t1, c1) in zip(stops, stops[1:]):
            if t0 <= t <= t1:
                f = (t - t0) / (t1 - t0) if t1 > t0 else 0.0
                r.append(lerp(c0[0], c1[0], f))
                g.append(lerp(c0[1], c1[1], f))
                b.append(lerp(c0[2], c1[2], f))
                break
    return r + g + b


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="inp", required=True)
    ap.add_argument("--map", choices=list(STOPS), default="tri")
    ap.add_argument("--out", required=True)
    args = ap.parse_args()

    img = Image.open(args.inp).convert("L")
    img = ImageOps.autocontrast(img, cutoff=1)  # normalize, keep grain
    duo = Image.merge("RGB", [
        img.point(build_lut(STOPS[args.map])[c * 256:(c + 1) * 256]) for c in range(3)
    ])
    duo.save(args.out)
    print(f"saved {args.out} [{args.map}]")


if __name__ == "__main__":
    main()
