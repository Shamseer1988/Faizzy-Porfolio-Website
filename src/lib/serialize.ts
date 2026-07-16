// SQLite (and Cloudflare D1) have no array column type, so string[] fields
// are stored as JSON strings. These helpers convert between the two shapes.

export function parseList(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[];
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
