# HEIF → JPEG Converter

A browser-based tool that converts **HEIF / HEIC** images (from iPhone, iPad, and modern cameras) to **JPEG** — entirely client-side, no server, no upload.

🔗 **[Live Demo](#)** · Built with TypeScript + Vite + libheif (WebAssembly)

![screenshot](./docs/screenshot.png)

---

## Features

- **Drag & drop** or click to select — supports batch selection
- **Zero uploads** — all processing happens in your browser via WebAssembly
- **Quality slider** — tune JPEG output quality (50–95)
- **Resize on export** — cap the longest side (1080 / 1440 / 2048 / 4096 px)
- **Thumbnail preview** after conversion
- **Per-file download** or **Download all as ZIP**
- **File size savings** displayed per file and in aggregate
- Supports `.heic`, `.heif`, `.hif`

---

## How It Works

```
HEIF/HEIC file (binary)
       │
       ▼
  libheif (WASM)           ← decodes HEIF container in the browser
       │  raw RGBA pixels
       ▼
  Canvas API               ← optional resize via thumbnail()
       │
       ▼
  canvas.toBlob()          ← encodes to JPEG at chosen quality
       │
       ▼
  File download / ZIP
```

No data ever leaves your machine.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Bundler | Vite |
| HEIF decoding | [libheif-js](https://github.com/strukturag/libheif) (WebAssembly) |
| ZIP packaging | [JSZip](https://stuk.github.io/jszip/) |
| Styling | Vanilla CSS (dark theme) |

---

## Getting Started

```bash
# Clone
git clone https://github.com/your-username/heif-to-jpeg-converter.git
cd heif-to-jpeg-converter

# Install
npm install

# Dev server (http://localhost:5173)
npm run dev

# Production build → dist/
npm run build
```

Open `dist/index.html` directly in a browser — no web server needed.

---

## Project Structure

```
heif-to-jpeg-converter/
├── src/
│   ├── main.ts          # UI logic, drag-drop, file list, download
│   └── converter.ts     # libheif decode → Canvas → JPEG blob
├── index.html           # Single-page app shell
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## License

MIT
