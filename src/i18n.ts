export type Lang = "en" | "ko";

export const translations = {
  en: {
    // Header
    "header.logo": "HEIF Converter",
    "header.title.plain": "HEIF · HEIC to ",
    "header.title.accent": "JPEG",
    "header.subtitle": "Convert in your browser — no server, no upload, fully offline",
    "header.sample.download": "Download sample HEIC",
    "header.sample.gallery": "View HEIC sample gallery",

    // Dropzone
    "drop.label": "Drag files here or click to select",
    "drop.sub": "Multiple files supported",

    // Controls
    "control.quality": "Quality",
    "control.maxsize": "Max resolution",
    "maxsize.original": "Original",

    // File list
    "file.empty": "Files will appear here once added",
    "file.status.pending": "Waiting",
    "file.status.converting": "Converting…",
    "file.status.error": "Error",

    // Actions
    "btn.convert": "Convert",
    "btn.download": "Download All (ZIP)",
    "btn.download.zipping": "Zipping…",

    // Stats
    "stats.summary": (count: number, origSize: string, convSize: string, saved: number) =>
      `${count} file${count > 1 ? "s" : ""} converted · ${origSize} → ${convSize} (${saved}% saved)`,
    "file.status.done": (size: string, saved: number) => `Done · ${size} (${saved}% saved)`,

    // Footer
    "footer.privacy": "All processing happens in your browser. Files are never sent to a server.",
    "footer.powered": "Powered by",

    // Accessibility
    "btn.remove.label": "Remove",
    "btn.download.single.title": "Download",
  },
  ko: {
    "header.logo": "HEIF 변환기",
    "header.title.plain": "HEIF · HEIC를 ",
    "header.title.accent": "JPEG로",
    "header.subtitle": "브라우저에서 바로 변환 — 서버 전송 없음, 완전 오프라인",
    "header.sample.download": "샘플 HEIC 다운로드",
    "header.sample.gallery": "HEIC 샘플 갤러리 보기",

    "drop.label": "파일을 드래그하거나 클릭하여 선택",
    "drop.sub": "여러 파일 동시 선택 가능",

    "control.quality": "품질",
    "control.maxsize": "최대 해상도",
    "maxsize.original": "원본 유지",

    "file.empty": "파일을 추가하면 여기에 표시됩니다",
    "file.status.pending": "대기 중",
    "file.status.converting": "변환 중…",
    "file.status.error": "오류",

    "btn.convert": "변환 시작",
    "btn.download": "전체 다운로드 (ZIP)",
    "btn.download.zipping": "ZIP 압축 중…",

    "stats.summary": (count: number, origSize: string, convSize: string, saved: number) =>
      `${count}개 변환 완료 · ${origSize} → ${convSize} (${saved}% 절약)`,
    "file.status.done": (size: string, saved: number) => `완료 · ${size} (${saved}% 절약)`,

    "footer.privacy": "모든 처리는 브라우저 내에서 이루어집니다. 파일이 외부 서버로 전송되지 않습니다.",
    "footer.powered": "Powered by",

    "btn.remove.label": "삭제",
    "btn.download.single.title": "다운로드",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function detectLang(): Lang {
  const param = new URLSearchParams(window.location.search).get("lang");
  if (param === "ko" || param === "en") return param;
  const stored = localStorage.getItem("heif-lang");
  if (stored === "ko" || stored === "en") return stored;
  return navigator.language.startsWith("ko") ? "ko" : "en";
}

export function setLang(lang: Lang): void {
  localStorage.setItem("heif-lang", lang);
  const url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  window.history.replaceState({}, "", url);
}

export function t<K extends TranslationKey>(lang: Lang, key: K): (typeof translations)[Lang][K] {
  return translations[lang][key] as (typeof translations)[Lang][K];
}
