import { createFileRoute, Link } from "@tanstack/react-router"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { presetPrompts } from "@/data/prompts"
import { getFavorites, toggleFavorite } from "@/utils/favorites"
import { BookmarkMinus, MessageSquare } from "lucide-react"
import { useEffect, useState } from "react"

export const Route = createFileRoute("/dashboard/favorites")({
  component: FavoritesView,
})

function FavoritesView() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    setFavorites(getFavorites())
  }, [])

  const handleRemove = (id: string) => {
    const arr = toggleFavorite(id)
    setFavorites(arr)
  }

  const items = presetPrompts.filter((p) => favorites.includes(p.id))

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">收藏</h1>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">暂无收藏</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <Card key={p.id} className="p-4 space-y-3 border-none shadow-md">
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
                  onClick={() => handleRemove(p.id)}
                  aria-label="取消收藏"
                >
                  <BookmarkMinus className="size-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {p.tags?.map((t) => (
                  <Badge key={t} variant="secondary" className="bg-secondary/50 font-normal">
                    {t}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-end mt-auto pt-2">
                <Link to="/dashboard/chat" search={{ promptId: p.id }}>
                  <Button className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 shadow-none px-6" variant="ghost">
                    <MessageSquare className="size-4 mr-1" />
                    使用
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
