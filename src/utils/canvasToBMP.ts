const toArrayBuffer = (canvas: HTMLCanvasElement, callback: Function) => {
  let w = canvas.width,
    h = canvas.height,
    w4 = w << 2,
    idata = (canvas.getContext("2d") as CanvasRenderingContext2D).getImageData(
      0,
      0,
      w,
      h
    ),
    data32 = new Uint32Array(idata.data.buffer),
    stride = ((32 * w + 31) / 32) << 2,
    pixelArraySize = stride * h,
    fileLength = 122 + pixelArraySize,
    file = new ArrayBuffer(fileLength),
    view = new DataView(file),
    blockSize = 1 << 20,
    block = blockSize,
    y = 0,
    x,
    v,
    a,
    pos = 0,
    p,
    s = 0;

  // Header
  set16(0x4d42); // BM
  set32(fileLength); // total length
  seek(4); // skip unused fields
  set32(0x7a); // offset to pixels

  // DIB header
  set32(0x6c); // header size (108)
  set32(w);
  set32(-h >>> 0); // negative = top-to-bottom
  set16(1); // 1 plane
  set16(32); // 32-bits (RGBA)
  set32(3); // no compression (BI_BITFIELDS, 3)
  set32(pixelArraySize); // bitmap size incl. padding (stride x height)
  set32(2835); // pixels/meter h (~72 DPI x 39.3701 inch/m)
  set32(2835); // pixels/meter v
  seek(8); // skip color/important colors
  set32(0xff0000); // red channel mask
  set32(0xff00); // green channel mask
  set32(0xff); // blue channel mask
  set32(0xff000000); // alpha channel mask
  set32(0x57696e20); // " win" color space

  (function convert() {
    // bitmap data, change order of ABGR to BGRA (msb-order)
    while (y < h && block > 0) {
      p = 0x7a + y * stride; // offset + stride x height
      x = 0;

      while (x < w4) {
        block--;
        v = data32[s++]; // get ABGR
        a = v >>> 24; // alpha
        view.setUint32(p + x, (v << 8) | a); // set BGRA (msb order)
        x += 4;
      }
      y++;
    }

    if (s < data32.length) {
      block = blockSize;
      setTimeout(convert, 9);
    } else callback(file);
  })();

  // helper method to move current buffer position
  function set16(data: number) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function set32(data: number) {
    view.setUint32(pos, data, true);
    pos += 4;
  }

  function seek(delta: number) {
    pos += delta;
  }
};

export const canvasToBlob = (canvas: HTMLCanvasElement, callback: Function) => {
  toArrayBuffer(canvas, function (file: Blob) {
    callback(new Blob([file], { type: "image/bmp" }));
  });
};
