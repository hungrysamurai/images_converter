import { describe, expect, it } from 'vitest';

import { extractFromJPEG, insertIntoJPEG } from './jpeg';
import { patchExif } from './tiff';
import {
  TAG,
  buildJPEG,
  buildTiff,
  diffOffsets,
  readIfd0Short,
  type ByteOrder,
} from './testing/builders';

describe('JPEG → JPEG round-trip', () => {
  it.each<ByteOrder>(['II', 'MM'])('carries EXIF over with Orientation reset (%s)', (byteOrder) => {
    const tiff = buildTiff({
      byteOrder,
      ifd0: [
        { tag: TAG.Make, type: 'ASCII', value: 'Apple' },
        { tag: TAG.Model, type: 'ASCII', value: 'iPhone 15 Pro' },
        { tag: TAG.Orientation, type: 'SHORT', value: 6 },
        { tag: TAG.DateTime, type: 'ASCII', value: '2024:05:17 14:03:22' },
      ],
    });
    const source = buildJPEG(tiff);
    // Canvas output has no EXIF
    const encoded = buildJPEG();

    const extracted = extractFromJPEG(source);
    if (!extracted) throw new Error('EXIF not found');

    const output = insertIntoJPEG(encoded, patchExif(extracted));
    const result = extractFromJPEG(output);
    if (!result) throw new Error('EXIF not found in output');

    expect(readIfd0Short(result, TAG.Orientation)).toBe(1);
    expect(diffOffsets(tiff, result)).toHaveLength(1);
  });
});
