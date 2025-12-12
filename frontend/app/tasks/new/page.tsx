"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Calendar, Clock, User, Flag, AlertCircle, Heart, Cake, FileText, Phone, Briefcase, DollarSign, Utensils, Gift } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { mockContacts } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import type { Task } from "@/lib/mock-data"
import { TASK_TYPES } from "@/lib/constants"

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
  const [taskType, setTaskType] = useState<Task["type"]>(preselectedType || "todo")

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
      status: "pending"
    })

    router.back()
  }

  const canSave = title.trim().length > 0 && dueDate.length > 0

  // 映射 icon 字符串到组件 (与 task-card.tsx 保持一致)
  const iconMap: Record<string, any> = {
      Utensils, Briefcase, Phone, FileText, DollarSign, Gift, Calendar, Heart, AlertCircle, Cake
  }

  // 快捷日期选项
  const quickDates = [
    { label: "今天", value: new Date().toISOString().split("T")[0] },
    { label: "明天", value: new Date(Date.now() + 86400000).toISOString().split("T")[0] },
    { label: "下周一", value: (() => {
        const d = new Date();
        d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7 || 7); // Calculate next Monday
        return d.toISOString().split("T")[0];
    })() },
  ]

  // 根据任务类型自动设置标题提示
  const getTitlePlaceholder = () => {
    switch (taskType) {
      case "social": return "如：请王总吃饭";
      case "meeting": return "如：拜访张经理";
      case "follow_up": return "如：电话回访李总";
      case "proposal": return "如：准备A公司报价方案";
      case "close": return "如：跟进B项目合同流程";
      case "care": return "如：祝陈总生日快乐";
      default: return "要做什么？";
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="新建计划"
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
        {/* 任务类型选择 (Business Type) */}
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm font-medium text-muted-foreground mb-3">行动类型</p>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(TASK_TYPES).map(([key, config]) => {
              const Icon = iconMap[config.icon] || Calendar
              const isSelected = taskType === key
              return (
                <button
                  key={key}
                  onClick={() => setTaskType(key as Task["type"])}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors border",
                    isSelected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-transparent bg-muted/30 text-muted-foreground hover:bg-muted/50",
                  )}
                >
                  <Icon className={cn("w-5 h-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-[10px] font-medium whitespace-nowrap">{config.label.split('/')[0]}</span>
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
            <p className="text-xs text-muted-foreground mt-1">请输入计划内容（必填）</p>
          )}
        </div>

        {/* 描述 */}
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="备注细节（如：带上之前的方案...）"
            rows={3}
            className="w-full px-3 py-3 bg-muted rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* 关联资源 */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">关联人脉</span>
          </div>
          <select
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
            className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">不关联</option>
            {mockContacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name} {contact.company ? `- ${contact.company}` : ''} ({contact.level}级)
              </option>
            ))}
          </select>
          {selectedContact && (
            <div className="mt-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                <p>职位：{selectedContact.title || "未填"}</p>
                <p>爱好：{selectedContact.hobbies?.join("、") || "暂无"}</p>
            </div>
          )}
        </div>

        {/* 截止日期 */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">计划时间</span>
          </div>

          {/* 快捷选项 */}
          <div className="flex gap-2 mb-3">
            {quickDates.map((item) => (
              <button
                key={item.label}
                onClick={() => setDueDate(item.value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs transition-colors border",
                  dueDate === item.value 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-background text-muted-foreground border-border",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
             <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none"
             />
             <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-32 px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none"
             />
          </div>
        </div>

        {/* 优先级 */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Flag className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">重要程度</span>
          </div>
          <div className="flex gap-2">
            {[
              { value: "high", label: "高 (High)", color: "bg-red-100 text-red-700 border-red-200" },
              { value: "medium", label: "中 (Medium)", color: "bg-amber-100 text-amber-700 border-amber-200" },
              { value: "low", label: "低 (Low)", color: "bg-slate-100 text-slate-700 border-slate-200" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setPriority(item.value as typeof priority)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm font-medium transition-colors border",
                  priority === item.value ? item.color : "bg-muted/30 text-muted-foreground border-transparent",
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
