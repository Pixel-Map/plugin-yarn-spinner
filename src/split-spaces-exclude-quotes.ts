/**
 * Splits a string on each space, unless the space is within a pair of quotes.
 * @param input
 */
export function splitSpacesExcludeQuotes(input: string) {
  const matches = input.match(/\\?.|^$/g);
  if (matches) {
    // @ts-ignore
    return matches.reduce(
      (p: { quote: number; a: any[] }, c: string) => {
        if (c === '"') {
          // eslint-disable-next-line no-bitwise
          p.quote ^= 1;
        } else if (!p.quote && c === ' ') {
          p.a.push('');
        } else {
          p.a[p.a.length - 1] += c.replace(/\\(.)/, '$1');
        }
        return p;
      },
      { a: [''] },
      // @ts-ignore
    ).a;
  }
}
