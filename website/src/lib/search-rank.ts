/**
 * Ranks one search entry against a query, for the header search. It returns 0
 * for no match and a higher number for a better one.
 *
 * Every word of the query must appear somewhere in the entry. Among the
 * matches, the title decides the order: an exact title first, then a title
 * that starts with the query, then a word in the title that starts with it,
 * then the query anywhere in the title. A match that is only in the
 * description or the group comes last.
 *
 * It is deliberately not fuzzy. A letter-by-letter match against a long
 * description puts unrelated pages above the one whose name was typed.
 */
export function rankSearch(query: string, title: string, description = "", group = ""): number {
  const needle = query.trim().toLowerCase();
  if (!needle) return 1;

  const name = title.toLowerCase();
  const terms = needle.split(/\s+/);
  const everything = `${name} ${description.toLowerCase()} ${group.toLowerCase()}`;
  if (!terms.every((term) => everything.includes(term))) return 0;

  if (name === needle) return 1;
  if (name.startsWith(needle)) return 0.9;
  if (name.split(/[\s/-]+/).some((word) => word.startsWith(needle))) return 0.8;
  if (name.includes(needle)) return 0.7;
  if (terms.every((term) => name.includes(term))) return 0.6;
  if (group.toLowerCase().includes(needle)) return 0.4;
  return 0.3;
}
