export function getProductGallery(product) {
  if (!product) {
    return [];
  }

  const dedupedImages = [];

  [product.thumbnail, ...(product.images || [])]
    .filter(Boolean)
    .forEach((imageUrl) => {
      if (!dedupedImages.includes(imageUrl)) {
        dedupedImages.push(imageUrl);
      }
    });

  return dedupedImages;
}
