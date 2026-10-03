import { describe, expect, it } from 'vitest';

import { extractFromPNG } from './png';
import { EXIF_HEADER, TAG, buildPNG, buildTiff } from './testing/builders';

const tiff = buildTiff({
  byteOrder: 'MM',
  ifd0: [
    { tag: TAG.Make, type: 'ASCII', value: 'Google' },
    { tag: TAG.Orientation, type: 'SHORT', value: 3 },
  ],
});

describe('extractFromPNG', () => {
  it('finds eXIf before IDAT', () => {
    expect(extractFromPNG(buildPNG({ exif: tiff }))).toEqual(tiff);
  });

  it('finds eXIf after IDAT', () => {
    expect(extractFromPNG(buildPNG({ exif: tiff, afterIdat: true }))).toEqual(tiff);
  });

  it('skips the Exif\\0\\0 prefix some writers put before TIFF', () => {
    const payload = new Uint8Array([...EXIF_HEADER, ...tiff]);

    expect(extractFromPNG(buildPNG({ exif: payload }))).toEqual(tiff);
  });

  it('returns null when there is no eXIf chunk', () => {
    expect(extractFromPNG(buildPNG())).toBeNull();
  });

  it('throws on a file that is not PNG', () => {
    expect(() => extractFromPNG(new Uint8Array(32))).toThrow();
  });

  it('throws on a chunk running past the end of file', () => {
    const file = buildPNG({ exif: tiff, afterIdat: true });

    // Cut inside eXIf: IEND (12 bytes) and part of eXIf are gone
    expect(() => extractFromPNG(file.subarray(0, file.length - 20))).toThrow();
  });
});
