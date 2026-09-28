export function bikePath(bike: { id?: string; slug: string }) {
  const key = bike.id ? `${bike.slug}--${bike.id}` : bike.slug;
  return `/bike/${encodeURIComponent(key)}`;
}

export function resolveListing<T extends { id: string; slug: string }>(bikes: T[], key: string): T | undefined {
  return bikes.find(bike => `${bike.slug}--${bike.id}` === key)
    ?? bikes.find(bike => bike.slug === key);
}
