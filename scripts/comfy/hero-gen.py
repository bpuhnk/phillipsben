#!/usr/bin/env python3
"""Generate a raw hero-image candidate via the resident ComfyUI instance.

Pilot tooling for project hero images. Submits an SDXL text2img workflow to
ComfyUI's HTTP API, waits for it, and downloads the result. Color is irrelevant
at this stage — duotone.py maps it into the site palette afterwards, so we
optimise the prompt for *composition and tonal structure*, not hue.

Usage:
  python3 scripts/comfy/hero-gen.py --slug site-assistant --seed 1 \
      --out scripts/comfy/out/site-assistant-raw.png
"""
import argparse
import json
import time
import urllib.parse
import urllib.request

COMFY = "http://127.0.0.1:8188"

# Fast lightning checkpoint for iterating on the P100 (~6-8 steps, low CFG).
# Swap to juggernautXL_ragnarokBy for the final, higher-quality pass.
CKPT = "dreamshaperXL_lightningDPMSDE.safetensors"

# Abstract, editorial, non-literal. Per-slug positive prompts; the shared
# skeleton keeps the whole future set looking like one family.
STYLE = (
    "abstract minimalist editorial illustration, fine flowing ink linework, "
    "generous negative space, calm and intelligent, architectural precision, "
    "subtle paper grain, monochrome, sophisticated magazine art, elegant, "
    "restrained composition"
)
NEGATIVE = (
    "text, words, letters, numbers, watermark, signature, logo, ui, screenshot, "
    "people, faces, hands, figure, silhouette, robot, mascot, cartoon, 3d render, glossy, plastic, "
    "neon, saturated, vibrant rainbow colors, cluttered, busy, low quality, blurry, "
    "photograph, photographic, photorealistic, realistic, architecture, building, "
    "columns, pillars, interior, room, furniture, perspective depth, shadows, "
    "wires, rods, tubes"
)
SUBJECTS = {
    "site-assistant": (
        "a sparse network of conversational threads and connected nodes, "
        "a few lines kept inside a clear bounded frame while others stop at its edge, "
        "the idea of an answer staying within known limits"
    ),
    "cervi": (
        "scattered loose dots and short ink strokes on one side flowing along a few gentle "
        "guiding curves and resolving into tidy evenly-spaced parallel rows on the other side, "
        "abstract diagram of disorder becoming order, flat hand-drawn ink linework"
    ),
    "qia": (
        "an abstract flat technical diagram of fine ink lines, a row of identical small repeated "
        "marks with precise tick marks and calibration notches, even rhythm and repetition, "
        "measurement and exacting precision, flat hand-drawn linework"
    ),
    "workstation-toolbar": (
        "a clean horizontal rail with a few evenly spaced nodes, fine signal lines fanning out "
        "from it to a wide grid of many small identical points, one configuration distributed in "
        "sync to many machines, flat hand-drawn linework"
    ),
    "claude-orbiter": (
        "concentric orbital rings with small marks traveling along them around a central point, "
        "a few gently branching paths, the sense of watching many processes orbit at once, "
        "flat hand-drawn linework"
    ),
    "finishitnow": (
        "many small marks and short lines arriving in three dense loose clusters from the left, "
        "converging and combining into a set of several neat evenly-spaced horizontal lanes on the "
        "right, dense flowing abstract diagram of multiple sources merging into one ordered board, "
        "flat hand-drawn linework"
    ),
    "hermes-agent": (
        "many small scattered fragments on one side drawn through a narrowing funnel into a single "
        "clean distilled line on the other side, the idea of summarizing many things into one "
        "report, flat hand-drawn linework"
    ),
    "mcp-servers": (
        "a single thin vertical dividing line down the middle with three small gaps in it, a field "
        "of scattered small dots on the left, fine lines passing from the left only through the "
        "gaps to reach a tidy ordered column of points on the right, abstract flat diagram, "
        "hand-drawn linework"
    ),
    "server-talk": (
        "two distinct lines approaching from opposite sides and interleaving turn by turn into a "
        "single shared central band, a dialogue written into one common substrate, "
        "flat hand-drawn linework"
    ),
}


def build_workflow(slug: str, seed: int, width: int, height: int) -> dict:
    positive = f"{SUBJECTS[slug]}, {STYLE}"
    return {
        "4": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": CKPT}},
        "6": {"class_type": "CLIPTextEncode", "inputs": {"text": positive, "clip": ["4", 1]}},
        "7": {"class_type": "CLIPTextEncode", "inputs": {"text": NEGATIVE, "clip": ["4", 1]}},
        "5": {"class_type": "EmptyLatentImage",
              "inputs": {"width": width, "height": height, "batch_size": 1}},
        "3": {"class_type": "KSampler", "inputs": {
            "seed": seed, "steps": 8, "cfg": 2.0,
            "sampler_name": "dpmpp_sde", "scheduler": "karras", "denoise": 1.0,
            "model": ["4", 0], "positive": ["6", 0], "negative": ["7", 0],
            "latent_image": ["5", 0]}},
        "8": {"class_type": "VAEDecode", "inputs": {"samples": ["3", 0], "vae": ["4", 2]}},
        "9": {"class_type": "SaveImage",
              "inputs": {"images": ["8", 0], "filename_prefix": f"hero_{slug}"}},
    }


def post(path: str, payload: dict) -> dict:
    data = json.dumps(payload).encode()
    req = urllib.request.Request(COMFY + path, data=data,
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def get(path: str) -> bytes:
    with urllib.request.urlopen(COMFY + path, timeout=30) as r:
        return r.read()


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True, choices=list(SUBJECTS))
    ap.add_argument("--seed", type=int, default=1)
    ap.add_argument("--width", type=int, default=1344)
    ap.add_argument("--height", type=int, default=768)
    ap.add_argument("--out", required=True)
    args = ap.parse_args()

    wf = build_workflow(args.slug, args.seed, args.width, args.height)
    resp = post("/prompt", {"prompt": wf, "client_id": f"hero-gen-{args.seed}"})
    pid = resp["prompt_id"]
    print(f"submitted prompt {pid} (seed {args.seed}) — waiting…")

    for _ in range(180):  # up to ~3 min on a cold P100
        time.sleep(1)
        hist = json.loads(get(f"/history/{pid}"))
        if pid in hist:
            break
    else:
        raise SystemExit("timed out waiting for ComfyUI")

    images = hist[pid]["outputs"]["9"]["images"]
    img = images[0]
    q = urllib.parse.urlencode(
        {"filename": img["filename"], "subfolder": img["subfolder"], "type": img["type"]})
    raw = get(f"/view?{q}")
    with open(args.out, "wb") as f:
        f.write(raw)
    print(f"saved {args.out} ({len(raw)} bytes)")


if __name__ == "__main__":
    main()
