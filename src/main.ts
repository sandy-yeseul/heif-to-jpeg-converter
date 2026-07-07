import JSZip from "jszip";
import { convertHeifToJpeg, ConvertResult } from "./converter";
import { Lang, detectLang, setLang, t } from "./i18n";
import { formatSize, isHeifFile } from "./utils";

export interface FileEntry {
  file: File;
  status: "pending" | "converting" | "done" | "error";
  result?: ConvertResult;
  error?: string;
  itemEl?: HTMLElement;
}

// --- State ---
let lang: Lang = detectLang();
const entries: FileEntry[] = [];

// --- DOM refs ---
const dropzone = document.getElementById("dropzone")!;
const fileInput = document.getElementById("file-input") as HTMLInputElement;
const qualitySlider = document.getElementById("quality") as HTMLInputElement;
const qualityValue = document.getElementById("quality-value")!;
const maxSizeSelect = document.getElementById("max-size") as HTMLSelectElement;
const convertBtn = document.getElementById("convert-btn") as HTMLButtonElement;
const downloadBtn = document.getElementById("download-btn") as HTMLButtonElement;
const fileList = document.getElementById("file-list")!;
const emptyState = document.getElementById("empty-state")!;
const statsEl = document.getElementById("stats")!;
const langToggle = document.getElementById("lang-toggle") as HTMLButtonElement;
const sampleDownloadLink = document.getElementById("sample-download")!;
const sampleGalleryLink = document.getElementById("sample-gallery")!;

// --- i18n ---
function applyLang() {
  document.documentElement.lang = lang;

  const set = (id: string, key: Parameters<typeof t>[1]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = t(lang, key) as string;
  };

  const setLinkText = (el: HTMLElement, key: Parameters<typeof t>[1]) => {
    const textNode = Array.from(el.childNodes).find(
      (n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim().length > 0
    ) as Text | undefined;
    if (textNode) textNode.data = ` ${t(lang, key) as string} `;
  };

  set("logo-text", "header.logo");
  set("title-plain", "header.title.plain");
  set("title-accent", "header.title.accent");
  set("subtitle", "header.subtitle");
  setLinkText(sampleDownloadLink, "header.sample.download");
  setLinkText(sampleGalleryLink, "header.sample.gallery");
  set("drop-label", "drop.label");
  set("drop-sub", "drop.sub");
  set("control-quality-label", "control.quality");
  set("control-maxsize-label", "control.maxsize");
  set("maxsize-original", "maxsize.original");
  set("empty-state-text", "file.empty");
  set("convert-btn", "btn.convert");
  set("download-btn", "btn.download");
  set("footer-privacy", "footer.privacy");
  set("footer-powered", "footer.powered");

  langToggle.textContent = lang === "en" ? "한국어" : "English";

  for (const entry of entries) {
    if (entry.itemEl) setItemStatus(entry);
  }

  updateButtons();
}

langToggle.addEventListener("click", () => {
  lang = lang === "en" ? "ko" : "en";
  setLang(lang);
  applyLang();
});

// --- Quality slider ---
qualitySlider.addEventListener("input", () => {
  qualityValue.textContent = qualitySlider.value;
});

// --- Drag & drop ---
dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("drag-over");
});

["dragleave", "dragend"].forEach((evt) =>
  dropzone.addEventListener(evt, () => dropzone.classList.remove("drag-over"))
);

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("drag-over");
  addFiles(Array.from(e.dataTransfer?.files ?? []));
});

dropzone.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  addFiles(Array.from(fileInput.files ?? []));
  fileInput.value = "";
});

// --- Add files ---
function addFiles(files: File[]) {
  const heifFiles = files.filter(isHeifFile);
  if (heifFiles.length === 0) return;

  for (const file of heifFiles) {
    if (entries.some((e) => e.file.name === file.name && e.file.size === file.size)) continue;
    const entry: FileEntry = { file, status: "pending" };
    entries.push(entry);
    entry.itemEl = createFileItem(entry);
    fileList.appendChild(entry.itemEl);
  }

  emptyState.style.display = entries.length ? "none" : "flex";
  updateButtons();
}

function createFileItem(entry: FileEntry): HTMLElement {
  const el = document.createElement("div");
  el.className = "file-item";
  el.innerHTML = `
    <div class="file-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
    </div>
    <div class="file-info">
      <span class="file-name">${entry.file.name}</span>
      <span class="file-meta">${formatSize(entry.file.size)}</span>
    </div>
    <div class="file-status status-pending">
      <span class="status-text"></span>
    </div>
    <button class="remove-btn" aria-label="${t(lang, "btn.remove.label")}">✕</button>
  `;

  el.querySelector(".remove-btn")!.addEventListener("click", (e) => {
    e.stopPropagation();
    const idx = entries.indexOf(entry);
    if (idx >= 0) entries.splice(idx, 1);
    el.remove();
    emptyState.style.display = entries.length ? "none" : "flex";
    updateButtons();
  });

  setItemStatus(entry);
  return el;
}

