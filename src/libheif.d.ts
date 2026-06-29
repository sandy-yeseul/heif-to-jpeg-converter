declare module "libheif-js/wasm-bundle" {
  interface HeifImage {
    get_width(): number;
    get_height(): number;
    display(
      data: { data: Uint8ClampedArray; width: number; height: number },
      callback: (result: ImageData | null) => void
    ): void;
  }

  interface HeifDecoder {
    decode(data: Uint8Array): HeifImage[];
  }

  const libheif: {
    HeifDecoder: new () => HeifDecoder;
  };

  export default libheif;
}
