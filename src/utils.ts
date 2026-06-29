export function formatSize(bytes: number): string {
  return bytes >= 1_048_576
    ? (bytes / 1_048_576).toFixed(1) + " MB"
    : (bytes / 1024).toFixed(0) + " KB";
}

export function isHeifFile(file: File): boolean {
  return /\.(heic|heif|hif)$/i.test(file.name);
}
