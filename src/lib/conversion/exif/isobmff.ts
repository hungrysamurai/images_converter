// HEIF container shared by HEIC and AVIF: EXIF is a metadata item of type `Exif`,
// declared in meta/iinf and located through meta/iloc

type Box = { type: string; start: number; end: number };

class Reader {
  readonly view: DataView;

  constructor(readonly bytes: Uint8Array) {
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  }

  ensure(offset: number, size: number) {
    if (offset < 0 || offset + size > this.bytes.length) {
      throw new Error(`ISOBMFF read out of bounds at ${offset}`);
    }
  }

  // Unsigned big-endian integer of 0, 1, 2, 4 or 8 bytes
  uint(offset: number, size: number): number {
    this.ensure(offset, size);

    switch (size) {
      case 0:
        return 0;
      case 1:
        return this.view.getUint8(offset);
      case 2:
        return this.view.getUint16(offset);
      case 4:
        return this.view.getUint32(offset);
      case 8: {
        const value = this.view.getBigUint64(offset);
        if (value > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('ISOBMFF value is too large');
        return Number(value);
      }
      default:
        throw new Error(`Unsupported ISOBMFF field size: ${size}`);
    }
  }

  fourCC(offset: number): string {
    this.ensure(offset, 4);
    return String.fromCharCode(...this.bytes.subarray(offset, offset + 4));
  }

  // Child boxes in [start, end)
  *boxes(start: number, end: number): Generator<Box> {
    let offset = start;

    while (offset < end) {
      if (offset + 8 > end) throw new Error(`Truncated ISOBMFF box header at ${offset}`);

      let size = this.uint(offset, 4);
      const type = this.fourCC(offset + 4);
      let header = 8;

      if (size === 1) {
        size = this.uint(offset + 8, 8);
        header = 16;
      } else if (size === 0) {
        size = end - offset;
      }

      const boxEnd = offset + size;
      if (size < header || boxEnd > end)
        throw new Error(`Invalid ISOBMFF box '${type}' at ${offset}`);

      yield { type, start: offset + header, end: boxEnd };
      offset = boxEnd;
    }
  }

  find(start: number, end: number, type: string): Box | undefined {
    for (const child of this.boxes(start, end)) if (child.type === type) return child;
    return undefined;
  }
}

// FullBox payload starts with version (1 byte) and flags (3 bytes)
const FULL_BOX_HEADER = 4;

// ID of the first item of type `Exif`. Only infe v2+ carries the item type
const findExifItemId = (reader: Reader, iinf: Box): number | undefined => {
  const version = reader.uint(iinf.start, 1);
  const entriesStart = iinf.start + FULL_BOX_HEADER + (version === 0 ? 2 : 4);

  for (const infe of reader.boxes(entriesStart, iinf.end)) {
    if (infe.type !== 'infe') continue;

    const infeVersion = reader.uint(infe.start, 1);
    if (infeVersion < 2) continue;

    const idSize = infeVersion === 2 ? 2 : 4;
    const id = reader.uint(infe.start + FULL_BOX_HEADER, idSize);
    // item_protection_index (2 bytes) precedes the item type
    const type = reader.fourCC(infe.start + FULL_BOX_HEADER + idSize + 2);

    if (type === 'Exif') return id;
  }

  return undefined;
};

type Location = {
  constructionMethod: number;
  extents: { offset: number; length: number }[];
};

const findItemLocation = (reader: Reader, iloc: Box, itemId: number): Location => {
  const version = reader.uint(iloc.start, 1);
  if (version > 2) throw new Error(`Unsupported iloc version ${version}`);

  let offset = iloc.start + FULL_BOX_HEADER;

  const sizes = reader.uint(offset, 1);
  const offsetSize = sizes >> 4;
  const lengthSize = sizes & 0x0f;
  const sizes2 = reader.uint(offset + 1, 1);
  const baseOffsetSize = sizes2 >> 4;
  const indexSize = version === 0 ? 0 : sizes2 & 0x0f;
  offset += 2;

  const idSize = version < 2 ? 2 : 4;
  const itemCount = reader.uint(offset, idSize);
  offset += idSize;

  for (let i = 0; i < itemCount; i++) {
    const id = reader.uint(offset, idSize);
    offset += idSize;

    let constructionMethod = 0;
    if (version > 0) {
      constructionMethod = reader.uint(offset, 2) & 0x0f;
      offset += 2;
    }

    const dataReferenceIndex = reader.uint(offset, 2);
    const baseOffset = reader.uint(offset + 2, baseOffsetSize);
    offset += 2 + baseOffsetSize;

    const extentCount = reader.uint(offset, 2);
    offset += 2;

    const extents = [];
    for (let j = 0; j < extentCount; j++) {
      offset += indexSize;
      const extentOffset = reader.uint(offset, offsetSize);
      const length = reader.uint(offset + offsetSize, lengthSize);
      offset += offsetSize + lengthSize;

      extents.push({ offset: baseOffset + extentOffset, length });
    }

    if (id !== itemId) continue;

    if (dataReferenceIndex !== 0) throw new Error('Exif item is stored in an external file');
    if (extents.length === 0) throw new Error('Exif item has no extents');

    return { constructionMethod, extents };
  }

  throw new Error(`No iloc entry for Exif item ${itemId}`);
};

const readItemData = (reader: Reader, meta: Box, location: Location): Uint8Array => {
  let source: { start: number; end: number };

  switch (location.constructionMethod) {
    // File offset
    case 0:
      source = { start: 0, end: reader.bytes.length };
      break;
    // Offset inside meta/idat
    case 1: {
      const idat = reader.find(meta.start + FULL_BOX_HEADER, meta.end, 'idat');
      if (!idat) throw new Error('Exif item refers to a missing idat box');
      source = idat;
      break;
    }
    default:
      throw new Error(`Unsupported iloc construction method ${location.constructionMethod}`);
  }

  const parts = location.extents.map(({ offset, length }) => {
    const start = source.start + offset;
    // Zero length means "up to the end of the source"
    const end = length === 0 ? source.end : start + length;

    if (start < source.start || end > source.end || start > end) {
      throw new Error('Exif item extent is out of bounds');
    }

    return reader.bytes.subarray(start, end);
  });

  const data = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let cursor = 0;
  for (const part of parts) {
    data.set(part, cursor);
    cursor += part.length;
  }

  return data;
};

// Exif item payload starts with the offset to the TIFF header, usually skipping "Exif\0\0"
const skipTiffHeaderOffset = (item: Uint8Array): Uint8Array => {
  if (item.length < 4) throw new Error('Exif item is too short');

  const tiffStart = 4 + new DataView(item.buffer, item.byteOffset, 4).getUint32(0);
  if (tiffStart >= item.length) throw new Error('Exif item TIFF header offset is out of bounds');

  return item.slice(tiffStart);
};

export const extractFromISOBMFF = (bytes: Uint8Array): Uint8Array | null => {
  const reader = new Reader(bytes);

  const meta = reader.find(0, bytes.length, 'meta');
  if (!meta) throw new Error('No meta box in ISOBMFF file');

  const childrenStart = meta.start + FULL_BOX_HEADER;

  const iinf = reader.find(childrenStart, meta.end, 'iinf');
  if (!iinf) throw new Error('No iinf box in meta');

  const exifItemId = findExifItemId(reader, iinf);
  if (exifItemId === undefined) return null;

  const iloc = reader.find(childrenStart, meta.end, 'iloc');
  if (!iloc) throw new Error('No iloc box in meta');

  const location = findItemLocation(reader, iloc, exifItemId);

  return skipTiffHeaderOffset(readItemData(reader, meta, location));
};
