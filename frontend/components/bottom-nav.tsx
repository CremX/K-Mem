"use client"

import { usePathname, useRouter } from "next/navigation"
import { Compass, Users, Briefcase, User, Plus, Home, LayoutList } from "lucide-react"
import { cn } from "@/lib/utils"
import { mockTasks } from "@/lib/mock-data"
import { useState } from "react"
import { OmniEntryModal } from "@/components/omni-entry-modal"

const navItems = [
  { icon: Home, label: "首页", path: "/" },
  { icon: Users, label: "人脉", path: "/contacts" },
  { icon: LayoutList, label: "任务", path: "/tasks" }, 
  { icon: User, label: "我的", path: "/profile" },
]

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [showOmniEntry, setShowOmniEntry] = useState(false) 

  if (pathname.startsWith("/auth")) {
    return null
  }

  const pendingCount = mockTasks.filter((t) => t.status === 'pending').length
  const overdueCount = mockTasks.filter((t) => t.status === 'pending' && new Date(t.dueDate) < new Date()).length

  return (
    <>
        <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
        {/* FAB 全能录入按钮 */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 pointer-events-auto">
            <button 
                onClick={() => setShowOmniEntry(true)}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent dark:from-primary dark:to-accent shadow-lg shadow-primary/30 dark:shadow-primary/20 flex items-center justify-center transform hover:scale-105 active:scale-95 transition-transform border-4 border-background"
            >
                <Plus className="w-7 h-7 text-white dark:text-primary-foreground" strokeWidth={2.5} />
            </button>
        </div>

        {/* 
            导航栏样式 - 终极稳固版：
            1. bg-background: 100% 不透明，彻底遮挡下方内容
            2. shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)]: 顶部增加柔和阴影，营造悬浮感
            3. border-t: 边界线
        */}
        <nav className="bg-background pb-safe pointer-events-auto border-t border-border shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.03)] dark:shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.5)]">
            <div className="flex justify-around items-end pb-3 pt-3 max-w-lg mx-auto px-4">
                <NavBtn item={navItems[0]} pathname={pathname} router={router} />
                <NavBtn item={navItems[1]} pathname={pathname} router={router} />
                
                {/* 占位空间 - 给FAB留位置 */}
                <div className="w-16" />
                
                <NavBtn item={navItems[2]} pathname={pathname} router={router} showBadge={true} count={pendingCount} isOverdue={overdueCount > 0} />
                <NavBtn item={navItems[3]} pathname={pathname} router={router} />
            </div>
        </nav>
        </div>

        {/* 集成全能录入弹窗 */}
        <OmniEntryModal 
            isOpen={showOmniEntry} 
            onClose={() => setShowOmniEntry(false)} 
        />
    </>
  )
}

function NavBtn({ item, pathname, router, showBadge, count, isOverdue }: any) {
    const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path))
    const Icon = item.icon
    
    return (
        <button
          onClick={() => router.push(item.path)}
          className="relative flex flex-col items-center gap-1 w-1/5 group transition-all active:scale-95"
        >
          <div className="relative">
            <Icon 
                className={cn(
                    "w-6 h-6 transition-all duration-300", 
                    isActive 
                        ? "text-primary dark:text-secondary scale-110" 
                        : "text-muted-foreground group-hover:text-primary dark:group-hover:text-secondary"
                )} 
                strokeWidth={isActive ? 2.5 : 2}
            />
            
            {showBadge && count > 0 && (
                <span className={cn(
                    "absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] flex items-center justify-center text-[9px] font-bold rounded-full px-0.5 border-2 border-background",
                    isOverdue 
                        ? "bg-destructive text-white" 
                        : "bg-secondary text-white dark:text-primary-foreground"
                )}>
                    {count > 99 ? "99" : count}
                </span>
            )}
          </div>
          
          <span className={cn(
            "text-[10px] font-medium transition-colors mt-1", 
            isActive 
                ? "text-primary dark:text-secondary font-bold" 
                : "text-muted-foreground group-hover:text-primary dark:group-hover:text-secondary"
          )}>
            {item.label}
          </span>
        </button>
    )
}
