declare module 'libheif-js/wasm-bundle' {
 class HeifDecoder {
  decode(buffer: ArrayBuffer): Promise<HeifImage[]>;
 }

 class HeifImage {
  get_width(): number;
  get_height(): number;
  display(
   imageData: ImageData,
   callback: (displayData: ImageData | null) => void
  ): void;
 }

 export { HeifDecoder, HeifImage };
 export default { HeifDecoder };
}
