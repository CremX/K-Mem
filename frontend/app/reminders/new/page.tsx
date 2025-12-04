"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, Calendar, Clock, User, Repeat, Flag } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { mockContacts } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type ReminderType = "follow_up" | "birthday" | "meeting" | "call" | "custom"
type Priority = "high" | "medium" | "low"
type RepeatPattern = "daily" | "weekly" | "monthly" | "yearly" | "none"

const typeOptions = [
  { value: "follow_up", label: "跟进" },
  { value: "call", label: "电话" },
  { value: "meeting", label: "会议" },
  { value: "birthday", label: "生日" },
  { value: "custom", label: "自定义" },
]

const priorityOptions = [
  { value: "high", label: "高", color: "bg-red-500" },
  { value: "medium", label: "中", color: "bg-yellow-500" },
  { value: "low", label: "低", color: "bg-green-500" },
]

const repeatOptions = [
  { value: "none", label: "不重复" },
  { value: "daily", label: "每天" },
  { value: "weekly", label: "每周" },
  { value: "monthly", label: "每月" },
  { value: "yearly", label: "每年" },
]

export default function NewReminderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedContactId = searchParams.get("contactId")

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<ReminderType>("follow_up")
  const [priority, setPriority] = useState<Priority>("medium")
  const [dueDate, setDueDate] = useState("")
  const [dueTime, setDueTime] = useState("")
  const [contactId, setContactId] = useState(preselectedContactId || "")
  const [repeatPattern, setRepeatPattern] = useState<RepeatPattern>("none")

  const selectedContact = mockContacts.find((c) => c.id === contactId)

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("请输入提醒标题")
      return
    }
    if (!dueDate) {
      alert("请选择提醒日期")
      return
    }

    // 这里实际应该调用 API 保存数据
    console.log("提交提醒:", {
      title,
      description,
      type,
      priority,
      dueDate,
      dueTime,
      contactId: contactId || undefined,
      isRepeating: repeatPattern !== "none",
      repeatPattern: repeatPattern !== "none" ? repeatPattern : undefined,
    })
    router.back()
  }

  return (
    <div className="min-h-screen bg-background pb-safe">
      <PageHeader
        title="新建提醒"
        showBack
        rightContent={
          <button onClick={handleSubmit} className="p-2 rounded-full hover:bg-muted transition-colors text-primary">
            <Check className="w-5 h-5" />
          </button>
        }
      />

      <main className="px-4 py-4 space-y-6">
        {/* 标题 */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            标题 <span className="text-destructive">*</span>
          </h3>
          <div className="bg-card rounded-xl border border-border p-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入提醒标题..."
              className="w-full bg-transparent text-foreground focus:outline-none text-lg"
            />
          </div>
        </section>

        {/* 类型 */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">类型</h3>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {typeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setType(option.value as ReminderType)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors",
                  type === option.value ? "bg-primary text-primary-foreground" : "bg-card border border-border",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        {/* 日期时间 */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            日期与时间 <span className="text-destructive">*</span>
          </h3>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            <div className="flex items-center gap-3 p-4">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <label className="text-sm text-muted-foreground">日期</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-transparent text-foreground focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <label className="text-sm text-muted-foreground">时间（可选）</label>
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="w-full bg-transparent text-foreground focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 优先级 */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Flag className="w-4 h-4" />
            优先级
          </h3>
          <div className="flex gap-2">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setPriority(option.value as Priority)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  priority === option.value ? "bg-primary text-primary-foreground" : "bg-card border border-border",
                )}
              >
                <span className={cn("w-2 h-2 rounded-full", option.color)} />
                {option.label}
              </button>
            ))}
          </div>
        </section>

        {/* 关联联系人 */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            关联联系人
          </h3>
          <div className="bg-card rounded-xl border border-border p-4">
            <select
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              className="w-full bg-transparent text-foreground focus:outline-none"
            >
              <option value="">不关联联系人</option>
              {mockContacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.name}
                  {contact.company && ` - ${contact.company}`}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* 重复 */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Repeat className="w-4 h-4" />
            重复
          </h3>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {repeatOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setRepeatPattern(option.value as RepeatPattern)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors",
                  repeatPattern === option.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        {/* 描述 */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">描述</h3>
          <div className="bg-card rounded-xl border border-border p-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="添加详细描述..."
              rows={4}
              className="w-full bg-transparent text-foreground focus:outline-none resize-none"
            />
          </div>
        </section>
      </main>
    </div>
  )
}
