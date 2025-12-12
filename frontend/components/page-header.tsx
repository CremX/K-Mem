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
}

export function PageHeader({
  title,
  showBack = false,
  showMore = false,
  onMore,
  rightContent,
  className,
}: PageHeaderProps) {
  const router = useRouter()

  return (
    <header
      className={cn("sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-border safe-area-top", className)}
    >
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2 flex-1">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full hover:bg-muted active:bg-muted/80 transition-colors"
              aria-label="返回"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-lg font-semibold truncate">{title}</h1>
        </div>

        <div className="flex items-center gap-1">
          {rightContent}
          {showMore && (
            <button
              onClick={onMore}
              className="p-2 rounded-full hover:bg-muted active:bg-muted/80 transition-colors"
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
