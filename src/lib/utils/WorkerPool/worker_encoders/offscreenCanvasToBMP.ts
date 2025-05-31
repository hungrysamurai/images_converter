export class OffscreenCanvasToBMP {
  private view: DataView = new DataView(new ArrayBuffer(0));
  private pos = 0;

  toArrayBuffer(canvas: OffscreenCanvas): ArrayBuffer {
    const w = canvas.width;
    const h = canvas.height;

    const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
    const idata = ctx.getImageData(0, 0, w, h);
    const data32 = new Uint32Array(idata.data.buffer);

    const stride = Math.floor((32 * w + 31) / 32) * 4;
    const pixelArraySize = stride * h;
    const fileLength = 122 + pixelArraySize;

    const file = new ArrayBuffer(fileLength);
    this.view = new DataView(file);
    let x = 0,
      y = 0,
      p = 0,
      s = 0,
      alpha = 0,
      abgr = 0;

    this.setU16(0x4d42);
    this.setU32(fileLength);
    this.pos += 4;
    this.setU32(0x7a);

    // DIB header
    this.setU32(108);
    this.setU32(w);
    this.setU32(-h >>> 0);
    this.setU16(1);
    this.setU16(32);
    this.setU32(3);
    this.setU32(pixelArraySize);
    this.setU32(2835);
    this.setU32(2835);
    this.pos += 8;
    this.setU32(0xff0000);
    this.setU32(0xff00);
    this.setU32(0xff);
    this.setU32(0xff000000);
    this.setU32(0x57696e20); // " win"

    while (y < h) {
      p = 0x7a + y * stride;
      x = 0;
      while (x < w * 4) {
        abgr = data32[s++];
        alpha = abgr >>> 24;
        this.view.setUint32(p + x, (abgr << 8) | alpha);
        x += 4;
      }
      y++;
    }

    return file;
  }

  private setU16(data: number) {
    this.view.setUint16(this.pos, data, true);
    this.pos += 2;
  }

  private setU32(data: number) {
    this.view.setUint32(this.pos, data, true);
    this.pos += 4;
  }

  toBuffer(canvas: OffscreenCanvas): Uint8Array {
    return new Uint8Array(this.toArrayBuffer(canvas));
  }
}
