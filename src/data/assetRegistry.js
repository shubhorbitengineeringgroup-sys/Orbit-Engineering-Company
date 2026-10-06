const files = import.meta.glob('../assets/**/*.{png,jpg,jpeg,webp,avif,svg,pdf}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const findAsset = (folder, filename) => {
  const original = `../assets/${folder ? `${folder}/` : ''}${filename}`;
  const optimized = `../assets/${folder}/optimized/${filename}.webp`;
  const exactCutout = `../assets/${folder}/cutouts/${filename}.png`;
  const cutout = `../assets/${folder}/cutouts/${filename.replace(/\.[^.]+$/, '')}.png`;
  return files[optimized] || files[exactCutout] || files[cutout] || files[original] || null;
};

export const productAsset = filename => findAsset('products', filename);
export const clientAsset = filename => findAsset('clients', filename);
export const partnerAsset = filename => findAsset('partners', filename);
export const documentAsset = filename => findAsset('', filename);
