import { getCanvasToBMP } from "../../public/canvas-to-bmp";
import UTIF from "utif";

export const encode = async (canvas, targetFormatSettings) => {

 const { name: targetFormatName } = targetFormatSettings;

 switch (targetFormatName) {
  case 'jpeg':
  case 'webp':
  case 'png': {
   return new Promise((resolve, reject) => {
    canvas.toBlob(
     (blob) => {
      resolve(blob)
     },
     `image/${targetFormatName}`,
     1
    );
   })
  }

  case 'bmp': {
   return new Promise((resolve, reject) => {
    const CanvasToBMP = getCanvasToBMP();
    CanvasToBMP.toBlob(canvas, (blob) => {
     resolve(blob)
    })
   })
  }

  case 'tiff': {
   const { width, height } = canvas;
   const ctx = canvas.getContext('2d');

   const { data: pixels } = ctx.getImageData(0, 0, width, height);

   const encoded = UTIF.encodeImage(pixels, width, height);

   return new Blob([encoded], { type: 'image/tiff' })
  }


  case 'gif': {
   console.log('encode to gif...');
  }
   break;

  case 'pdf': {
   console.log('encode to pdf...');
  }
 }


}