# HIMANSHU.AI — Interactive Portfolio

A personal portfolio for **Himanshu Lama**, framed as an AI operating system / digital twin rather than a conventional website. A transparent portrait acts as the interface hub: it "projects" modules, draws light-beams to them, and narrates predefined first-person lines. Dark engineering-dashboard aesthetic with a red accent.

🔗 **Live site:** _add your deployed URL here_

---

## Features

- **Boot sequence** with a self-healing watchdog (never hangs on the loading screen).
- **Avatar-as-navigation** — a holographic module dock (`ABOUT · WORKS · SKILLS · JOURNEY · CONNECT`) is the only nav. Hovering a card fires an SVG light-beam from the avatar and triggers a typed AI "voice" line.
- **Signature `expand` transition** — the clicked module grows from its exact rect to a full-screen tech panel, then dissolves into the section.
- **WORKS** — an orbital HUD: projects sit on a rotating arc around a pulsing core; scroll spins it, the active node beams into a readout.
- **SKILLS** — an interactive neural-network map: a core routes through four domains into twelve skills, with hover/click tracing of each branch.
- **AI presenter** — on every module page the avatar reappears as a side presenter that narrates section-specific lines.
- Fully **responsive** and dependency-light.

## Tech stack

- Vanilla **HTML / CSS / JavaScript** — no framework, no build step.
- [anime.js 3.2.1](https://animejs.com/) (via CDN) for animation.
- Google Fonts: Archivo Black, Space Mono, Caveat, Tiro Devanagari Hindi.

## Project structure

```
.
├── index.html          # markup
├── css/
│   └── style.css       # all styles
├── js/
│   └── main.js         # all behavior (boot, transitions, WORKS, SKILLS, AI voice)
├── assets/
│   └── himanshu.png    # transparent portrait cut-out
└── README.md
```

## Running locally

Because the page loads a local image, open it through a web server (double-clicking the file uses `file://`, which some browsers block/cache oddly).

```bash
# from the project root
python3 -m http.server 8000
# then visit http://localhost:8000
```

Any static server works (e.g. the VS Code "Live Server" extension).

## Deployment

This is a static site — deploy the repo root to any static host:

- **GitHub Pages:** push to GitHub → repo *Settings → Pages* → deploy from the `main` branch (root).
- **Netlify / Vercel / Cloudflare Pages:** import the repo; no build command, publish directory `/`.

## Contact

- **Email:** himanshulama24@augustana.edu
- **LinkedIn:** [himanshu-lama](https://linkedin.com/in/himanshu-lama-6a801932a)
- **GitHub:** [Z0Z0-12](https://github.com/Z0Z0-12)

## License

© 2026 Himanshu Lama. All rights reserved.

This is a personal portfolio. The code, design, written content, and portrait
artwork are not licensed for reuse — please don't copy or redeploy the site.
Feel free to browse for inspiration, and reach out if you'd like to talk.
