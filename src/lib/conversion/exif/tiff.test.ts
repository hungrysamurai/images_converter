import { describe, expect, it } from 'vitest';

import { patchExif } from './tiff';
import { TAG, buildTiff, diffOffsets, readIfd0Short, type ByteOrder } from './testing/builders';

const buildPhotoTiff = (byteOrder: ByteOrder) =>
  buildTiff({
    byteOrder,
    ifd0: [
      { tag: TAG.Make, type: 'ASCII', value: 'Canon' },
      { tag: TAG.Model, type: 'ASCII', value: 'EOS 5D Mark IV' },
      { tag: TAG.Orientation, type: 'SHORT', value: 6 },
      { tag: TAG.DateTime, type: 'ASCII', value: '2024:05:17 14:03:22' },
    ],
  });

describe('patchExif', () => {
  it.each<ByteOrder>(['II', 'MM'])('resets Orientation to 1 in place (%s)', (byteOrder) => {
    const tiff = buildPhotoTiff(byteOrder);
    const patched = patchExif(tiff);

    expect(readIfd0Short(patched, TAG.Orientation)).toBe(1);
    // Only the 2-byte Orientation value may change
    expect(diffOffsets(tiff, patched)).toHaveLength(1);
  });

  it('does not mutate the input', () => {
    const tiff = buildPhotoTiff('II');
    const copy = tiff.slice();

    patchExif(tiff);

    expect(tiff).toEqual(copy);
  });

  it('keeps EXIF without Orientation as is', () => {
    const tiff = buildTiff({
      byteOrder: 'MM',
      ifd0: [{ tag: TAG.Make, type: 'ASCII', value: 'Apple' }],
    });

    expect(patchExif(tiff)).toEqual(tiff);
  });

  it('throws on invalid byte order', () => {
    const tiff = buildPhotoTiff('II');
    tiff[0] = 0x58;

    expect(() => patchExif(tiff)).toThrow();
  });

  it('throws on invalid magic number', () => {
    const tiff = buildPhotoTiff('MM');
    tiff[3] = 0;

    expect(() => patchExif(tiff)).toThrow();
  });

  it.each<ByteOrder>(['II', 'MM'])('throws on truncated EXIF (%s)', (byteOrder) => {
    const tiff = buildPhotoTiff(byteOrder);

    expect(() => patchExif(tiff.subarray(0, 4))).toThrow();
    // IFD0 entries run past the end
    expect(() => patchExif(tiff.subarray(0, 20))).toThrow();
  });

  it('throws on IFD0 offset out of bounds', () => {
    const tiff = buildPhotoTiff('II');
    new DataView(tiff.buffer).setUint32(4, tiff.length + 100, true);

    expect(() => patchExif(tiff)).toThrow();
  });
});
