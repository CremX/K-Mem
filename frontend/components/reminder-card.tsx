"use client"

import { Check, Circle, Phone, Calendar, Cake, MessageSquare, Flag, Repeat, Heart, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Reminder } from "@/lib/mock-data"

interface ReminderCardProps {
  reminder: Reminder
  onToggleComplete?: (id: string) => void
  onClick?: () => void
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  follow_up: MessageSquare,
  birthday: Cake,
  meeting: Calendar,
  call: Phone,
  custom: Flag,
  appointment: Calendar,
  care: Heart,
  promise: AlertCircle,
}

const priorityColors = {
  high: "border-l-red-500",
  medium: "border-l-yellow-500",
  low: "border-l-green-500",
}

export function ReminderCard({ reminder, onToggleComplete, onClick }: ReminderCardProps) {
  const Icon = typeIcons[reminder.type] || Flag

  const formatDate = (date: string) => {
    const d = new Date(date)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (d.toDateString() === today.toDateString()) {
      return "今天"
    } else if (d.toDateString() === tomorrow.toDateString()) {
      return "明天"
    }
    return `${d.getMonth() + 1}月${d.getDate()}日`
  }

  const isOverdue = !reminder.isCompleted && new Date(reminder.dueDate) < new Date()

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 p-4 bg-card rounded-xl border border-border border-l-4 transition-all cursor-pointer",
        priorityColors[reminder.priority],
        reminder.isCompleted && "opacity-60",
        !reminder.isCompleted && "active:bg-muted/50",
      )}
    >
      {/* 完成按钮 */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleComplete?.(reminder.id)
        }}
        className={cn(
          "mt-0.5 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
          reminder.isCompleted
            ? "bg-primary border-primary text-primary-foreground"
            : "border-muted-foreground hover:border-primary",
        )}
        aria-label={reminder.isCompleted ? "标记为未完成" : "标记为完成"}
      >
        {reminder.isCompleted ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5 opacity-0" />}
      </button>

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn("font-medium", reminder.isCompleted && "line-through text-muted-foreground")}>
            {reminder.title}
          </span>
          {reminder.isRepeating && <Repeat className="w-3.5 h-3.5 text-muted-foreground" />}
        </div>

        {reminder.description && (
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{reminder.description}</p>
        )}

        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <span className={cn("flex items-center gap-1", isOverdue && "text-destructive font-medium")}>
            <Icon className="w-3.5 h-3.5" />
            {formatDate(reminder.dueDate)}
            {reminder.dueTime && ` ${reminder.dueTime}`}
          </span>
          {reminder.contactName && (
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              {reminder.contactName}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
