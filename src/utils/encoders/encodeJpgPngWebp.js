export const encodeJpgPngWebp = async (canvas, targetFormatSettings) => {
  const { name: targetFormatName } = targetFormatSettings;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      `image/${targetFormatName}`,
      1
    );
  });
};
