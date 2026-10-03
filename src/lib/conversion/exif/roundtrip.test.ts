import { describe, expect, it } from 'vitest';

import { extractFromISOBMFF } from './isobmff';
import { extractFromJPEG, insertIntoJPEG } from './jpeg';
import { patchExif } from './tiff';
import {
  TAG,
  buildExifItem,
  buildISOBMFF,
  buildJPEG,
  buildTiff,
  diffOffsets,
  entryValueField,
  ifdOffset,
  nextIfdField,
  readIfd0Short,
  readNextIfd,
  readTag,
  type ByteOrder,
} from './testing/builders';

describe('JPEG → JPEG round-trip', () => {
  it.each<ByteOrder>(['II', 'MM'])('carries EXIF over with stale tags fixed (%s)', (byteOrder) => {
    const thumbnail = new Uint8Array(1024).fill(0xcd);
    const tiff = buildTiff({
      byteOrder,
      ifd0: [
        { tag: TAG.Make, type: 'ASCII', value: 'Apple' },
        { tag: TAG.Model, type: 'ASCII', value: 'iPhone 15 Pro' },
        { tag: TAG.Orientation, type: 'SHORT', value: 6 },
        { tag: TAG.DateTime, type: 'ASCII', value: '2024:05:17 14:03:22' },
      ],
      exif: [
        { tag: TAG.DateTimeOriginal, type: 'ASCII', value: '2024:05:17 14:03:22' },
        { tag: TAG.PixelXDimension, type: 'LONG', value: 4032 },
        { tag: TAG.PixelYDimension, type: 'SHORT', value: 3024 },
      ],
      gps: [
        { tag: TAG.GPSLatitudeRef, type: 'ASCII', value: 'N' },
        {
          tag: TAG.GPSLatitude,
          type: 'RATIONAL',
          value: [
            [55, 1],
            [45, 1],
            [2112, 100],
          ],
        },
      ],
      ifd1: { entries: [{ tag: TAG.Orientation, type: 'SHORT', value: 6 }], thumbnail },
    });
    const source = buildJPEG(tiff);
    // Canvas output has no EXIF
    const encoded = buildJPEG();

    const extracted = extractFromJPEG(source);
    if (!extracted) throw new Error('EXIF not found');

    const output = insertIntoJPEG(encoded, patchExif(extracted, { width: 1512, height: 2016 }));
    const result = extractFromJPEG(output);
    if (!result) throw new Error('EXIF not found in output');

    expect(readIfd0Short(result, TAG.Orientation)).toBe(1);
    expect(readTag(result, 'exif', TAG.PixelXDimension)).toEqual({ type: 'LONG', value: 1512 });
    expect(readTag(result, 'exif', TAG.PixelYDimension)).toEqual({ type: 'SHORT', value: 2016 });
    expect(readNextIfd(result)).toBe(0);
    expect(result.length).toBe(tiff.length - thumbnail.length);
    expect(ifdOffset(result, 'gps')).toBe(ifdOffset(tiff, 'gps'));

    // Everything else, including date, model and GPS, is kept byte for byte
    const changed = [
      entryValueField(tiff, 'ifd0', TAG.Orientation),
      entryValueField(tiff, 'exif', TAG.PixelXDimension),
      entryValueField(tiff, 'exif', TAG.PixelYDimension),
      nextIfdField(tiff),
    ];

    for (const offset of diffOffsets(tiff.subarray(0, result.length), result)) {
      expect(changed.some((field) => offset >= field && offset < field + 4)).toBe(true);
    }
  });
});

describe('HEIC / AVIF → JPEG round-trip', () => {
  it.each(['heic', 'avif'] as const)('carries EXIF over with Orientation reset (%s)', (brand) => {
    const tiff = buildTiff({
      byteOrder: 'MM',
      ifd0: [
        { tag: TAG.Model, type: 'ASCII', value: 'iPhone 15 Pro' },
        { tag: TAG.Orientation, type: 'SHORT', value: 6 },
      ],
      exif: [
        { tag: TAG.DateTimeOriginal, type: 'ASCII', value: '2024:05:17 14:03:22' },
        { tag: TAG.PixelXDimension, type: 'LONG', value: 4032 },
        { tag: TAG.PixelYDimension, type: 'LONG', value: 3024 },
      ],
      gps: [{ tag: TAG.GPSLatitudeRef, type: 'ASCII', value: 'N' }],
    });

    const extracted = extractFromISOBMFF(buildISOBMFF({ brand, exifItem: buildExifItem(tiff) }));
    if (!extracted) throw new Error('EXIF not found');

    const output = insertIntoJPEG(buildJPEG(), patchExif(extracted, { width: 3024, height: 4032 }));
    const result = extractFromJPEG(output);
    if (!result) throw new Error('EXIF not found in output');

    expect(readIfd0Short(result, TAG.Orientation)).toBe(1);
    expect(readTag(result, 'exif', TAG.PixelXDimension)).toEqual({ type: 'LONG', value: 3024 });
    expect(readTag(result, 'exif', TAG.PixelYDimension)).toEqual({ type: 'LONG', value: 4032 });

    const changed = [
      entryValueField(tiff, 'ifd0', TAG.Orientation),
      entryValueField(tiff, 'exif', TAG.PixelXDimension),
      entryValueField(tiff, 'exif', TAG.PixelYDimension),
    ];

    for (const offset of diffOffsets(tiff, result)) {
      expect(changed.some((field) => offset >= field && offset < field + 4)).toBe(true);
    }
  });
});
