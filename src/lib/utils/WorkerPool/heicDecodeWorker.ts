import libheif from 'libheif-js/wasm-bundle';

addEventListener('message', async (e) => {
  const { arrayBuffer } = e.data;

  const decoder = new libheif.HeifDecoder();
  const data = await decoder.decode(arrayBuffer);

  if (data.length === 0) {
    throw new Error('No images found in HEIC file');
  }

  const srcImage = data[0];
  const srcWidth = srcImage.get_width();
  const srcHeight = srcImage.get_height();

  const offscreenCanvas = new OffscreenCanvas(srcWidth, srcHeight);
  const ctx = offscreenCanvas.getContext('2d');

  const imageData = ctx!.createImageData(srcWidth, srcHeight);

  srcImage.display(imageData, async (displayData) => {
    if (!displayData) {
      throw new Error('HEIF processing error');
    }

    ctx!.putImageData(imageData, 0, 0);
    const blob = await offscreenCanvas.convertToBlob({ type: 'image/jpeg' });

    postMessage(blob);
  });
});
