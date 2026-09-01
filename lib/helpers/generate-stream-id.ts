
export function generateStreamId(prefix: string, userIds: string[]): string {
  const combined = [...userIds].sort().join('_');

  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; 
  }

  return `${prefix}_${Math.abs(hash).toString(36)}`;
}
