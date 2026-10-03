import { describe, expect, it } from 'vitest';

import { extractFromJPEG, insertIntoJPEG } from './jpeg';
import { EXIF_HEADER, TAG, buildJPEG, buildTiff } from './testing/builders';

const tiff = buildTiff({
  byteOrder: 'II',
  ifd0: [
    { tag: TAG.Make, type: 'ASCII', value: 'Canon' },
    { tag: TAG.Orientation, type: 'SHORT', value: 6 },
  ],
});

describe('extractFromJPEG', () => {
  it('returns TIFF bytes from the APP1 Exif segment', () => {
    expect(extractFromJPEG(buildJPEG(tiff))).toEqual(tiff);
  });

  it('returns null for JPEG without EXIF', () => {
    expect(extractFromJPEG(buildJPEG())).toBeNull();
  });

  it('throws on non-JPEG input', () => {
    expect(() => extractFromJPEG(new Uint8Array([0x89, 0x50, 0x4e, 0x47]))).toThrow();
  });

  it('throws on a segment running past the end of file', () => {
    const jpeg = buildJPEG(tiff);

    expect(() => extractFromJPEG(jpeg.subarray(0, 40))).toThrow();
  });
});

describe('insertIntoJPEG', () => {
  it('inserts APP1 Exif right after SOI and keeps the rest intact', () => {
    const jpeg = buildJPEG();
    const result = insertIntoJPEG(jpeg, tiff);
    const payloadLength = EXIF_HEADER.length + tiff.length;

    expect([...result.subarray(0, 6)]).toEqual([
      0xff,
      0xd8,
      0xff,
      0xe1,
      (payloadLength + 2) >> 8,
      (payloadLength + 2) & 0xff,
    ]);
    expect(result.subarray(6, 6 + EXIF_HEADER.length)).toEqual(EXIF_HEADER);
    expect(result.subarray(4 + 2 + payloadLength)).toEqual(jpeg.subarray(2));
    expect(extractFromJPEG(result)).toEqual(tiff);
  });

  it('accepts payload of exactly 65533 bytes', () => {
    const big = new Uint8Array(65533 - EXIF_HEADER.length);

    expect(extractFromJPEG(insertIntoJPEG(buildJPEG(), big))).toEqual(big);
  });

  it('refuses payload larger than 65533 bytes', () => {
    const tooBig = new Uint8Array(65533 - EXIF_HEADER.length + 1);

    expect(() => insertIntoJPEG(buildJPEG(), tooBig)).toThrow();
  });

  it('throws on non-JPEG input', () => {
    expect(() => insertIntoJPEG(new Uint8Array([0x89, 0x50]), tiff)).toThrow();
  });
});
