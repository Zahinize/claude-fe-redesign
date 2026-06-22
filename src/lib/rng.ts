/**
 * Deterministic PRNG utilities. Determinism keeps the 100k mock dataset stable
 * across reloads (and avoids the forbidden Math.random in this environment's
 * tooling). All generators seed from a fixed value so screens never reshuffle.
 */

/** mulberry32 — fast, seedable, good enough for mock data. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type Rng = () => number

export function randInt(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1))
}

export function pick<T>(rng: Rng, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

/** Weighted pick: items paired with relative weights. */
export function pickWeighted<T>(rng: Rng, items: readonly (readonly [T, number])[]): T {
  const total = items.reduce((s, [, w]) => s + w, 0)
  let r = rng() * total
  for (const [value, weight] of items) {
    r -= weight
    if (r <= 0) return value
  }
  return items[items.length - 1][0]
}
