// "Exif\0\0": APP1 identifier in JPEG
export const EXIF_HEADER = [0x45, 0x78, 0x69, 0x66, 0x00, 0x00];

export const hasExifHeader = (bytes: Uint8Array, offset = 0) =>
  EXIF_HEADER.every((byte, i) => bytes[offset + i] === byte);

// WebP and PNG chunks hold bare TIFF by spec, but some writers prepend the JPEG identifier
export const stripExifHeader = (payload: Uint8Array) =>
  hasExifHeader(payload) ? payload.subarray(EXIF_HEADER.length) : payload;
