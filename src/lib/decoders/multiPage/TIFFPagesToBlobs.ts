import UTIF from 'utif';
import { OutputFileFormatsNames } from '../../../types/types';
import encodeCanvas from '../../encode';
import { getResizedCanvas } from '../../utils/getResizedCanvas';

const TIFFPagesToBlobs = async (
  blobURL: string,
  targetFormatSettings: OutputConversionSettings,
  activeTargetFormatName: OutputFileFormatsNames,
): Promise<Blob[]> => {
  const file = await fetch(blobURL);
  const arrayBuffer = await file.arrayBuffer();

  const { resize, units, smoothing, targetHeight, targetWidth } = targetFormatSettings;

  const pages = UTIF.decode(arrayBuffer);

  const pagesBlobs = [];

  for (const page of pages) {
    UTIF.decodeImage(arrayBuffer, page);
    const rgba = UTIF.toRGBA8(page);

    const { width, height } = page;

    const imageData = new ImageData(new Uint8ClampedArray(rgba.buffer), width, height);

    let canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx?.putImageData(imageData, 0, 0);

    if (resize) {
      canvas = getResizedCanvas(canvas, smoothing, units, targetWidth, targetHeight);
    }

    const encoded = await encodeCanvas(canvas, targetFormatSettings, activeTargetFormatName);

    if (encoded) {
      pagesBlobs.push(encoded);
    }
  }

  return pagesBlobs;
};

export default TIFFPagesToBlobs;
