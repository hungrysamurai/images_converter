const TAG_ORIENTATION = 0x0112;
const TAG_JPEG_INTERCHANGE_FORMAT = 0x0201;
const TAG_JPEG_INTERCHANGE_FORMAT_LENGTH = 0x0202;
const TAG_EXIF_IFD = 0x8769;
const TAG_PIXEL_X_DIMENSION = 0xa002;
const TAG_PIXEL_Y_DIMENSION = 0xa003;

const TYPE_SHORT = 3;
const TYPE_LONG = 4;
// Some writers declare sub-IFD pointers with the dedicated IFD type
const TYPE_IFD = 13;

const IFD_ENTRY_SIZE = 12;

class TiffReader {
  readonly view: DataView;
  readonly le: boolean;

  constructor(readonly bytes: Uint8Array) {
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

    if (bytes.length < 8) throw new Error('EXIF is too short for a TIFF header');

    const order = String.fromCharCode(bytes[0], bytes[1]);
    if (order !== 'II' && order !== 'MM') throw new Error(`Invalid TIFF byte order: ${order}`);

    this.le = order === 'II';

    if (this.view.getUint16(2, this.le) !== 42) throw new Error('Invalid TIFF magic number');
  }

  private check(offset: number, size: number) {
    if (offset < 0 || offset + size > this.bytes.length) {
      throw new Error(`EXIF offset ${offset} is out of bounds`);
    }
  }

  u16(offset: number) {
    this.check(offset, 2);
    return this.view.getUint16(offset, this.le);
  }

  u32(offset: number) {
    this.check(offset, 4);
    return this.view.getUint32(offset, this.le);
  }

  setU16(offset: number, value: number) {
    this.check(offset, 2);
    this.view.setUint16(offset, value, this.le);
  }

  setU32(offset: number, value: number) {
    this.check(offset, 4);
    this.view.setUint32(offset, value, this.le);
  }

  // Offsets of all 12-byte entries of the IFD, validated against the buffer
  ifdEntries(ifdOffset: number): number[] {
    const count = this.u16(ifdOffset);
    this.check(ifdOffset + 2, count * IFD_ENTRY_SIZE + 4);

    return Array.from({ length: count }, (_, i) => ifdOffset + 2 + i * IFD_ENTRY_SIZE);
  }

  // Offset of the link to the next IFD, right after the entries
  nextIfdLink(ifdOffset: number): number {
    return ifdOffset + 2 + this.ifdEntries(ifdOffset).length * IFD_ENTRY_SIZE;
  }

  findEntry(ifdOffset: number, tag: number): number | undefined {
    return this.ifdEntries(ifdOffset).find((entry) => this.u16(entry) === tag);
  }

  // Offset of the sub-IFD the pointer entry refers to
  subIfd(entry: number): number {
    const type = this.u16(entry + 2);

    if ((type !== TYPE_LONG && type !== TYPE_IFD) || this.u32(entry + 4) !== 1) {
      throw new Error(`Invalid sub-IFD pointer tag ${this.u16(entry)}`);
    }

    return this.u32(entry + 8);
  }
}

const readLong = (reader: TiffReader, entry: number) => {
  if (reader.u16(entry + 2) !== TYPE_LONG || reader.u32(entry + 4) !== 1) {
    throw new Error(`Invalid LONG tag ${reader.u16(entry)}`);
  }

  return reader.u32(entry + 8);
};

// Start of the JPEG thumbnail if it is the tail of the block and can be cut off,
// otherwise the length of the block
const thumbnailCut = (reader: TiffReader, ifd1: number): number => {
  const offsetEntry = reader.findEntry(ifd1, TAG_JPEG_INTERCHANGE_FORMAT);
  const lengthEntry = reader.findEntry(ifd1, TAG_JPEG_INTERCHANGE_FORMAT_LENGTH);
  const size = reader.bytes.length;

  if (offsetEntry === undefined || lengthEntry === undefined) return size;

  const offset = readLong(reader, offsetEntry);
  const length = readLong(reader, lengthEntry);

  if (offset + length > size) throw new Error('EXIF thumbnail is out of bounds');

  // Thumbnail must not overlap the header and IFD0
  return offset + length === size && offset > reader.u32(4) ? offset : size;
};

// Writes a single SHORT or LONG value in place. SHORT that can't hold the value becomes LONG:
// both fit into the 4-byte value field
const writeDimension = (reader: TiffReader, entry: number, value: number) => {
  const type = reader.u16(entry + 2);

  if ((type !== TYPE_SHORT && type !== TYPE_LONG) || reader.u32(entry + 4) !== 1) {
    throw new Error(`Invalid dimension tag ${reader.u16(entry)}`);
  }

  if (type === TYPE_SHORT && value <= 0xffff) {
    reader.setU16(entry + 8, value);
  } else {
    reader.setU16(entry + 2, TYPE_LONG);
    reader.setU32(entry + 8, value);
  }
};

// Returns a copy of raw EXIF (TIFF structure) with tags that become stale after conversion fixed.
// `width` and `height` are the actual dimensions of the output image
export const patchExif = (
  tiff: Uint8Array,
  { width, height }: { width: number; height: number },
): Uint8Array => {
  const reader = new TiffReader(tiff.slice());
  const ifd0 = reader.u32(4);

  // Decoders output already rotated pixels, viewers must not rotate them again
  const orientation = reader.findEntry(ifd0, TAG_ORIENTATION);

  if (orientation !== undefined) {
    if (reader.u16(orientation + 2) !== TYPE_SHORT || reader.u32(orientation + 4) !== 1) {
      throw new Error('Invalid Orientation tag');
    }

    reader.setU16(orientation + 8, 1);
  }

  // Source dimensions are stale after resize
  const exifPointer = reader.findEntry(ifd0, TAG_EXIF_IFD);

  if (exifPointer !== undefined) {
    const exifIfd = reader.subIfd(exifPointer);

    for (const [tag, value] of [
      [TAG_PIXEL_X_DIMENSION, width],
      [TAG_PIXEL_Y_DIMENSION, height],
    ]) {
      const entry = reader.findEntry(exifIfd, tag);
      if (entry !== undefined) writeDimension(reader, entry, value);
    }
  }

  // Thumbnail shows the source image before rotation and resize. IFD1 is unlinked,
  // its data is cut off only when nothing else can follow it
  const ifd1Link = reader.nextIfdLink(ifd0);
  const ifd1 = reader.u32(ifd1Link);

  if (ifd1 === 0) return reader.bytes;

  const cut = thumbnailCut(reader, ifd1);
  reader.setU32(ifd1Link, 0);

  return reader.bytes.subarray(0, cut);
};
