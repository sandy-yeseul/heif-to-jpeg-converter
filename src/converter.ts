import libheif from "libheif-js/wasm-bundle";

export interface ConvertOptions {
  quality: number; // 0.0 – 1.0
  maxSize?: number; // longest side in px
}

export interface ConvertResult {
  name: string;
  blob: Blob;
  originalSize: number;
  convertedSize: number;
  width: number;
  height: number;
}

function renderImageToCanvas(
  imageData: ImageData,
  maxSize?: number
): HTMLCanvasElement {
  let { width, height } = imageData;

  if (maxSize && (width > maxSize || height > maxSize)) {
    const ratio = Math.min(maxSize / width, maxSize / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  if (width !== imageData.width || height !== imageData.height) {
    // Draw at original size first, then scale
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = imageData.width;
    tmpCanvas.height = imageData.height;
    tmpCanvas.getContext("2d")!.putImageData(imageData, 0, 0);
    ctx.drawImage(tmpCanvas, 0, 0, width, height);
  } else {
    ctx.putImageData(imageData, 0, 0);
  }

  return canvas;
}

export async function convertHeifToJpeg(
  file: File,
  opts: ConvertOptions
): Promise<ConvertResult> {
  const decoder = new libheif.HeifDecoder();
  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);

  const images = decoder.decode(data);
  if (!images || images.length === 0) {
    throw new Error("No images found in HEIF file");
  }

  const image = images[0];
  const width = image.get_width();
  const height = image.get_height();

  const imageData = new ImageData(new Uint8ClampedArray(width * height * 4), width, height);

  const canvas = renderImageToCanvas(imageData, opts.maxSize);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))),
      "image/jpeg",
      opts.quality
    );
  });

  const baseName = file.name.replace(/\.(heic|heif|hif)$/i, "");

  return {
    name: baseName + ".jpg",
    blob,
    originalSize: file.size,
    convertedSize: blob.size,
    width: canvas.width,
    height: canvas.height,
  };
}
