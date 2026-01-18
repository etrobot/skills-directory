import { createFileRoute, Link } from "@tanstack/react-router"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { presetPrompts } from "@/data/prompts"
import { isFavorite, toggleFavorite } from "@/utils/favorites"
import { Bookmark, BookmarkCheck, MessageSquare } from "lucide-react"
import { useEffect, useState } from "react"

export const Route = createFileRoute("/dashboard/prompts")({
  component: PromptsSquare,
})

function PromptsSquare() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    setFavorites(JSON.parse(localStorage.getItem("prompt_favorites") || "[]"))
  }, [])

  const handleToggle = (id: string) => {
    const arr = toggleFavorite(id)
    setFavorites(arr)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">预设提示词广场</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {presetPrompts.map((p) => {
          const fav = favorites.includes(p.id)
          return (
            <Card key={p.id} className="p-4 flex flex-col h-full border-none shadow-md gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base font-medium line-clamp-1">{p.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 min-h-[2.5em]">
                    {p.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggle(p.id)}
                  aria-label={fav ? "取消收藏" : "收藏"}
                >
                  {fav ? (
                    <BookmarkCheck className="size-4 text-primary" />
                  ) : (
                    <Bookmark className="size-4" />
                  )}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {p.tags?.map((t) => (
                  <Badge key={t} variant="secondary" className="bg-secondary/50 font-normal">
                    {t}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 justify-end mt-auto pt-2">
                <Link
                  to="/dashboard/chat"
                  search={{ promptId: p.id }}
                >
                  <Button className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 shadow-none px-6" variant="ghost">
                    <MessageSquare className="size-4 mr-1" />
                    使用
                  </Button>
                </Link>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
