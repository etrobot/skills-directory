const FAVORITES_KEY = "prompt_favorites"

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function toggleFavorite(id: string): string[] {
  const current = new Set(getFavorites())
  if (current.has(id)) {
    current.delete(id)
  } else {
    current.add(id)
  }
  const arr = Array.from(current)
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(arr))
  return arr
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id)
}
