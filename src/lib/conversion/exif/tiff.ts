const TAG_ORIENTATION = 0x0112;
const TYPE_SHORT = 3;

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

  // Offsets of all 12-byte entries of the IFD, validated against the buffer
  ifdEntries(ifdOffset: number): number[] {
    const count = this.u16(ifdOffset);
    this.check(ifdOffset + 2, count * IFD_ENTRY_SIZE + 4);

    return Array.from({ length: count }, (_, i) => ifdOffset + 2 + i * IFD_ENTRY_SIZE);
  }

  findEntry(ifdOffset: number, tag: number): number | undefined {
    return this.ifdEntries(ifdOffset).find((entry) => this.u16(entry) === tag);
  }
}

// Returns a copy of raw EXIF (TIFF structure) with tags that become stale after conversion fixed
export const patchExif = (tiff: Uint8Array): Uint8Array => {
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

  return reader.bytes;
};
