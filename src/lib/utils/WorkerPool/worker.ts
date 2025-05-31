import HEICToBlob from './worker_decoders/HEICToBlob';

addEventListener('message', async (e) => {
  const { type, payload } = e.data;

  try {
    switch (type) {
      case 'decode_heic': {
        const blob = await HEICToBlob(payload);
        postMessage(blob);
      }
    }
  } catch (err) {
    setTimeout(() => {
      throw err;
    });
  }
});
