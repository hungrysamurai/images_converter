export const isHEIC = (file) => {
 let x = file.type ? file.type.split('image/').pop() : file.name.split('.').pop().toLowerCase();
 return x == 'heic' || x == 'heif';
}
