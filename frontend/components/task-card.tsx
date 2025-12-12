"use client"

import { Check, Phone, Calendar, Cake, MessageSquare, AlertCircle, Repeat, ChevronRight, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task } from "@/lib/mock-data"

interface TaskCardProps {
  task: Task
  onToggleComplete?: (id: string) => void
  onClick?: () => void
  showContact?: boolean
}

const typeConfig = {
  // 服务行业类型
  appointment: { icon: Calendar, label: "预约" },
  care: { icon: Heart, label: "关怀" },
  promise: { icon: AlertCircle, label: "承诺" },
  birthday: { icon: Cake, label: "生日" },
  custom: { icon: Calendar, label: "待办" },
  // 兼容旧类型
  follow_up: { icon: MessageSquare, label: "跟进" },
  meeting: { icon: Calendar, label: "会议" },
  call: { icon: Phone, label: "电话" },
} as const

export function TaskCard({ task, onToggleComplete, onClick, showContact = true }: TaskCardProps) {
  const config = typeConfig[task.type] || typeConfig.custom
  const Icon = config.icon

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
  const isOverdue = !task.isCompleted && dueDate < today
  const isToday = dueDate.getTime() === today.getTime()

  // 根据状态决定左边框颜色
  const getBorderColor = () => {
    if (task.isCompleted) return "border-l-muted-foreground"
    if (isOverdue) return "border-l-urgent"
    if (task.priority === "high" || task.type === "promise") return "border-l-warning"
    if (isToday) return "border-l-primary"
    return "border-l-muted-foreground"
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 bg-card rounded-lg border border-border border-l-[3px] transition-all touch-active",
        getBorderColor(),
        task.isCompleted && "opacity-50",
      )}
    >
      {/* 完成按钮 */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleComplete?.(task.id)
        }}
        className={cn(
          "shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
          task.isCompleted
            ? "bg-success border-success text-success-foreground"
            : isOverdue
              ? "border-urgent hover:bg-urgent/10"
              : "border-muted-foreground/50 hover:border-primary",
        )}
      >
        {task.isCompleted && <Check className="w-3 h-3" />}
      </button>

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn("font-medium text-sm", task.isCompleted && "line-through text-muted-foreground")}>
            {task.title}
          </span>
          {task.type === "promise" && !task.isCompleted && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-warning/10 text-warning rounded">承诺</span>
          )}
          {task.isRepeating && <Repeat className="w-3 h-3 text-muted-foreground" />}
        </div>

        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <span className={cn("flex items-center gap-1", isOverdue && "text-urgent font-medium")}>
            <Icon className="w-3 h-3" />
            {formatDate(task.dueDate)}
            {task.dueTime && !isOverdue && ` ${task.dueTime}`}
          </span>
          {showContact && task.contactName && (
            <>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span>{task.contactName}</span>
            </>
          )}
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
    </div>
  )
}
