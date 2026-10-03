// Synthetic EXIF fixtures for tests: no real photos in the repo

export type ByteOrder = 'II' | 'MM';

export const TAG = {
  Make: 0x010f,
  Model: 0x0110,
  Orientation: 0x0112,
  DateTime: 0x0132,
  JPEGInterchangeFormat: 0x0201,
  JPEGInterchangeFormatLength: 0x0202,
  ExifIFD: 0x8769,
  GPSIFD: 0x8825,
  DateTimeOriginal: 0x9003,
  PixelXDimension: 0xa002,
  PixelYDimension: 0xa003,
  GPSLatitudeRef: 0x0001,
  GPSLatitude: 0x0002,
} as const;

const TYPE = { ASCII: 2, SHORT: 3, LONG: 4, RATIONAL: 5 } as const;

export type TiffEntry =
  | { tag: number; type: 'SHORT' | 'LONG'; value: number }
  | { tag: number; type: 'ASCII'; value: string }
  | { tag: number; type: 'RATIONAL'; value: [number, number][] };

type IfdName = 'ifd0' | 'exif' | 'gps' | 'ifd1';

const valueSize = (entry: TiffEntry) => {
  switch (entry.type) {
    case 'ASCII':
      return entry.value.length + 1;
    case 'SHORT':
      return 2;
    case 'LONG':
      return 4;
    case 'RATIONAL':
      return entry.value.length * 8;
  }
};

const outOfLineSize = (entries: TiffEntry[]) =>
  entries.reduce((sum, e) => sum + (valueSize(e) > 4 ? valueSize(e) : 0), 0);

const ifdSize = (entries: TiffEntry[]) => 2 + entries.length * 12 + 4 + outOfLineSize(entries);

// Pointer tags are filled in after layout
const pointer = (tag: number): TiffEntry => ({ tag, type: 'LONG', value: 0 });

/**
 * TIFF header followed by IFD0, Exif IFD, GPS IFD, IFD1 and the thumbnail, in this order.
 * Each IFD is followed by its out-of-line values. `trailing` goes after the thumbnail
 * to simulate data that makes the thumbnail not the tail of the block.
 */
export const buildTiff = ({
  byteOrder,
  ifd0,
  exif,
  gps,
  ifd1,
  trailing,
}: {
  byteOrder: ByteOrder;
  ifd0: TiffEntry[];
  exif?: TiffEntry[];
  gps?: TiffEntry[];
  ifd1?: { entries: TiffEntry[]; thumbnail: Uint8Array };
  trailing?: Uint8Array;
}): Uint8Array => {
  const le = byteOrder === 'II';

  const ifds: Partial<Record<IfdName, TiffEntry[]>> = {
    ifd0: [...ifd0, ...(exif ? [pointer(TAG.ExifIFD)] : []), ...(gps ? [pointer(TAG.GPSIFD)] : [])],
    exif,
    gps,
    ifd1: ifd1 && [
      ...ifd1.entries,
      pointer(TAG.JPEGInterchangeFormat),
      { tag: TAG.JPEGInterchangeFormatLength, type: 'LONG', value: ifd1.thumbnail.length },
    ],
  };

  const order: IfdName[] = ['ifd0', 'exif', 'gps', 'ifd1'];
  const offsets: Partial<Record<IfdName, number>> = {};
  let cursor = 8;

  for (const name of order) {
    const entries = ifds[name];
    if (!entries) continue;
    offsets[name] = cursor;
    cursor += ifdSize(entries);
  }

  const thumbnailOffset = cursor;
  const thumbnail = ifd1?.thumbnail ?? new Uint8Array();
  const tail = trailing ?? new Uint8Array();

  const pointers: Record<number, number | undefined> = {
    [TAG.ExifIFD]: offsets.exif,
    [TAG.GPSIFD]: offsets.gps,
    [TAG.JPEGInterchangeFormat]: ifd1 && thumbnailOffset,
  };

  const bytes = new Uint8Array(thumbnailOffset + thumbnail.length + tail.length);
  const view = new DataView(bytes.buffer);

  bytes.set(le ? [0x49, 0x49] : [0x4d, 0x4d], 0);
  view.setUint16(2, 42, le);
  view.setUint32(4, 8, le);

  for (const name of order) {
    const entries = ifds[name];
    const ifdOffset = offsets[name];
    if (!entries || ifdOffset === undefined) continue;

    view.setUint16(ifdOffset, entries.length, le);

    const nextIfdField = ifdOffset + 2 + entries.length * 12;
    if (name === 'ifd0' && offsets.ifd1 !== undefined)
      view.setUint32(nextIfdField, offsets.ifd1, le);

    let dataOffset = nextIfdField + 4;

    entries.forEach((entry, i) => {
      const at = ifdOffset + 2 + i * 12;

      view.setUint16(at, entry.tag, le);
      view.setUint16(at + 2, TYPE[entry.type], le);

      const size = valueSize(entry);
      let valueAt = at + 8;

      if (size > 4) {
        view.setUint32(at + 8, dataOffset, le);
        valueAt = dataOffset;
        dataOffset += size;
      }

      switch (entry.type) {
        case 'ASCII': {
          const text = new TextEncoder().encode(entry.value + '\0');
          view.setUint32(at + 4, text.length, le);
          bytes.set(text, valueAt);
          break;
        }
        case 'SHORT':
          view.setUint32(at + 4, 1, le);
          view.setUint16(valueAt, entry.value, le);
          break;
        case 'LONG':
          view.setUint32(at + 4, 1, le);
          view.setUint32(valueAt, pointers[entry.tag] ?? entry.value, le);
          break;
        case 'RATIONAL':
          view.setUint32(at + 4, entry.value.length, le);
          entry.value.forEach(([num, den], j) => {
            view.setUint32(valueAt + j * 8, num, le);
            view.setUint32(valueAt + j * 8 + 4, den, le);
          });
          break;
      }
    });
  }

  bytes.set(thumbnail, thumbnailOffset);
  bytes.set(tail, thumbnailOffset + thumbnail.length);

  return bytes;
};

