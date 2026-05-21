# Hobbies photos — shot list & processing

The `/hobbies` page wires 9 photo slots through `components/duo-photo.tsx`. Each slot
shows the editorial placeholder until a processed `.webp` of the right name lands here,
then auto-appears on the next build. Photos are **duotoned to the site palette** (same
treatment as the project heroes) so they read as part of the design, not foreign snaps.

## Workflow

1. Shoot a casual raw photo (phone is fine) for each slot below.
2. Process it: `python3 scripts/hobbies/process.py <raw-file> <slot> [map]`
   — crops to the slot's aspect ratio, duotones to palette, writes `<slot>.webp` here.
3. Commit the webp(s); they appear on the next deploy. No code change needed.

Maps: `duo` = ink→cream (default, calm), `accent` = burnt-orange→cream (one bold moment).

## The 9 slots

| Slot file              | Ratio | Map    | What to shoot                                              |
|------------------------|-------|--------|------------------------------------------------------------|
| `printing-hero.webp`   | 4:3   | duo    | The print farm — three machines on a steel bench, daylight |
| `am8.webp`             | 4:3   | duo    | BLV AM8 build-plate close-up                               |
| `ender3.webp`          | 4:3   | duo    | Ender 3 mid-print (a long one)                             |
| `k1.webp`              | 4:3   | accent | K1 with the enclosure light glowing (the one warm accent)  |
| `breadboard.webp`      | 1:1   | duo    | Breadboard / LED test rig close-up                         |
| `enclosure.webp`       | 1:1   | duo    | An enclosure print fresh off the K1                        |
| `radar.webp`           | 1:1   | duo    | The ESP32 mmWave garage-occupancy board                    |
| `home-assistant.webp`  | 1:1   | duo    | Home Assistant dashboard, dim mode (screen grab is fine)   |
| `rack.webp`            | 4:3   | duo    | The home rack — P100 visible, doors open, labelled cabling |

The family band (§04) intentionally stays full-color (`/images/ben-matt-lights.jpeg`) —
the single warm human moment against the duotoned machines.
