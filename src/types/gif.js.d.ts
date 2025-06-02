declare module 'gif.js' {
  import type { GIFDitherOptions } from './types';

  interface GIFOptions {
    workers: number;
    quality: number;
    workerScript: string;
    dither: GIFDitherOptions | false;
    background?: string;
    debug?: boolean;
    repeat?: number;
    transparent?: number | null;
    width?: number;
    height?: number;
  }

  type FinishCallback = (blob: Blob) => void;
  type ErrorCallback = (error: Error) => void;

  class GIF {
    constructor(options: GIFOptions);

    addFrame: (
      imgData: ImageData | HTMLCanvasElement,
      opt?: {
        delay?: number;
        copy?: boolean;
        dispose?: number;
      },
    ) => void;

    on(event: 'finished', cb: FinishCallback): void;
    on(event: 'error', cb: ErrorCallback): void;

    render: () => void;
  }

  export = GIF;
}
