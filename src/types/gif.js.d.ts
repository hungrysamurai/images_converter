declare module "gif.js" {
 interface options {
  workers: number,
  quality: number,
  workerScript: string,
  dither: import("./types").GIFDitherOptions | false,
  background?: string,
  debug?: boolean,
  repeat?: number
  transparent?: number | null,
  width?: number,
  height?: number
 }

 type finishCallback = (blob: Blob) => void

 class GIFInstance {
  constructor(opt: options)

  addFrame: (
   canvas: HTMLCanvasElement,
   opt?: {
    delay?: number,
    copy?: boolean,
    dispose?: number
   }) => void
  on: (event: 'finished', cb: finishCallback) => void
  render: () => void
 }

 export = GIFInstance
}