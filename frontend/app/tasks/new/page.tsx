"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Calendar, Clock, User, Flag, AlertCircle, Heart, Cake } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { mockContacts } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import type { Task } from "@/lib/mock-data"

export default function NewTaskPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedContactId = searchParams.get("contactId")
  const preselectedType = searchParams.get("type") as Task["type"] | null

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [contactId, setContactId] = useState(preselectedContactId || "")
  const [dueDate, setDueDate] = useState("")
  const [dueTime, setDueTime] = useState("")
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium")
  const [taskType, setTaskType] = useState<Task["type"]>(preselectedType || "custom")

  const selectedContact = mockContacts.find((c) => c.id === contactId)

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("请输入任务标题")
      return
    }
    if (!dueDate) {
      alert("请选择截止日期")
      return
    }

    // 这里会保存到后端
    console.log({
      title,
      description,
      contactId,
      contactName: selectedContact?.name,
      dueDate,
      dueTime,
      priority,
      type: taskType,
    })

    router.back()
  }

  const canSave = title.trim().length > 0 && dueDate.length > 0

  // 任务类型选项
  const taskTypeOptions: { value: Task["type"]; label: string; icon: React.ElementType; desc: string }[] = [
    { value: "appointment", label: "预约", icon: Calendar, desc: "客人预约服务" },
    { value: "promise", label: "承诺", icon: AlertCircle, desc: "答应客人的事" },
    { value: "care", label: "关怀", icon: Heart, desc: "主动关怀提醒" },
    { value: "birthday", label: "生日", icon: Cake, desc: "客人生日提醒" },
    { value: "custom", label: "其他", icon: Clock, desc: "自定义待办" },
  ]

  // 快捷日期选项
  const quickDates = [
    { label: "今天", value: new Date().toISOString().split("T")[0] },
    { label: "明天", value: new Date(Date.now() + 86400000).toISOString().split("T")[0] },
    { label: "后天", value: new Date(Date.now() + 172800000).toISOString().split("T")[0] },
    { label: "一周后", value: new Date(Date.now() + 604800000).toISOString().split("T")[0] },
  ]

  // 根据任务类型自动设置标题提示
  const getTitlePlaceholder = () => {
    switch (taskType) {
      case "appointment":
        return "如：今日预约：李姐 14:00"
      case "promise":
        return "如：给王总送按摩精油"
      case "care":
        return "如：关怀：询问李姐肩颈情况"
      case "birthday":
        return "如：张哥生日祝福"
      default:
        return "待办事项..."
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="新建待办"
        showBack
        rightContent={
          <button
            onClick={handleSubmit}
            disabled={!canSave}
            className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-colors touch-active",
              canSave
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed",
            )}
          >
            保存
          </button>
        }
      />

      <main className="px-4 py-4 space-y-4 pb-20">
        {/* 任务类型 */}
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm font-medium text-muted-foreground mb-3">任务类型</p>
          <div className="grid grid-cols-3 gap-2">
            {taskTypeOptions.map((option) => {
              const Icon = option.icon
              const isSelected = taskType === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => setTaskType(option.value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-lg transition-colors border-2",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-muted/30 hover:bg-muted/50",
                  )}
                >
                  <Icon className={cn("w-5 h-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-xs", isSelected ? "font-medium text-primary" : "text-muted-foreground")}>
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 标题 */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={getTitlePlaceholder()}
            className="w-full px-0 py-2 text-lg font-medium bg-transparent border-0 border-b-2 border-border focus:border-primary focus:outline-none transition-colors"
            autoFocus
          />
          {!title.trim() && (
            <p className="text-xs text-muted-foreground mt-1">请输入任务标题（必填）</p>
          )}
        </div>

        {/* 描述 */}
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="添加描述（可选）"
            rows={3}
            className="w-full px-3 py-3 bg-muted rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* 关联客人 */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">关联客人</span>
          </div>
          <select
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
            className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">不关联客人</option>
            {mockContacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name} {contact.level && `(${contact.level}级)`}
              </option>
            ))}
          </select>
          {selectedContact && (
            <p className="text-xs text-muted-foreground mt-2">
              已选择：{selectedContact.name} · {selectedContact.servicePreferences?.split("，")[0] || "暂无偏好"}
            </p>
          )}
        </div>

        {/* 截止日期 */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">截止日期</span>
          </div>

          {/* 快捷选项 */}
          <div className="flex gap-2 mb-3">
            {quickDates.map((item) => (
              <button
                key={item.label}
                onClick={() => setDueDate(item.value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm transition-colors",
                  dueDate === item.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {!dueDate && (
            <p className="text-xs text-muted-foreground mt-2">请选择截止日期（必填）</p>
          )}
        </div>

        {/* 截止时间（可选） */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {taskType === "appointment" ? "服务时间" : "提醒时间"}（可选）
            </span>
          </div>
          <input
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {taskType === "appointment" && (
            <p className="text-xs text-muted-foreground mt-2">设置预约的具体服务时间</p>
          )}
        </div>

        {/* 优先级 */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Flag className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">优先级</span>
          </div>
          <div className="flex gap-2">
            {[
              { value: "high", label: "高", color: "bg-urgent text-urgent-foreground" },
              { value: "medium", label: "中", color: "bg-warning text-warning-foreground" },
              { value: "low", label: "低", color: "bg-muted text-muted-foreground" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setPriority(item.value as typeof priority)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
                  priority === item.value ? item.color : "bg-muted/50 text-muted-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
