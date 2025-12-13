"use client"

import { Calendar, Check, Clock, MoreHorizontal, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task } from "@/lib/mock-data"
import { TASK_TYPES } from "@/lib/constants"
import { SealCheckbox } from "@/components/seal-checkbox"
import { useState } from "react"

interface TaskCardProps {
  task: Task
  onToggleComplete?: (id: string) => void
  onClick?: () => void
  showContact?: boolean
  className?: string // 支持外部传入 className
}

export function TaskCard({ task, onToggleComplete, onClick, showContact = true, className }: TaskCardProps) {
  const [isSwiped, setIsSwiped] = useState(false) // 模拟左滑状态
  
  const typeConfig = TASK_TYPES[task.type as keyof typeof TASK_TYPES] || { label: "待办", icon: "Check", color: "text-slate-400" }
  
  const formatDate = (date: string) => {
    const d = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const targetDate = new Date(d)
    targetDate.setHours(0, 0, 0, 0)

    if (targetDate.getTime() === today.getTime()) {
      return "今天"
    } else if (targetDate.getTime() === tomorrow.getTime()) {
      return "明天"
    } else if (targetDate < today) {
      const days = Math.floor((today.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24))
      return `逾期${days}天`
    }
    return `${d.getMonth() + 1}/${d.getDate()}`
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(task.dueDate)
  dueDate.setHours(0, 0, 0, 0)
  
  const isOverdue = task.status !== 'completed' && dueDate < today
  const isToday = dueDate.getTime() === today.getTime()
  const isCompleted = task.status === 'completed'
  const isHighPriority = task.priority === "high"

  // 状态颜色逻辑
  const getStatusStyle = () => {
      if (isCompleted) return "bg-card/50 border-border"
      if (isOverdue) return "bg-card border-l-4 border-l-destructive border-y-border border-r-border" // 逾期左侧红边
      if (isHighPriority) return "bg-card border-l-4 border-l-secondary border-y-border border-r-border shadow-gold" // 高优左侧金边
      return "bg-card border border-border" 
  }

  return (
    <div className={cn("relative group overflow-hidden rounded-[20px] transition-all", className)}>
        {/* 背景操作层 (左滑露出) */}
        <div className="absolute inset-0 flex flex-row-reverse bg-muted/20">
            <div className="h-full w-16 bg-destructive text-white flex flex-col items-center justify-center text-[10px] font-bold cursor-pointer hover:bg-destructive/90 transition-colors">
                <span>删除</span>
            </div>
            <div className="h-full w-16 bg-orange-400 text-white flex flex-col items-center justify-center text-[10px] font-bold cursor-pointer hover:bg-orange-500 transition-colors">
                <span>推迟</span>
            </div>
            <div className="h-full w-16 bg-blue-500 text-white flex flex-col items-center justify-center text-[10px] font-bold cursor-pointer hover:bg-blue-600 transition-colors">
                <span>委派</span>
            </div>
        </div>

        {/* 前景卡片层 */}
        <div
            onClick={onClick}
            className={cn(
                "relative flex items-center gap-4 p-4 transition-transform duration-300 ease-out cursor-pointer bg-card",
                getStatusStyle(),
                "shadow-soft hover:shadow-elevated active:scale-[0.99]",
                isCompleted && "opacity-60 grayscale",
                isSwiped ? "-translate-x-48" : "translate-x-0" // 模拟滑动位移
            )}
        >
            {/* 复选框区域 */}
            <div onClick={(e) => e.stopPropagation()} className="shrink-0 pl-1">
                <SealCheckbox 
                    checked={isCompleted} 
                    onCheckedChange={(checked) => onToggleComplete?.(task.id)}
                />
            </div>

            {/* 主要信息 */}
            <div className="flex-1 min-w-0 ml-1">
                <div className="flex items-center gap-2 mb-1.5">
                    <span className={cn(
                        "font-bold text-[15px] truncate transition-colors", 
                        isCompleted 
                        ? "text-muted-foreground line-through decoration-muted-foreground" 
                        : "text-foreground group-hover:text-primary dark:group-hover:text-secondary"
                    )}>
                        {task.title}
                    </span>
                    
                    {/* 标签 */}
                    {!isCompleted && (
                        <span className={cn(
                            "px-2 py-0.5 text-[10px] font-medium rounded-full border shrink-0 flex items-center gap-1",
                            "bg-muted/50 border-border text-muted-foreground"
                        )}>
                            {typeConfig.label}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className={cn(
                        "flex items-center gap-1 font-sans font-medium", 
                        isOverdue 
                            ? "text-destructive" 
                            : (isToday ? "text-secondary" : "")
                    )}>
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(task.dueDate)}
                        {task.dueTime && !isOverdue && !isCompleted && (
                            <span className="flex items-center gap-0.5 ml-1 opacity-80 border-l border-border pl-2">
                                <Clock className="w-3 h-3" /> {task.dueTime}
                            </span>
                        )}
                    </span>
                    
                    {showContact && task.contactName && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/30 border border-border/50 max-w-[120px]">
                            <User className="w-3 h-3 text-muted-foreground/70" />
                            <span className="truncate text-foreground/80">
                                {task.contactName}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* 操作触发器 (模拟 Swipe) */}
            <button 
                onClick={(e) => {
                    e.stopPropagation()
                    setIsSwiped(!isSwiped)
                }}
                className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors active:scale-90"
            >
                <MoreHorizontal className="w-5 h-5" />
            </button>
        </div>
    </div>
  )
}
