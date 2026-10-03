// Synthetic EXIF fixtures for tests: no real photos in the repo

export type ByteOrder = 'II' | 'MM';

export const TAG = {
  Make: 0x010f,
  Model: 0x0110,
  Orientation: 0x0112,
  DateTime: 0x0132,
} as const;

const TYPE = { ASCII: 2, SHORT: 3, LONG: 4 } as const;

export type TiffEntry =
  | { tag: number; type: 'SHORT' | 'LONG'; value: number }
  | { tag: number; type: 'ASCII'; value: string };

const entrySize = (entry: TiffEntry) =>
  entry.type === 'ASCII' ? entry.value.length + 1 : entry.type === 'SHORT' ? 2 : 4;

// TIFF header + IFD0, values longer than 4 bytes go to a data area after the IFD
export const buildTiff = ({
  byteOrder,
  ifd0,
}: {
  byteOrder: ByteOrder;
  ifd0: TiffEntry[];
}): Uint8Array => {
  const le = byteOrder === 'II';
  const ifdOffset = 8;
  const ifdSize = 2 + ifd0.length * 12 + 4;
  const dataSize = ifd0.reduce((sum, e) => sum + (entrySize(e) > 4 ? entrySize(e) : 0), 0);

  const bytes = new Uint8Array(ifdOffset + ifdSize + dataSize);
  const view = new DataView(bytes.buffer);

  bytes.set(le ? [0x49, 0x49] : [0x4d, 0x4d], 0);
  view.setUint16(2, 42, le);
  view.setUint32(4, ifdOffset, le);
  view.setUint16(ifdOffset, ifd0.length, le);

  let dataOffset = ifdOffset + ifdSize;

  ifd0.forEach((entry, i) => {
    const at = ifdOffset + 2 + i * 12;

    view.setUint16(at, entry.tag, le);
    view.setUint16(at + 2, TYPE[entry.type], le);

    if (entry.type === 'ASCII') {
      const text = new TextEncoder().encode(entry.value + '\0');
      view.setUint32(at + 4, text.length, le);

      if (text.length > 4) {
        view.setUint32(at + 8, dataOffset, le);
        bytes.set(text, dataOffset);
        dataOffset += text.length;
      } else {
        bytes.set(text, at + 8);
      }
    } else {
      view.setUint32(at + 4, 1, le);
      if (entry.type === 'SHORT') view.setUint16(at + 8, entry.value, le);
      else view.setUint32(at + 8, entry.value, le);
    }
  });

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

// Independent IFD0 reader for assertions
export const readIfd0Short = (tiff: Uint8Array, tag: number): number | undefined => {
  const view = new DataView(tiff.buffer, tiff.byteOffset, tiff.byteLength);
  const le = tiff[0] === 0x49;
  const ifd = view.getUint32(4, le);
  const count = view.getUint16(ifd, le);

  for (let i = 0; i < count; i++) {
    const at = ifd + 2 + i * 12;
    if (view.getUint16(at, le) === tag) return view.getUint16(at + 8, le);
  }

  return undefined;
};

// Offsets at which two equally sized buffers differ
export const diffOffsets = (a: Uint8Array, b: Uint8Array): number[] => {
  if (a.length !== b.length) throw new Error(`Length differs: ${a.length} vs ${b.length}`);
  return [...a.keys()].filter((i) => a[i] !== b[i]);
};
