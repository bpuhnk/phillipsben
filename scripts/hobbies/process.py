#!/usr/bin/env python3
"""Process a raw hobbies photo into a palette-duotoned webp for the /hobbies page.

Center-crops the raw shot to its slot's aspect ratio, maps it into the site palette
with the SAME duotone LUT the project heroes use (scripts/comfy/duotone.py), and writes
public/images/hobbies/<slot>.webp. Drop the result in, rebuild, and the slot's
placeholder is replaced automatically (see components/duo-photo.tsx).

Usage:
  python3 scripts/hobbies/process.py <raw-photo> <slot> [map]
  e.g.  python3 scripts/hobbies/process.py ~/Pictures/am8.jpg am8
        python3 scripts/hobbies/process.py ~/Pictures/k1.jpg k1 accent

Slots (ratio, default map) are listed below and in public/images/hobbies/README.md.
"""
import argparse
import sys
from pathlib import Path

from PIL import Image, ImageOps

# Reuse the canonical palette + LUT so hobbies photos match the project heroes exactly.
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "comfy"))
from duotone import STOPS, build_lut  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "public" / "images" / "hobbies"

# slot -> ((ratio_w, ratio_h), default map)
SLOTS = {
    "printing-hero": ((4, 3), "duo"),
    "am8": ((4, 3), "duo"),
    "ender3": ((4, 3), "duo"),
    "k1": ((4, 3), "accent"),
    "breadboard": ((1, 1), "duo"),
    "enclosure": ((1, 1), "duo"),
    "radar": ((1, 1), "duo"),
    "home-assistant": ((1, 1), "duo"),
    "rack": ((4, 3), "duo"),
}


def center_crop(img: Image.Image, ratio: tuple[int, int]) -> Image.Image:
    w, h = img.size
    target = ratio[0] / ratio[1]
    if w / h > target:  # too wide — trim sides
        nw = round(h * target)
        x = (w - nw) // 2
        return img.crop((x, 0, x + nw, h))
    nh = round(w / target)  # too tall — trim top/bottom
    y = (h - nh) // 2
    return img.crop((0, y, w, y + nh))


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("raw", help="raw input photo (jpg/png/heic-as-jpg)")
    ap.add_argument("slot", choices=list(SLOTS))
    ap.add_argument("map", nargs="?", choices=list(STOPS), help="override default map")
    ap.add_argument("--width", type=int, default=1200, help="output width in px")
    args = ap.parse_args()

    ratio, default_map = SLOTS[args.slot]
    mp = args.map or default_map

    img = ImageOps.exif_transpose(Image.open(args.raw))  # honor phone orientation
    img = center_crop(img, ratio)
    out_w = args.width
    out_h = round(out_w * ratio[1] / ratio[0])
    img = img.resize((out_w, out_h), Image.LANCZOS)

    # duotone: grayscale -> gentle autocontrast (keep grain) -> palette LUT
    gray = ImageOps.autocontrast(img.convert("L"), cutoff=1)
    lut = build_lut(STOPS[mp])
    duo = Image.merge("RGB", [gray.point(lut[c * 256:(c + 1) * 256]) for c in range(3)])

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / f"{args.slot}.webp"
    duo.save(out, "WEBP", quality=88)
    print(f"saved {out.relative_to(ROOT)}  [{mp}, {out_w}x{out_h}]")


if __name__ == "__main__":
    main()
