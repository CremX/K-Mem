"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, Users, Bell, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { mockTasks } from "@/lib/mock-data"

const navItems = [
  { icon: Home, label: "今日", path: "/" },
  { icon: Users, label: "客户", path: "/contacts" },
  { icon: Bell, label: "待办", path: "/tasks" },
  { icon: User, label: "我的", path: "/profile" },
]

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  // 认证页面不显示底部导航
  if (pathname.startsWith("/auth")) {
    return null
  }

  const pendingCount = mockTasks.filter((t) => !t.isCompleted).length
  const overdueCount = mockTasks.filter((t) => !t.isCompleted && new Date(t.dueDate) < new Date()).length

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path))
          const Icon = item.icon
          const showBadge = item.path === "/tasks" && pendingCount > 0

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={cn(
                "relative flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors touch-active",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <div className="relative">
                <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
                {showBadge && (
                  <span
                    className={cn(
                      "absolute -top-1 -right-2 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white rounded-full px-1",
                      overdueCount > 0 ? "bg-urgent" : "bg-primary",
                    )}
                  >
                    {pendingCount > 99 ? "99+" : pendingCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
