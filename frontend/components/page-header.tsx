"use client"

import type React from "react"
import { ChevronLeft, MoreVertical } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  showBack?: boolean
  showMore?: boolean
  onMore?: () => void
  rightContent?: React.ReactNode
  className?: string
  variant?: "default" | "card" // 保留接口兼容，但不再渲染 Card 样式
}

export function PageHeader({
  title,
  showBack = false,
  showMore = false,
  onMore,
  rightContent,
  className,
  variant = "default", // 默认都使用极简风格
}: PageHeaderProps) {
  const router = useRouter()

  // 极简风格 Header
  // 去掉了所有的背景色、阴影、光效，只保留内容
  return (
    <header
      className={cn(
        "sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/40 safe-area-top transition-colors",
        className
      )}
    >
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3 flex-1">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors text-foreground"
              aria-label="返回"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-lg font-serif font-bold tracking-tight text-foreground truncate">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {rightContent}
          {showMore && (
            <button
              onClick={onMore}
              className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors text-foreground"
              aria-label="更多选项"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
