# Talk to My CV

Static landing page for an interactive AI CV.

## Local preview

```bash
python3 -m http.server 8124 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8124/`.

## GitHub Pages

This can be hosted directly from the repository root with GitHub Pages. The page uses relative local asset paths:

- `assets/hero-agent-loop.mp4`
- `assets/abstract-voice.png`

The ElevenLabs widget loads from the official hosted widget script in `index.html`.
