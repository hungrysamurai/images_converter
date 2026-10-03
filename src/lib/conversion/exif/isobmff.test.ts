import { describe, expect, it } from 'vitest';

import { extractFromISOBMFF } from './isobmff';
import { TAG, buildExifItem, buildISOBMFF, buildTiff } from './testing/builders';

const tiff = buildTiff({
  byteOrder: 'MM',
  ifd0: [
    { tag: TAG.Make, type: 'ASCII', value: 'Apple' },
    { tag: TAG.Orientation, type: 'SHORT', value: 6 },
  ],
});

describe('extractFromISOBMFF', () => {
  it('returns TIFF bytes of the Exif item stored in mdat', () => {
    expect(extractFromISOBMFF(buildISOBMFF({ exifItem: buildExifItem(tiff) }))).toEqual(tiff);
  });

  it('works for AVIF', () => {
    const avif = buildISOBMFF({ brand: 'avif', exifItem: buildExifItem(tiff) });

    expect(extractFromISOBMFF(avif)).toEqual(tiff);
  });

  it('skips the TIFF header offset written at the start of the payload', () => {
    expect(
      extractFromISOBMFF(buildISOBMFF({ exifItem: buildExifItem(tiff, new Uint8Array()) })),
    ).toEqual(tiff);
    expect(
      extractFromISOBMFF(buildISOBMFF({ exifItem: buildExifItem(tiff, new Uint8Array(10)) })),
    ).toEqual(tiff);
  });

  it('reads the Exif item from idat', () => {
    expect(
      extractFromISOBMFF(buildISOBMFF({ exifItem: buildExifItem(tiff), inIdat: true })),
    ).toEqual(tiff);
  });

  it('joins the Exif item split into several extents', () => {
    expect(extractFromISOBMFF(buildISOBMFF({ exifItem: buildExifItem(tiff), extents: 3 }))).toEqual(
      tiff,
    );
  });

  it('returns null when there is no Exif item', () => {
    expect(extractFromISOBMFF(buildISOBMFF())).toBeNull();
  });

  it('throws on a file without meta box', () => {
    expect(() => extractFromISOBMFF(buildISOBMFF().subarray(0, 24))).toThrow();
  });

  it('throws on a box running past the end of file', () => {
    const file = buildISOBMFF({ exifItem: buildExifItem(tiff) });

    expect(() => extractFromISOBMFF(file.subarray(0, 100))).toThrow();
  });

  it('throws when the Exif item lies outside the file', () => {
    const file = buildISOBMFF({ exifItem: buildExifItem(tiff) });
    // mdat is the last box: cut its payload but keep the header consistent
    const mdat = file.length - (64 + buildExifItem(tiff).length) - 8;
    const truncated = file.slice(0, mdat + 8 + 64);
    new DataView(truncated.buffer).setUint32(mdat, 8 + 64);

    expect(() => extractFromISOBMFF(truncated)).toThrow();
  });

  it('throws when the TIFF header offset points past the payload', () => {
    const item = buildExifItem(tiff);
    new DataView(item.buffer).setUint32(0, item.length);

    expect(() => extractFromISOBMFF(buildISOBMFF({ exifItem: item }))).toThrow();
  });
});
