import type { ExifWriter } from '../outputFormats';
import { insertIntoJPEG } from './jpeg';

const writeJPEG: ExifWriter = async (encoded, tiff) => {
  const jpeg = new Uint8Array(await encoded.arrayBuffer());

  return new Blob([insertIntoJPEG(jpeg, tiff)], { type: encoded.type });
};

export default writeJPEG;
