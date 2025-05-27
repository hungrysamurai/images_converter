export const isHEIC = (file: File) => {
  const x = file.type ? file.type.split('image/').pop() : file.name.split('.').pop()?.toLowerCase();

  return x === 'heic' || x === 'heif';
};
