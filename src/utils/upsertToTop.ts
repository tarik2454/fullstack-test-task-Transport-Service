export function upsertToTop<T>(
  items: T[],
  newItem: T | undefined,
  predicate: (item: T) => boolean
): T[] {
  if (!newItem) return items;

  const filtered = items.filter((item) => !predicate(item));
  return [newItem, ...filtered];
}
