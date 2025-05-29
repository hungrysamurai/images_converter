export const getFileSize = (bytes: number): string => {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = 2;
  const sizes = ['bytes', 'kb', 'mb', 'gb'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
