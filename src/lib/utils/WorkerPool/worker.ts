import { MIMETypes } from '../../../types/types';
import BMPToBlob from './worker_decoders/BMPToBlob';
import JPEG_WEBP_PNG_ToBlob from './worker_decoders/JPEG_WEBP_PNG_ToBlob';

addEventListener('message', async (e) => {
  const { type, outputSettings, targetFormatName, blobURL } = e.data;

  try {
    switch (type) {
      case MIMETypes.JPG:
      case MIMETypes.PNG:
      case MIMETypes.WEBP:
        {
          const blob = await JPEG_WEBP_PNG_ToBlob(blobURL, outputSettings, targetFormatName);

          postMessage(blob);
        }
        break;

      case MIMETypes.BMP:
        {
          const blob = await BMPToBlob(blobURL, outputSettings, targetFormatName);

          postMessage(blob);
        }
        break;
    }
  } catch (err) {
    setTimeout(() => {
      throw err;
    });
  }

  // try {
  //   switch (type) {
  //     case 'decode_heic': {
  //       const blob = await HEICToBlob(payload, outputSettings, targetFormatName);
  //       postMessage(blob);
  //     }
  //   }
  // } catch (err) {
  //   setTimeout(() => {
  //     throw err;
  //   });
  // }
});
