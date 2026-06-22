import { useEffect } from 'react'
import type { RefObject } from 'react'

/** Calls handler when a pointerdown/keydown(Escape) occurs outside the ref. */
export function useOnClickOutside(
  ref: RefObject<HTMLElement>,
  handler: () => void,
  active = true,
): void {
  useEffect(() => {
    if (!active) return
    function onPointer(e: PointerEvent) {
      const el = ref.current
      if (el && !el.contains(e.target as Node)) handler()
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handler()
    }
    document.addEventListener('pointerdown', onPointer, true)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer, true)
      document.removeEventListener('keydown', onKey)
    }
  }, [ref, handler, active])
}
