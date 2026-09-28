import { MIME } from '@/types/formats';

const encodeJPEG_PNG_WEBP = async (
  canvas: OffscreenCanvas,
  format: 'jpeg' | 'png' | 'webp',
  quality?: number,
): Promise<Blob> => {
  return canvas.convertToBlob({
    type: MIME[format],
    quality: quality === undefined ? undefined : quality / 100,
  });
};

export default encodeJPEG_PNG_WEBP;
