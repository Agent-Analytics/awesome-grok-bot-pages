const images = import.meta.glob('../assets/thumbnails/*.{webp,png}', {
  eager: true,
  import: 'default',
});

export function thumbnailFor(slug) {
  const entry = Object.entries(images).find(([key]) => {
    const base = key.split('/').pop();
    return base === `${slug}.webp` || base === `${slug}.png`;
  });
  if (!entry) {
    throw new Error(
      `Missing thumbnail for "${slug}". Expected site/src/assets/thumbnails/${slug}.webp. From site/, run: npm run capture`,
    );
  }
  return entry[1];
}
