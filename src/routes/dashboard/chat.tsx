import { createFileRoute, useRouter, useSearch } from "@tanstack/react-router"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { presetPrompts } from "@/data/prompts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  createSession,
  getHistory,
  saveSession,
  type ChatSession,
} from "@/utils/history"
import { getFavorites } from "@/utils/favorites"
import { useEffect, useMemo, useRef, useState } from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Msg = { role: "user" | "assistant"; content: string }

export const Route = createFileRoute("/dashboard/chat")({
  component: ChatView,
})

// 思考内容组件
function ThinkingContent({ content }: { content: string }) {
  const thinkingMatch = content.match(/<thinking>([\s\S]*?)<\/thinking>/);
  const thinking = thinkingMatch ? thinkingMatch[1].trim() : '';
  const response = content.replace(/<thinking>[\s\S]*?<\/thinking>/, '').trim();
  
  if (!thinking) {
    return (
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="prose prose-sm max-w-none dark:prose-invert my-2 first:mt-0 last:mb-0">{children}</p>,
          h1: ({ children }) => <h1 className="prose prose-sm max-w-none dark:prose-invert text-inherit mt-4 mb-2 first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="prose prose-sm max-w-none dark:prose-invert text-inherit mt-4 mb-2 first:mt-0">{children}</h2>,
          h3: ({ children }) => <h3 className="prose prose-sm max-w-none dark:prose-invert text-inherit mt-4 mb-2 first:mt-0">{children}</h3>,
          code: ({ children }) => <code className="text-inherit bg-muted/50 px-1 py-0.5 rounded text-sm">{children}</code>,
          pre: ({ children }) => <pre className="bg-muted/50 p-3 rounded my-2 first:mt-0 last:mb-0">{children}</pre>,
          ul: ({ children }) => <ul className="my-2 first:mt-0 last:mb-0">{children}</ul>,
          ol: ({ children }) => <ol className="my-2 first:mt-0 last:mb-0">{children}</ol>,
          li: ({ children }) => <li className="my-1">{children}</li>,
          table: ({ children }) => <table className="my-2 first:mt-0 last:mb-0">{children}</table>,
          blockquote: ({ children }) => <blockquote className="border-l-2 border-muted-foreground/20 pl-4 my-2 first:mt-0 last:mb-0">{children}</blockquote>,
        }}
      >
        {content}
      </ReactMarkdown>
    );
  }
  
  return (
    <div className="space-y-3">
      <details className="group">
        <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors list-none">
          <span className="inline-flex items-center gap-2">
            思考过程
            <span className="group-open:rotate-90 transition-transform">▶</span>
          </span>
        </summary>
        <div className="mt-2 p-3 bg-muted/50 rounded-md text-sm text-muted-foreground border-l-2 border-muted-foreground/20">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="prose-muted my-2 first:mt-0 last:mb-0">{children}</p>,
              h1: ({ children }) => <h1 className="prose-muted text-inherit mt-4 mb-2 first:mt-0">{children}</h1>,
              h2: ({ children }) => <h2 className="prose-muted text-inherit mt-4 mb-2 first:mt-0">{children}</h2>,
              h3: ({ children }) => <h3 className="prose-muted text-inherit mt-4 mb-2 first:mt-0">{children}</h3>,
              code: ({ children }) => <code className="text-inherit bg-muted/50 px-1 py-0.5 rounded text-sm">{children}</code>,
              pre: ({ children }) => <pre className="bg-muted/50 p-3 rounded my-2 first:mt-0 last:mb-0">{children}</pre>,
              ul: ({ children }) => <ul className="my-2 first:mt-0 last:mb-0">{children}</ul>,
              ol: ({ children }) => <ol className="my-2 first:mt-0 last:mb-0">{children}</ol>,
              li: ({ children }) => <li className="my-1">{children}</li>,
              table: ({ children }) => <table className="my-2 first:mt-0 last:mb-0">{children}</table>,
              blockquote: ({ children }) => <blockquote className="border-l-2 border-muted-foreground/20 pl-4 my-2 first:mt-0 last:mb-0">{children}</blockquote>,
            }}
          >
            {thinking}
          </ReactMarkdown>
        </div>
      </details>
      {response && (
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="prose prose-sm max-w-none dark:prose-invert my-2 first:mt-0 last:mb-0">{children}</p>,
            h1: ({ children }) => <h1 className="prose prose-sm max-w-none dark:prose-invert text-inherit mt-4 mb-2 first:mt-0">{children}</h1>,
            h2: ({ children }) => <h2 className="prose prose-sm max-w-none dark:prose-invert text-inherit mt-4 mb-2 first:mt-0">{children}</h2>,
            h3: ({ children }) => <h3 className="prose prose-sm max-w-none dark:prose-invert text-inherit mt-4 mb-2 first:mt-0">{children}</h3>,
            code: ({ children }) => <code className="text-inherit bg-muted/50 px-1 py-0.5 rounded text-sm">{children}</code>,
            pre: ({ children }) => <pre className="bg-muted/50 p-3 rounded my-2 first:mt-0 last:mb-0">{children}</pre>,
            ul: ({ children }) => <ul className="my-2 first:mt-0 last:mb-0">{children}</ul>,
            ol: ({ children }) => <ol className="my-2 first:mt-0 last:mb-0">{children}</ol>,
            li: ({ children }) => <li className="my-1">{children}</li>,
            table: ({ children }) => <table className="my-2 first:mt-0 last:mb-0">{children}</table>,
            blockquote: ({ children }) => <blockquote className="border-l-2 border-muted-foreground/20 pl-4 my-2 first:mt-0 last:mb-0">{children}</blockquote>,
          }}
        >
          {response}
        </ReactMarkdown>
      )}
    </div>
  );
}

