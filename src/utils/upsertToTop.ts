export function upsertToTop<T>(
  items: T[],
  newItem: T,
  predicate: (item: T) => boolean
): T[] {
  const filtered = items.filter((item) => !predicate(item));
  return [newItem, ...filtered];
}
