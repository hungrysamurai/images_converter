import libheif from 'libheif-js/wasm-bundle';

export default async function HEICToBlob(
  payload: ArrayBuffer,
  outputSettings,
  targetFormatName,
): Promise<Blob> {
  const decoder = new libheif.HeifDecoder();
  const data = await decoder.decode(payload);

  console.log(targetFormatName, outputSettings);

  if (data.length === 0) {
    throw new Error('No images found in HEIC file');
  }

  const srcImage = data[0];
  const srcWidth = srcImage.get_width();
  const srcHeight = srcImage.get_height();

  const offscreenCanvas = new OffscreenCanvas(srcWidth, srcHeight);
  const ctx = offscreenCanvas.getContext('2d');
  const imageData = ctx!.createImageData(srcWidth, srcHeight);

  return new Promise((resolve, reject) => {
    srcImage.display(imageData, async (displayData) => {
      try {
        if (!displayData) {
          return reject(new Error('HEIF processing error'));
        }

        ctx!.putImageData(imageData, 0, 0);
        const blob = await offscreenCanvas.convertToBlob({ type: 'image/jpeg' });

        resolve(blob);
      } catch (err) {
        reject(err);
      }
    });
  });
}
