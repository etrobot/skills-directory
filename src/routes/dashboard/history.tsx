import { createFileRoute, Link } from "@tanstack/react-router"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getHistory } from "@/utils/history"
import { useEffect, useState } from "react"

export const Route = createFileRoute("/dashboard/history")({
  component: HistoryView,
})

function HistoryView() {
  const [list, setList] = useState(getHistory())
  useEffect(() => {
    setList(getHistory())
  }, [])
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">聊天记录</h1>
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">暂无聊天记录</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((s) => (
            <Card key={s.id} className="p-4 space-y-2 border-none shadow-md">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{s.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(s.createdAt).toLocaleString()} · {s.messages.length}
                    条消息
                  </div>
                </div>
                <Link to="/dashboard/chat" search={{ sessionId: s.id }}>
                  <Button variant="secondary">打开</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
