declare module "libheif-js/wasm-bundle" {
  const libheif: {
    HeifDecoder: new () => HeifDecoder;
  };

  export default libheif;
}
