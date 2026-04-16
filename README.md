# Glizzy Web Template

Asset-ready web app zip.

## What it does
- Button 1: **GLIZZY**
- Button 2: **UNGLIZZY**
- Both buttons use their own image pools
- Randomly plays one of 5 audio clips
- No immediate repeat on image or audio choice
- Supports mixed image extensions via `assets/manifest.json`

## Add your assets in `assets/`
Example naming structure:
- `glizzy_1.mp3` through `glizzy_5.mp3`
- `glizzy_1.png`, `glizzy_2.jpg`, `glizzy_3.webp`, etc.
- `unglizzy_1.png`, `unglizzy_2.jpg`, `unglizzy_3.webp`, etc.

## Important
Update `assets/manifest.json` to match the files you actually upload.

## Host it
Works with any static host:
- GitHub Pages
- Netlify
- Vercel

## Local test
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000`