const segment = (marker: number, payload: Uint8Array) => {
  const bytes = new Uint8Array(4 + payload.length);
  bytes.set([0xff, marker, (payload.length + 2) >> 8, (payload.length + 2) & 0xff]);
  bytes.set(payload, 4);
  return bytes;
};

const concat = (...parts: Uint8Array[]) => {
  const bytes = new Uint8Array(parts.reduce((sum, p) => sum + p.length, 0));
  let offset = 0;
  for (const part of parts) {
    bytes.set(part, offset);
    offset += part.length;
  }
  return bytes;
};

export const EXIF_HEADER = new Uint8Array([0x45, 0x78, 0x69, 0x66, 0, 0]);

const JFIF_APP0 = segment(
  0xe0,
  new Uint8Array([0x4a, 0x46, 0x49, 0x46, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0]),
);

// Minimal JPEG skeleton: SOI, APP0 (JFIF), optional APP1 (Exif), SOS with fake scan data, EOI.
// Scan data contains 0xFF 0xE1 to make sure parsers stop at SOS
export const buildJPEG = (tiff?: Uint8Array): Uint8Array =>
  concat(
    new Uint8Array([0xff, 0xd8]),
    JFIF_APP0,
    tiff ? segment(0xe1, concat(EXIF_HEADER, tiff)) : new Uint8Array(),
    segment(0xda, new Uint8Array([1, 1, 0, 0, 0x3f, 0])),
    new Uint8Array([0x12, 0xff, 0xe1, 0x00, 0x34]),
    new Uint8Array([0xff, 0xd9]),
  );

// Independent TIFF reader for assertions

const tiffView = (tiff: Uint8Array) => ({
  view: new DataView(tiff.buffer, tiff.byteOffset, tiff.byteLength),
  le: tiff[0] === 0x49,
});

const findEntryOffset = (tiff: Uint8Array, ifd: number, tag: number): number | undefined => {
  const { view, le } = tiffView(tiff);
  const count = view.getUint16(ifd, le);

  for (let i = 0; i < count; i++) {
    const at = ifd + 2 + i * 12;
    if (view.getUint16(at, le) === tag) return at;
  }

  return undefined;
};

export const ifdOffset = (tiff: Uint8Array, name: 'ifd0' | 'exif' | 'gps'): number => {
  const { view, le } = tiffView(tiff);
  const ifd0 = view.getUint32(4, le);
  if (name === 'ifd0') return ifd0;

  const at = findEntryOffset(tiff, ifd0, name === 'exif' ? TAG.ExifIFD : TAG.GPSIFD);
  if (at === undefined) throw new Error(`No ${name} IFD pointer`);

  return view.getUint32(at + 8, le);
};

// Offset of the 4-byte value field of the entry
export const entryValueField = (
  tiff: Uint8Array,
  ifd: 'ifd0' | 'exif' | 'gps',
  tag: number,
): number => {
  const at = findEntryOffset(tiff, ifdOffset(tiff, ifd), tag);
  if (at === undefined) throw new Error(`No tag ${tag} in ${ifd}`);
  return at + 8;
};

// SHORT or LONG value of a single-count entry
export const readTag = (
  tiff: Uint8Array,
  ifd: 'ifd0' | 'exif' | 'gps',
  tag: number,
): { type: 'SHORT' | 'LONG'; value: number } | undefined => {
  const { view, le } = tiffView(tiff);
  const at = findEntryOffset(tiff, ifdOffset(tiff, ifd), tag);
  if (at === undefined) return undefined;

  const type = view.getUint16(at + 2, le);
  if (type === TYPE.SHORT) return { type: 'SHORT', value: view.getUint16(at + 8, le) };
  if (type === TYPE.LONG) return { type: 'LONG', value: view.getUint32(at + 8, le) };

  throw new Error(`Tag ${tag} is neither SHORT nor LONG`);
};

export const readIfd0Short = (tiff: Uint8Array, tag: number): number | undefined =>
  readTag(tiff, 'ifd0', tag)?.value;

// Offset of the next-IFD link of IFD0
export const nextIfdField = (tiff: Uint8Array): number => {
  const { view, le } = tiffView(tiff);
  const ifd0 = view.getUint32(4, le);
  return ifd0 + 2 + view.getUint16(ifd0, le) * 12;
};

export const readNextIfd = (tiff: Uint8Array): number => {
  const { view, le } = tiffView(tiff);
  return view.getUint32(nextIfdField(tiff), le);
};

// Offsets at which two equally sized buffers differ
export const diffOffsets = (a: Uint8Array, b: Uint8Array): number[] => {
  if (a.length !== b.length) throw new Error(`Length differs: ${a.length} vs ${b.length}`);
  return [...a.keys()].filter((i) => a[i] !== b[i]);
};
