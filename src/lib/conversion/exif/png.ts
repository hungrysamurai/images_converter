// PNG keeps EXIF in an `eXIf` chunk that may appear anywhere, even after IDAT

import { stripExifHeader } from './exifHeader';

const SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

const fourCC = (bytes: Uint8Array, offset: number) =>
  String.fromCharCode(...bytes.subarray(offset, offset + 4));

export const extractFromPNG = (bytes: Uint8Array): Uint8Array | null => {
  if (!SIGNATURE.every((byte, i) => bytes[i] === byte)) {
    throw new Error('Not a PNG: missing signature');
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = SIGNATURE.length;

  while (offset + 8 <= bytes.length) {
    const length = view.getUint32(offset);
    const type = fourCC(bytes, offset + 4);
    const start = offset + 8;

    // Data is followed by a 4-byte CRC
    if (start + length + 4 > bytes.length) {
      throw new Error(`Truncated PNG chunk '${type}' at ${offset}`);
    }

    if (type === 'eXIf') return stripExifHeader(bytes.slice(start, start + length));
    if (type === 'IEND') return null;

    offset = start + length + 4;
  }

  return null;
};
