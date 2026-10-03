import { EXIF_HEADER, hasExifHeader } from './exifHeader';

const SOI = 0xd8;
const APP1 = 0xe1;
const SOS = 0xda;
const EOI = 0xd9;

const isStandalone = (marker: number) => marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7);

// Walks marker segments up to the image data and returns the TIFF part of APP1 Exif
export const extractFromJPEG = (bytes: Uint8Array): Uint8Array | null => {
  if (bytes[0] !== 0xff || bytes[1] !== SOI) throw new Error('Not a JPEG: missing SOI');

  let offset = 2;

  while (offset + 1 < bytes.length) {
    if (bytes[offset] !== 0xff) throw new Error(`Invalid JPEG marker at ${offset}`);

    const marker = bytes[offset + 1];

    // Fill bytes before a marker
    if (marker === 0xff) {
      offset++;
      continue;
    }

    if (marker === SOS || marker === EOI) return null;

    if (isStandalone(marker)) {
      offset += 2;
      continue;
    }

    if (offset + 4 > bytes.length) throw new Error('Truncated JPEG segment header');

    const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
    const start = offset + 4;
    const end = offset + 2 + length;

    if (length < 2 || end > bytes.length) throw new Error(`Truncated JPEG segment at ${offset}`);

    if (marker === APP1 && end - start >= EXIF_HEADER.length && hasExifHeader(bytes, start)) {
      return bytes.slice(start + EXIF_HEADER.length, end);
    }

    offset = end;
  }

  return null;
};

// Segment length field is 16 bit and counts itself
const MAX_APP1_PAYLOAD = 0xffff - 2;

// Inserts APP1 Exif right after SOI. Canvas output carries no EXIF of its own
export const insertIntoJPEG = (jpeg: Uint8Array, tiff: Uint8Array): Uint8Array<ArrayBuffer> => {
  if (jpeg[0] !== 0xff || jpeg[1] !== SOI) throw new Error('Not a JPEG: missing SOI');

  const payloadLength = EXIF_HEADER.length + tiff.length;

  if (payloadLength > MAX_APP1_PAYLOAD) {
    throw new Error(`EXIF is too large for APP1: ${payloadLength} bytes`);
  }

  const result = new Uint8Array(jpeg.length + 4 + payloadLength);
  const segmentLength = payloadLength + 2;

  result.set([0xff, SOI, 0xff, APP1, segmentLength >> 8, segmentLength & 0xff]);
  result.set(EXIF_HEADER, 6);
  result.set(tiff, 6 + EXIF_HEADER.length);
  result.set(jpeg.subarray(2), 6 + payloadLength);

  return result;
};