function setItemStatus(entry: FileEntry) {
  const el = entry.itemEl;
  if (!el) return;
  const statusEl = el.querySelector(".file-status")!;
  const textEl = statusEl.querySelector(".status-text")!;

  statusEl.className = "file-status";

  if (entry.status === "pending") {
    statusEl.classList.add("status-pending");
    textEl.textContent = t(lang, "file.status.pending") as string;
  } else if (entry.status === "converting") {
    statusEl.classList.add("status-converting");
    textEl.textContent = t(lang, "file.status.converting") as string;
  } else if (entry.status === "done" && entry.result) {
    statusEl.classList.add("status-done");
    const saved = Math.round((1 - entry.result.convertedSize / entry.result.originalSize) * 100);
    const doneFn = t(lang, "file.status.done") as (size: string, saved: number) => string;
    textEl.textContent = doneFn(formatSize(entry.result.convertedSize), saved);

    if (!el.querySelector(".file-thumb")) {
      const url = URL.createObjectURL(entry.result.blob);
      const img = document.createElement("img");
      img.src = url;
      img.className = "file-thumb";
      img.onload = () => URL.revokeObjectURL(url);
      el.querySelector(".file-icon")!.replaceWith(img);

      const dlBtn = document.createElement("a");
      dlBtn.className = "dl-single";
      dlBtn.textContent = "↓";
      dlBtn.title = t(lang, "btn.download.single.title") as string;
      dlBtn.href = URL.createObjectURL(entry.result!.blob);
      dlBtn.download = entry.result.name;
      el.querySelector(".remove-btn")!.before(dlBtn);
    }
  } else if (entry.status === "error") {
    statusEl.classList.add("status-error");
    textEl.textContent = `${t(lang, "file.status.error")}: ${entry.error}`;
  }
}

function updateButtons() {
  const hasPending = entries.some((e) => e.status === "pending");
  const hasDone = entries.some((e) => e.status === "done");
  convertBtn.disabled = !hasPending;
  downloadBtn.disabled = !hasDone;

  const done = entries.filter((e) => e.status === "done" && e.result);
  if (done.length > 0) {
    const totalOrig = done.reduce((s, e) => s + e.file.size, 0);
    const totalConv = done.reduce((s, e) => s + e.result!.convertedSize, 0);
    const saved = Math.round((1 - totalConv / totalOrig) * 100);
    const summaryFn = t(lang, "stats.summary") as (
      count: number, origSize: string, convSize: string, saved: number
    ) => string;
    statsEl.textContent = summaryFn(done.length, formatSize(totalOrig), formatSize(totalConv), saved);
    statsEl.style.display = "block";
  } else {
    statsEl.style.display = "none";
  }
}

// --- Convert ---
convertBtn.addEventListener("click", async () => {
  const pending = entries.filter((e) => e.status === "pending");
  if (pending.length === 0) return;

  const quality = Number(qualitySlider.value) / 100;
  const maxSizeVal = Number(maxSizeSelect.value);
  const maxSize = maxSizeVal > 0 ? maxSizeVal : undefined;

  convertBtn.disabled = true;

  for (const entry of pending) {
    entry.status = "converting";
    setItemStatus(entry);

    try {
      entry.result = await convertHeifToJpeg(entry.file, { quality, maxSize });
      entry.status = "done";
    } catch (err) {
      entry.status = "error";
      entry.error = err instanceof Error ? err.message : String(err);
    }

    setItemStatus(entry);
  }

  updateButtons();
});

// --- Download all as ZIP ---
downloadBtn.addEventListener("click", async () => {
  const done = entries.filter((e) => e.status === "done" && e.result);
  if (done.length === 0) return;

  if (done.length === 1) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(done[0].result!.blob);
    a.download = done[0].result!.name;
    a.click();
    return;
  }

  downloadBtn.textContent = t(lang, "btn.download.zipping") as string;
  downloadBtn.disabled = true;

  const zip = new JSZip();
  for (const entry of done) {
    zip.file(entry.result!.name, entry.result!.blob);
  }

  const zipBlob = await zip.generateAsync({ type: "blob", compression: "STORE" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(zipBlob);
  a.download = "converted.zip";
  a.click();

  downloadBtn.textContent = t(lang, "btn.download") as string;
  downloadBtn.disabled = false;
});

// --- Init ---
applyLang();
