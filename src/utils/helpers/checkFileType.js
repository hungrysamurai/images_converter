const validTypes = [
  "application/pdf",
  "image/webp",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
];

export const checkFileType = (type) => {
  return validTypes.some((t) => type === t);
};
