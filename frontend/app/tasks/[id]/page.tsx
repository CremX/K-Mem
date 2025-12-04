"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Phone,
  MessageCircle,
  Check,
  Calendar,
  AlertTriangle,
  Clock,
  User,
  Heart,
  AlertCircle,
  Cake,
  ChevronRight,
  X,
} from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { PageHeader } from "@/components/page-header"
import { mockTasks, mockContacts, mockRecords, type Task } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { getLevelConfig } from "@/lib/level-config"

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string

  const [task, setTask] = useState<Task | undefined>(mockTasks.find((t) => t.id === taskId))
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [newDueDate, setNewDueDate] = useState("")
  const [newDueTime, setNewDueTime] = useState("")

  if (!task) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">任务不存在</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm"
          >
            返回
          </button>
        </div>
      </div>
    )
  }

  const contact = task.contactId ? mockContacts.find((c) => c.id === task.contactId) : null
  const lastRecord = contact ? mockRecords.find((r) => r.contactId === contact.id) : null

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(task.dueDate)
  dueDate.setHours(0, 0, 0, 0)
  const isOverdue = !task.isCompleted && dueDate < today
  const isToday = dueDate.getTime() === today.getTime()

  const handleComplete = () => {
    setTask((prev) => {
      if (!prev) return prev
      return { ...prev, isCompleted: true, completedAt: new Date().toISOString() }
    })
    // TODO: 对接接口保存
    router.back()
  }

  const handleReschedule = () => {
    if (!newDueDate) return
    setTask((prev) => {
      if (!prev) return prev
      return { ...prev, dueDate: newDueDate, dueTime: newDueTime || prev.dueTime }
    })
    setShowRescheduleModal(false)
    // TODO: 对接接口保存
  }

  const getTaskTypeInfo = () => {
    const config = {
      appointment: { icon: Calendar, label: "预约", color: "text-primary" },
      promise: { icon: AlertCircle, label: "承诺", color: "text-warning" },
      care: { icon: Heart, label: "关怀", color: "text-red-500" },
      birthday: { icon: Cake, label: "生日", color: "text-pink-500" },
      custom: { icon: Clock, label: "待办", color: "text-muted-foreground" },
    }
    return config[task.type] || config.custom
  }

  const taskTypeInfo = getTaskTypeInfo()
  const TypeIcon = taskTypeInfo.icon

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="任务详情" showBack />

      <main className="px-4 py-4 space-y-4">
        {/* 逾期提醒 */}
        {isOverdue && !task.isCompleted && (
          <div className="bg-urgent/10 border border-urgent rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-urgent shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-urgent mb-1">任务已逾期</p>
                <p className="text-sm text-urgent/80">
                  这个任务已经超过截止日期，请尽快处理。如果已完成，请标记为完成；如果还需要时间，可以重新安排。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 任务基本信息 */}
        <section className="bg-card rounded-xl border border-border p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                isOverdue ? "bg-urgent/10" : "bg-primary/10",
              )}
            >
              <TypeIcon className={cn("w-5 h-5", isOverdue ? "text-urgent" : taskTypeInfo.color)} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{task.title}</span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium",
                    taskTypeInfo.color === "text-warning" && "bg-warning/10 text-warning",
                    taskTypeInfo.color === "text-red-500" && "bg-red-500/10 text-red-500",
                    taskTypeInfo.color === "text-pink-500" && "bg-pink-500/10 text-pink-500",
                    taskTypeInfo.color === "text-primary" && "bg-primary/10 text-primary",
                  )}
                >
                  {taskTypeInfo.label}
                </span>
              </div>
              {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">截止时间：</span>
              <span className={cn("font-medium", isOverdue && "text-urgent")}>
                {new Date(task.dueDate).toLocaleDateString("zh-CN", {
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                })}
                {task.dueTime && ` ${task.dueTime}`}
              </span>
            </div>
            {task.contactName && (
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">相关客人：</span>
                <button
                  onClick={() => router.push(`/contacts/${task.contactId}`)}
                  className="text-primary font-medium flex items-center gap-1"
                >
                  {task.contactName}
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 客户服务前速览（如果有相关客户） */}
        {contact && (
          <section className="bg-card rounded-xl border border-border p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-primary" />
              <h3 className="font-semibold">客人信息速览</h3>
              <button
                onClick={() => router.push(`/contacts/${contact.id}`)}
                className="ml-auto text-xs text-primary flex items-center gap-1"
              >
                查看详情 <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* 客户基本信息 */}
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-lg",
                  getLevelConfig(contact.level as "S" | "A" | "B" | "C").bgColor,
                )}
              >
                {contact.name.slice(0, 1)}
              </div>
              <div className="flex-1">
                <p className="font-medium">{contact.name}</p>
                <p className="text-xs text-muted-foreground">
                  {getLevelConfig(contact.level as "S" | "A" | "B" | "C").name} ·{" "}
                  {contact.servicePreferences?.split("，")[0] || "暂无偏好"}
                </p>
              </div>
            </div>

            {/* 服务偏好和禁忌 */}
            <div className="space-y-2">
              {contact.servicePreferences && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">服务偏好</p>
                  <p className="text-sm">{contact.servicePreferences}</p>
                </div>
              )}
              {contact.taboos && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-urgent" />
                    禁忌/注意事项
                  </p>
                  <p className="text-sm text-urgent">{contact.taboos}</p>
                </div>
              )}
              {contact.lastService && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">上次服务</p>
                  <p className="text-sm">
                    {new Date(contact.lastService).toLocaleDateString("zh-CN")}
                    {contact.lastServiceProject && ` · ${contact.lastServiceProject}`}
                  </p>
                </div>
              )}
              {lastRecord?.importantInfo && lastRecord.importantInfo.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">重要信息</p>
                  <ul className="space-y-1">
                    {lastRecord.importantInfo.map((info, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span>{info}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 快捷联系 */}
            <div className="flex gap-2 pt-2 border-t border-border">
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm"
                >
                  <Phone className="w-4 h-4" />
                  打电话
                </a>
              )}
              {contact.wechat && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(contact.wechat!)
                    alert(`微信号已复制: ${contact.wechat}`)
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-success/10 text-success font-medium text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  微信
                </button>
              )}
            </div>
          </section>
        )}

        {/* 快速操作 */}
        {!task.isCompleted && (
          <section className="space-y-2">
            <button
              onClick={handleComplete}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-success text-success-foreground font-medium"
            >
              <Check className="w-5 h-5" />
              标记为已完成
            </button>
            <button
              onClick={() => setShowRescheduleModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-card font-medium"
            >
              <Calendar className="w-5 h-5" />
              重新安排时间
            </button>
          </section>
        )}

        {task.isCompleted && (
          <div className="bg-success/10 border border-success rounded-xl p-4 text-center">
            <Check className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="font-medium text-success">任务已完成</p>
            {task.completedAt && (
              <p className="text-xs text-success/80 mt-1">
                完成时间：{new Date(task.completedAt).toLocaleString("zh-CN")}
              </p>
            )}
          </div>
        )}
      </main>

      {/* 重新安排时间弹窗 */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="w-full bg-background rounded-t-2xl p-4 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">重新安排时间</h3>
              <button onClick={() => setShowRescheduleModal(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">日期</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full p-3 rounded-lg border border-border bg-card"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">时间（选填）</label>
                <input
                  type="time"
                  value={newDueTime}
                  onChange={(e) => setNewDueTime(e.target.value)}
                  className="w-full p-3 rounded-lg border border-border bg-card"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowRescheduleModal(false)}
                  className="flex-1 py-2 rounded-lg border border-border"
                >
                  取消
                </button>
                <button
                  onClick={handleReschedule}
                  disabled={!newDueDate}
                  className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}

