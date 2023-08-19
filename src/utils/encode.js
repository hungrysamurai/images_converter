import { getCanvasToBMP } from "../../public/canvas-to-bmp";
import UTIF from "utif";
import GIF from "gif.js.optimized";
import { jsPDF } from "jspdf";

export const encode = async (canvas, targetFormatSettings) => {
  const { name: targetFormatName } = targetFormatSettings;

  switch (targetFormatName) {
    case "jpeg":
    case "webp":
    case "png": {
      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          `image/${targetFormatName}`,
          1
        );
      });
    }

    case "bmp": {
      return new Promise((resolve, reject) => {
        const CanvasToBMP = getCanvasToBMP();
        CanvasToBMP.toBlob(canvas, (blob) => {
          resolve(blob);
        });
      });
    }

    case "tiff": {
      const { width, height } = canvas;
      const ctx = canvas.getContext("2d");

      const { data: pixels } = ctx.getImageData(0, 0, width, height);
      const encoded = UTIF.encodeImage(pixels, width, height);

      return new Blob([encoded], { type: "image/tiff" });
    }

    case "gif": {
      return new Promise((resolve, reject) => {
        const gif = new GIF({
          workers: 8,
          quality: 10,
          workerScript: "node_modules/gif.js.optimized/dist/gif.worker.js",
        });

        gif.addFrame(canvas, { delay: 3 });

        gif.on("finished", function (blob) {
          resolve(blob);
        });

        gif.render();
      });
    }
    case "pdf": {
      let pdf;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      if (canvasWidth > canvasHeight) {
        pdf = new jsPDF("l", "px", [canvasWidth, canvasHeight]);
      } else {
        pdf = new jsPDF("p", "px", [canvasHeight, canvasWidth]);
      }

      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      pdf.addImage(canvas, "PNG", 0, 0, width, height);
      return pdf.output("blob");
    }
  }
};
