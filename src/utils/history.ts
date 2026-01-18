export type ChatSession = {
  id: string
  title: string
  promptId?: string
  createdAt: number
  messages: { role: "user" | "assistant"; content: string }[]
}

const HISTORY_KEY = "chat_history"

export function getHistory(): ChatSession[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveSession(session: ChatSession) {
  const list = getHistory()
  const index = list.findIndex((s) => s.id === session.id)
  if (index >= 0) {
    list[index] = session
  } else {
    list.unshift(session)
  }
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list))
}

export function createSession(title: string, promptId?: string): ChatSession {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return {
    id,
    title,
    promptId,
    createdAt: Date.now(),
    messages: [],
  }
}
