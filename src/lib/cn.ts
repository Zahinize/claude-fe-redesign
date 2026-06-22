type ClassValue = string | number | null | false | undefined | ClassValue[]

/**
 * Tiny classnames joiner (no dependency). Flattens, drops falsy values.
 * Later classes win only by source order — keep conflicting utilities out of
 * the same call site; rely on token semantics instead.
 */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = []
  const walk = (v: ClassValue) => {
    if (!v && v !== 0) return
    if (Array.isArray(v)) v.forEach(walk)
    else out.push(String(v))
  }
  inputs.forEach(walk)
  return out.join(' ')
}
