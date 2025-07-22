export interface ReadingHistoryItem {
  id: string
  title: string
  url?: string
  text?: string  // Add text storage
  timestamp: Date
}

export const getCookieValue = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

export const setCookie = (name: string, value: string, days: number = 30): void => {
  if (typeof document === 'undefined') return
  
  const expires = new Date()
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

export const getReadingHistory = (): ReadingHistoryItem[] => {
  const historyJson = getCookieValue('readingHistory')
  if (!historyJson) return []
  
  try {
    const history = JSON.parse(decodeURIComponent(historyJson))
    return history.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp)
    }))
  } catch {
    return []
  }
}

export const saveReadingHistory = (history: ReadingHistoryItem[]): void => {
  const historyJson = JSON.stringify(history)
  setCookie('readingHistory', encodeURIComponent(historyJson))
}

export const addToReadingHistory = (item: Omit<ReadingHistoryItem, 'id' | 'timestamp'>) => {
  const history = getReadingHistory()
  const newItem: ReadingHistoryItem = {
    id: Date.now().toString(),
    timestamp: new Date(),
    ...item
  }
  
  // Add to beginning and limit to 10 items
  const updatedHistory = [newItem, ...history.slice(0, 9)]
  saveReadingHistory(updatedHistory)
}

export const removeFromReadingHistory = (id: string): void => {
  const history = getReadingHistory()
  const updatedHistory = history.filter(item => item.id !== id)
  saveReadingHistory(updatedHistory)
}

export const clearReadingHistory = (): void => {
  saveReadingHistory([])
}