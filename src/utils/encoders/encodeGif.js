import GIF from "gif.js.optimized";

export const encodeGif = async (canvas) => {
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
};
