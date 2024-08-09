import { PDFCompressionTypes } from "../../types/types";

const canvasToBlob = async (
 canvas: HTMLCanvasElement,
 compression: PDFCompressionTypes,
 quality: number
): Promise<Blob> => {
 return new Promise((resolve, reject) => {
  canvas.toBlob(
   (blob: Blob | null) => {

    if (blob) {
     resolve(blob);
    } else {
     reject()
    }
   },
   `image/${compression}`,
   quality
  )
 })
}

export default canvasToBlob;