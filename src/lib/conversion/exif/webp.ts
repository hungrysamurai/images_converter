// WebP is a RIFF container: EXIF lives in its own `EXIF` chunk

import { stripExifHeader } from './exifHeader';

const fourCC = (bytes: Uint8Array, offset: number) =>
  String.fromCharCode(...bytes.subarray(offset, offset + 4));

export const extractFromWebP = (bytes: Uint8Array): Uint8Array | null => {
  if (bytes.length < 12 || fourCC(bytes, 0) !== 'RIFF' || fourCC(bytes, 8) !== 'WEBP') {
    throw new Error('Not a WebP: missing RIFF/WEBP header');
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  // Some encoders write a RIFF size that disagrees with the file; trust the smaller one
  const end = Math.min(bytes.length, 8 + view.getUint32(4, true));
  let offset = 12;

  while (offset + 8 <= end) {
    const type = fourCC(bytes, offset);
    const size = view.getUint32(offset + 4, true);
    const start = offset + 8;

    if (start + size > end) throw new Error(`Truncated WebP chunk '${type}' at ${offset}`);

    if (type === 'EXIF') return stripExifHeader(bytes.slice(start, start + size));

    // Payload is padded to an even size
    offset = start + size + (size % 2);
  }

  return null;
};
