import React from 'react';
import { responsiveImages } from '../data/responsiveImages';
import { assetPath } from '../config/deployment';

// One img preserves existing CSS selectors and layout. Unknown/imported assets
// keep their original URL; all optimized variants respect the deployment prefix.
function deploymentSrcSet(srcSet) {
  return srcSet.split(',').map(candidate => {
    const [url, ...descriptor] = candidate.trim().split(/\s+/);
    return [assetPath(url), ...descriptor].join(' ');
  }).join(', ');
}

export function responsiveImageProps(src, sizes) {
  const image = responsiveImages[src];
  if (!image) return { src: assetPath(src) };
  return {
    src: assetPath(image.src),
    srcSet: deploymentSrcSet(image.srcSet),
    // A full-size default protects tall object-fit:cover crops from upscaling.
    // Components with a known rendered size supply a smaller responsive size.
    sizes: sizes || `${image.width}px`,
    width: image.width,
    height: image.height,
  };
}

export default function ResponsiveImage({ src, sizes, width, height, fetchPriority, decoding = 'async', ...props }) {
  const image = responsiveImageProps(src, sizes);
  return <img {...image} {...props} width={width || image.width} height={height || image.height} decoding={decoding} fetchpriority={fetchPriority} />;
}
