import UTIF from 'utif';

import { OutputFileFormatsNames } from '../../../types/types';

import { encode } from '../../encode';
import { getResizedCanvas } from '../../utils/getResizedCanvas';

const TIFFToFiles = async (
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

    let canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvas.width = page.width;
    canvas.height = page.height;

    ctx.putImageData(imageData, 0, 0);

    if (resize) {
      canvas = getResizedCanvas(canvas, smoothing, units, targetWidth, targetHeight);
    }

    const encoded = await encode(canvas, targetFormatSettings, activeTargetFormatName);

    if (encoded) {
      pagesBlobs.push(encoded);
    }

    // if (encoded) {
    //   const size = encoded.size;
    //   const URL = window.URL.createObjectURL(encoded);

    //   dispatch(
    //     addConvertedFile({
    //       blobURL: URL,
    //       downloadLink: URL,
    //       name: `${name}_${index + 1}`,
    //       size,
    //       type: `image/${activeTargetFormatName}` as MIMETypes,
    //       id: nanoid(),
    //       sourceId: id,
    //     }),
    //   );
    // }
  }

  return pagesBlobs;
};

export default TIFFToFiles;
