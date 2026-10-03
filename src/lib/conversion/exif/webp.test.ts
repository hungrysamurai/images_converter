import { describe, expect, it } from 'vitest';

import { EXIF_HEADER, TAG, buildTiff, buildWebP } from './testing/builders';
import { extractFromWebP } from './webp';

const tiff = buildTiff({
  byteOrder: 'II',
  ifd0: [
    { tag: TAG.Make, type: 'ASCII', value: 'Canon' },
    { tag: TAG.Orientation, type: 'SHORT', value: 8 },
  ],
});

describe('extractFromWebP', () => {
  it('returns TIFF bytes of the EXIF chunk placed after a padded chunk', () => {
    expect(extractFromWebP(buildWebP(tiff))).toEqual(tiff);
  });

  it('skips the Exif\\0\\0 prefix some writers put before TIFF', () => {
    const payload = new Uint8Array([...EXIF_HEADER, ...tiff]);

    expect(extractFromWebP(buildWebP(payload))).toEqual(tiff);
  });

  it('returns null when there is no EXIF chunk', () => {
    expect(extractFromWebP(buildWebP())).toBeNull();
  });

  it('throws on a file that is not WebP', () => {
    expect(() => extractFromWebP(new Uint8Array(32))).toThrow();
  });

  it('throws on a chunk running past the end of file', () => {
    const file = buildWebP(tiff);
    const truncated = file.slice(0, file.length - 10);
    new DataView(truncated.buffer).setUint32(4, truncated.length - 8, true);

    expect(() => extractFromWebP(truncated)).toThrow();
  });
});
