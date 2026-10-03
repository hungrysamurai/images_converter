import { describe, expect, it } from 'vitest';

import { patchExif } from './tiff';
import {
  TAG,
  buildTiff,
  diffOffsets,
  entryValueField,
  nextIfdField,
  readIfd0Short,
  readNextIfd,
  readTag,
  type ByteOrder,
} from './testing/builders';

const SIZE = { width: 1600, height: 1200 };

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
    const patched = patchExif(tiff, SIZE);

    expect(readIfd0Short(patched, TAG.Orientation)).toBe(1);
    // Only the 2-byte Orientation value may change
    expect(diffOffsets(tiff, patched)).toHaveLength(1);
  });

  it('does not mutate the input', () => {
    const tiff = buildPhotoTiff('II');
    const copy = tiff.slice();

    patchExif(tiff, SIZE);

    expect(tiff).toEqual(copy);
  });

  it('keeps EXIF without Orientation as is', () => {
    const tiff = buildTiff({
      byteOrder: 'MM',
      ifd0: [{ tag: TAG.Make, type: 'ASCII', value: 'Apple' }],
    });

    expect(patchExif(tiff, SIZE)).toEqual(tiff);
  });

  it('throws on invalid byte order', () => {
    const tiff = buildPhotoTiff('II');
    tiff[0] = 0x58;

    expect(() => patchExif(tiff, SIZE)).toThrow();
  });

  it('throws on invalid magic number', () => {
    const tiff = buildPhotoTiff('MM');
    tiff[3] = 0;

    expect(() => patchExif(tiff, SIZE)).toThrow();
  });

  it.each<ByteOrder>(['II', 'MM'])('throws on truncated EXIF (%s)', (byteOrder) => {
    const tiff = buildPhotoTiff(byteOrder);

    expect(() => patchExif(tiff.subarray(0, 4), SIZE)).toThrow();
    // IFD0 entries run past the end
    expect(() => patchExif(tiff.subarray(0, 20), SIZE)).toThrow();
  });

  it('throws on IFD0 offset out of bounds', () => {
    const tiff = buildPhotoTiff('II');
    new DataView(tiff.buffer).setUint32(4, tiff.length + 100, true);

    expect(() => patchExif(tiff, SIZE)).toThrow();
  });

  it.each<[ByteOrder, 'SHORT' | 'LONG']>([
    ['II', 'SHORT'],
    ['MM', 'SHORT'],
    ['II', 'LONG'],
    ['MM', 'LONG'],
  ])('writes actual dimensions in place (%s, %s)', (byteOrder, type) => {
    const tiff = buildTiff({
      byteOrder,
      ifd0: [{ tag: TAG.Make, type: 'ASCII', value: 'Canon' }],
      exif: [
        { tag: TAG.DateTimeOriginal, type: 'ASCII', value: '2024:05:17 14:03:22' },
        { tag: TAG.PixelXDimension, type, value: 6000 },
        { tag: TAG.PixelYDimension, type, value: 4000 },
      ],
    });
    const patched = patchExif(tiff, SIZE);

    expect(readTag(patched, 'exif', TAG.PixelXDimension)).toEqual({ type, value: 1600 });
    expect(readTag(patched, 'exif', TAG.PixelYDimension)).toEqual({ type, value: 1200 });

    const fields = [TAG.PixelXDimension, TAG.PixelYDimension].map((tag) =>
      entryValueField(tiff, 'exif', tag),
    );
    const size = type === 'SHORT' ? 2 : 4;

    for (const offset of diffOffsets(tiff, patched)) {
      expect(fields.some((field) => offset >= field && offset < field + size)).toBe(true);
    }
  });

  it.each<ByteOrder>(['II', 'MM'])(
    'widens SHORT dimension to LONG when it does not fit (%s)',
    (byteOrder) => {
      const tiff = buildTiff({
        byteOrder,
        ifd0: [],
        exif: [
          { tag: TAG.PixelXDimension, type: 'SHORT', value: 100 },
          { tag: TAG.PixelYDimension, type: 'SHORT', value: 100 },
        ],
      });
      const patched = patchExif(tiff, { width: 70000, height: 50 });

      expect(readTag(patched, 'exif', TAG.PixelXDimension)).toEqual({ type: 'LONG', value: 70000 });
      expect(readTag(patched, 'exif', TAG.PixelYDimension)).toEqual({ type: 'SHORT', value: 50 });
    },
  );

  it('keeps Exif IFD without dimensions as is', () => {
    const tiff = buildTiff({
      byteOrder: 'II',
      ifd0: [],
      exif: [{ tag: TAG.DateTimeOriginal, type: 'ASCII', value: '2024:05:17 14:03:22' }],
    });

    expect(patchExif(tiff, SIZE)).toEqual(tiff);
  });

  it.each<ByteOrder>(['II', 'MM'])('throws on Exif IFD offset out of bounds (%s)', (byteOrder) => {
    const tiff = buildTiff({
      byteOrder,
      ifd0: [],
      exif: [{ tag: TAG.PixelXDimension, type: 'LONG', value: 6000 }],
    });
    const field = entryValueField(tiff, 'ifd0', TAG.ExifIFD);
    new DataView(tiff.buffer).setUint32(field, tiff.length - 4, byteOrder === 'II');

    expect(() => patchExif(tiff, SIZE)).toThrow();
  });

  it('throws on dimension tag with unexpected type', () => {
    const tiff = buildTiff({
      byteOrder: 'II',
      ifd0: [],
      exif: [{ tag: TAG.PixelXDimension, type: 'ASCII', value: '6000' }],
    });

    expect(() => patchExif(tiff, SIZE)).toThrow();
  });

  describe('thumbnail', () => {
    const thumbnail = new Uint8Array(512).fill(0xab);

    const buildWithThumbnail = (byteOrder: ByteOrder, trailing?: Uint8Array) =>
      buildTiff({
        byteOrder,
        ifd0: [
          { tag: TAG.Model, type: 'ASCII', value: 'iPhone 15 Pro' },
          { tag: TAG.Orientation, type: 'SHORT', value: 6 },
        ],
        exif: [{ tag: TAG.PixelXDimension, type: 'LONG', value: 4032 }],
        ifd1: { entries: [{ tag: TAG.Orientation, type: 'SHORT', value: 6 }], thumbnail },
        trailing,
      });

    it.each<ByteOrder>(['II', 'MM'])(
      'unlinks IFD1 and cuts the thumbnail off (%s)',
      (byteOrder) => {
        const tiff = buildWithThumbnail(byteOrder);
        const patched = patchExif(tiff, SIZE);

        expect(readNextIfd(patched)).toBe(0);
        expect(patched.length).toBe(tiff.length - thumbnail.length);

        // Only patched values and the next-IFD link may change in what is left
        const fields = [
          entryValueField(tiff, 'ifd0', TAG.Orientation),
          entryValueField(tiff, 'exif', TAG.PixelXDimension),
          nextIfdField(tiff),
        ];

        for (const offset of diffOffsets(tiff.subarray(0, patched.length), patched)) {
          expect(fields.some((field) => offset >= field && offset < field + 4)).toBe(true);
        }
      },
    );

    it('keeps the thumbnail bytes when something follows them', () => {
      const tiff = buildWithThumbnail('II', new Uint8Array([1, 2, 3, 4]));
      const patched = patchExif(tiff, SIZE);

      expect(readNextIfd(patched)).toBe(0);
      expect(patched.length).toBe(tiff.length);
    });

    it('unlinks IFD1 without thumbnail data', () => {
      const tiff = buildWithThumbnail('MM');
      const ifd1 = new DataView(tiff.buffer).getUint32(nextIfdField(tiff), false);
      // Drop JPEGInterchangeFormat/Length entries, keep only Orientation
      new DataView(tiff.buffer).setUint16(ifd1, 1, false);

      const patched = patchExif(tiff, SIZE);

      expect(readNextIfd(patched)).toBe(0);
      expect(patched.length).toBe(tiff.length);
    });

    it.each<ByteOrder>(['II', 'MM'])('throws on IFD1 offset out of bounds (%s)', (byteOrder) => {
      const tiff = buildWithThumbnail(byteOrder);
      new DataView(tiff.buffer).setUint32(nextIfdField(tiff), tiff.length + 8, byteOrder === 'II');

      expect(() => patchExif(tiff, SIZE)).toThrow();
    });

    it('throws on thumbnail running past the end', () => {
      const tiff = buildWithThumbnail('II');
      const ifd1 = new DataView(tiff.buffer).getUint32(nextIfdField(tiff), true);
      // JPEGInterchangeFormatLength is the last IFD1 entry
      const lengthField = ifd1 + 2 + 2 * 12 + 8;
      new DataView(tiff.buffer).setUint32(lengthField, thumbnail.length + 1, true);

      expect(() => patchExif(tiff, SIZE)).toThrow();
    });
  });
});
