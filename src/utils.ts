export function shortenHash(hash: string, length = 6): string {
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
}
