# HEIF → JPEG Converter

A browser-based tool that converts **HEIF / HEIC** images (from iPhone, iPad, and modern cameras) to **JPEG** — entirely client-side, no server, no upload.

🔗 **[Live Demo](https://sandy-yeseul.github.io/heif-to-jpeg-converter/)** · Built with TypeScript + Vite + libheif (WebAssembly)

> **Built with AI pair programming** — developed using [Claude Code](https://claude.ai/code) (Anthropic). The architecture, logic, and design decisions were driven by the developer; Claude assisted with implementation, refactoring, and code review.

---

## Features

- **Drag & drop** or click to select — supports batch selection
- **Zero uploads** — all processing happens in your browser via WebAssembly
- **EN / KO** — language toggle (English default, 한국어 지원)
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
| Language | TypeScript (strict) |
| Bundler | Vite |
| HEIF decoding | [libheif-js](https://github.com/strukturag/libheif) (WebAssembly) |
| ZIP packaging | [JSZip](https://stuk.github.io/jszip/) |
| Testing | [Vitest](https://vitest.dev/) |
| Styling | Vanilla CSS (dark theme) |

---

## Getting Started

```bash
# Clone
git clone https://github.com/sandy-yeseul/heif-to-jpeg-converter.git
cd heif-to-jpeg-converter

# Install
npm install

# Dev server (http://localhost:5173)
npm run dev

# Run tests
npm test

# Production build → dist/
npm run build

# Deploy to GitHub Pages
npm run deploy
```

Open `dist/index.html` directly in a browser — no web server needed.

---

## Project Structure

```
heif-to-jpeg-converter/
├── src/
│   ├── main.ts              # UI logic, drag-drop, file list, download
│   ├── converter.ts         # libheif decode → Canvas → JPEG blob
│   ├── i18n.ts              # EN/KO translations
│   ├── utils.ts             # formatSize, isHeifFile
│   └── __tests__/
│       ├── utils.test.ts    # formatSize, isHeifFile unit tests
│       └── i18n.test.ts     # translation completeness tests
├── index.html               # Single-page app shell
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Testing

```bash
npm test          # run all tests once
npm run test:ui   # open Vitest UI in browser
```

22 tests covering:
- `formatSize` — KB/MB formatting edge cases
- `isHeifFile` — extension filtering (case-insensitive)
- i18n completeness — EN/KO key parity, non-empty values, formatter output

---

## License

MIT
