const DEFAULTS = {
  maxWidth: 1200,
  maxHeight: 1600,
  quality: 0.82,
  maxBytes: 1_500_000,
};

/**
 * Resize/compress product photos in the browser before upload (JPEG).
 */
export async function compressImage(file, options = {}) {
  const { maxWidth, maxHeight, quality, maxBytes } = { ...DEFAULTS, ...options };

  if (!file?.type?.startsWith('image/')) {
    throw new Error('Only image files are allowed.');
  }

  const bitmap = await createImageBitmap(file);
  let width = bitmap.width;
  let height = bitmap.height;
  const scale = Math.min(maxWidth / width, maxHeight / height, 1);
  width = Math.max(1, Math.round(width * scale));
  height = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not process image.');
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let q = quality;
  let blob = await canvasToBlob(canvas, q);
  while (blob.size > maxBytes && q > 0.5) {
    q -= 0.08;
    blob = await canvasToBlob(canvas, q);
  }

  const baseName = (file.name || 'product').replace(/\.[^.]+$/, '');
  return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
}

function canvasToBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Image compression failed.'))),
      'image/jpeg',
      quality
    );
  });
}
