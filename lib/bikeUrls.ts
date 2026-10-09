export function bikePath(bike: { id?: string; slug: string }) {
  const id = bike.id ? String(bike.id) : "";
  // Older listings already include their Firestore id in the stored slug.
  // Do not append it twice in canonical links or the sitemap.
  const normalizedSlug = bike.slug.toLocaleLowerCase("en-IN");
  const normalizedId = id.toLocaleLowerCase("en-IN");
  const slugAlreadyHasId = id && (
    normalizedSlug.endsWith(`--${normalizedId}`)
    || normalizedSlug.endsWith(`-${normalizedId}`)
  );
  const key = id && !slugAlreadyHasId
    ? `${bike.slug}--${id}`
    : bike.slug;
  return `/bike/${encodeURIComponent(key)}`;
}

export function resolveListing<T extends { id: string; slug: string }>(bikes: T[], key: string): T | undefined {
  return bikes.find(bike => `${bike.slug}--${bike.id}` === key)
    ?? bikes.find(bike => bike.slug === key);
}
