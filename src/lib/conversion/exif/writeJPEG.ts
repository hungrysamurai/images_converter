import type { ExifWriter } from '../outputFormats';

// Placeholder: returns the JPEG untouched until the APP1 writer lands
const writeJPEG: ExifWriter = async (encoded) => encoded;

export default writeJPEG;