function ChatView() {
  const search = useSearch({ from: "/dashboard/chat" }) as { promptId?: string; sessionId?: string }
  const router = useRouter()
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const endRef = useRef<HTMLDivElement>(null)
  const sessionRef = useRef<ChatSession | null>(null)
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [selectedPromptId, setSelectedPromptId] = useState<string | undefined>(
    search.promptId,
  )

  const systemPrompt = useMemo(() => {
    if (!selectedPromptId) return ""
    const p = presetPrompts.find((x) => x.id === selectedPromptId)
    return p?.prompt || ""
  }, [selectedPromptId])

  useEffect(() => {
    setFavoriteIds(getFavorites())
  }, [])

  useEffect(() => {
    if (search?.promptId) {
      setSelectedPromptId(search.promptId)
    }
  }, [search?.promptId])

  useEffect(() => {
    if (search?.sessionId) {
      const s = getHistory().find((x) => x.id === search.sessionId)
      if (s) {
        sessionRef.current = s
        setMessages(s.messages)
      }
    }
  }, [search?.sessionId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  const send = async () => {
    if (!input.trim()) return
    const userMsg: Msg = { role: "user", content: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setSending(true)
    
    try {
      const payload = {
        messages: [
          systemPrompt ? { role: "system", content: systemPrompt } : undefined,
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: "user", content: userMsg.content },
        ].filter(Boolean),
      }
      
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`)
      }

      const reader = resp.body?.getReader()
      if (!reader) {
        throw new Error('No reader available')
      }

      let assistantContent = ""
      
      // 添加一个空的助手消息，我们将逐步更新它
      setMessages((prev) => [...prev, { role: "assistant", content: "" }])
      
      const decoder = new TextDecoder()
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              break
            }
            
            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content || ''
              if (content) {
                assistantContent += content
                // 更新最后一条消息
                setMessages((prev) => {
                  const newMessages = [...prev]
                  newMessages[newMessages.length - 1] = {
                    role: "assistant",
                    content: assistantContent
                  }
                  return newMessages
                })
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
      
      // 保存会话
      const base =
        sessionRef.current ||
        createSession(
          presetPrompts.find((x) => x.id === selectedPromptId)?.title ||
            "新的会话",
          selectedPromptId,
        )
      const updated: ChatSession = {
        ...base,
        messages: [...messages, userMsg, { role: "assistant", content: assistantContent }],
      }
      sessionRef.current = updated
      saveSession(updated)
      
    } catch (err) {
      console.error('Chat error:', err)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "请求失败，请稍后再试。" },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">聊天</h1>
      <Card className="p-3 space-y-2 border-none shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-medium">使用提示词</div>
          <Select
            value={selectedPromptId || ""}
            onValueChange={(value) => {
              const v = value || undefined
              setSelectedPromptId(v)
              router.navigate({
                to: "/dashboard/chat",
                search: {
                  promptId: v,
                },
              })
            }}
          >
            <SelectTrigger size="sm" className="border-none bg-secondary/20">
              <SelectValue placeholder="选择一个收藏的提示词" />
            </SelectTrigger>
            <SelectContent>
              {presetPrompts
                .filter((p) => favoriteIds.includes(p.id))
                .map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        {systemPrompt ? (
          <div className="text-xs text-muted-foreground">
            当前：{presetPrompts.find((x) => x.id === selectedPromptId)?.title}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            请选择一个已经收藏的提示词开始聊天
          </div>
        )}
      </Card>
      <Card className="p-0 border-none shadow-md overflow-hidden">
        <ScrollArea className="h-[50vh] p-4">
          <div className="space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "text-right"
                    : "text-left"
                }
              >
                <div
                  className={
                    m.role === "user"
                      ? "inline-block bg-primary text-primary-foreground rounded-lg px-3 py-2 max-w-[80%] chat-message"
                      : "inline-block bg-muted rounded-lg px-3 py-2 max-w-[80%] chat-message"
                  }
                >
                  {m.role === "assistant" ? (
                    <ThinkingContent content={m.content} />
                  ) : (
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
                        h1: ({ children }) => <h1 className="text-inherit mt-4 mb-2 first:mt-0">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-inherit mt-4 mb-2 first:mt-0">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-inherit mt-4 mb-2 first:mt-0">{children}</h3>,
                        code: ({ children }) => <code className="text-inherit bg-primary-foreground/20 px-1 py-0.5 rounded text-sm">{children}</code>,
                        pre: ({ children }) => <pre className="bg-primary-foreground/20 p-3 rounded my-2 first:mt-0 last:mb-0">{children}</pre>,
                        ul: ({ children }) => <ul className="my-2 first:mt-0 last:mb-0">{children}</ul>,
                        ol: ({ children }) => <ol className="my-2 first:mt-0 last:mb-0">{children}</ol>,
                        li: ({ children }) => <li className="my-1">{children}</li>,
                        table: ({ children }) => <table className="my-2 first:mt-0 last:mb-0">{children}</table>,
                        blockquote: ({ children }) => <blockquote className="border-l-2 border-primary-foreground/20 pl-4 my-2 first:mt-0 last:mb-0">{children}</blockquote>,
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="text-left">
                <div className="inline-block bg-muted rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full"></div>
                    <span className="text-sm text-muted-foreground">AI 正在思考...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </ScrollArea>
        <div className="p-4 bg-secondary/10 space-y-2">
          <Textarea
            className="border-none bg-secondary/20 resize-none focus-visible:ring-1 focus-visible:ring-primary/20"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入消息，按下发送开始对话"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
          />
          <div className="flex justify-end">
            <Button disabled={sending || !input.trim()} onClick={send}>
              {sending ? "发送中..." : "发送"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
