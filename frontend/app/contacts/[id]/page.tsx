"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Phone, MessageCircle, Mail, Calendar, Star, Edit, Plus, Clock, AlertCircle } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { PageHeader } from "@/components/page-header"
import { QuickGlanceCard } from "@/components/quick-glance-card"
import { TaskCard } from "@/components/task-card"
import { QuickRecordModal } from "@/components/quick-record-modal"
import { mockContacts, mockRecords, mockTasks, getDaysSinceLastContact } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function ContactDetailPage() {
  const params = useParams()
  const router = useRouter()
  const contactId = params.id as string

  const contact = mockContacts.find((c) => c.id === contactId)
  const records = mockRecords.filter((r) => r.contactId === contactId)
  const pendingTasks = mockTasks.filter((t) => t.contactId === contactId && !t.isCompleted)
  const lastRecord = records[0]

  const [isFavorite, setIsFavorite] = useState(contact?.isFavorite || false)
  const [showRecordModal, setShowRecordModal] = useState(false)
  const [tasks, setTasks] = useState(mockTasks)

  if (!contact) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">客户不存在</p>
      </div>
    )
  }

  const daysSinceContact = getDaysSinceLastContact(contact.lastContact)
  const needsContact = contact.contactFrequency ? daysSinceContact > contact.contactFrequency : false

  const getLevelConfig = (level: string) => {
    const config = {
      S: { bg: "bg-purple-500", label: "S级客户" },
      A: { bg: "bg-primary", label: "A级客户" },
      B: { bg: "bg-emerald-500", label: "B级客户" },
      C: { bg: "bg-slate-400", label: "C级客户" },
    }
    return config[level as keyof typeof config] || { bg: "bg-gray-400", label: `${level}级客户` }
  }

  const levelConfig = getLevelConfig(contact.level)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleToggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)))
  }

  const handleQuickRecord = (data: any) => {
    console.log("快速记录:", data)
    // 这里会保存记录到后端
  }

  const recordTypeLabels: Record<string, string> = {
    call: "电话",
    meeting: "见面",
    wechat: "微信",
    visit: "拜访",
    other: "其他",
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader
        title="客户详情"
        showBack
        rightContent={
          <button
            onClick={() => router.push(`/contacts/${contactId}/edit`)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <Edit className="w-5 h-5" />
          </button>
        }
      />

      <main className="px-4 py-4 space-y-4">
        {/* 基本信息卡片 */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-medium shrink-0",
                levelConfig.bg,
              )}
            >
              {contact.name.slice(0, 1)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{contact.name}</h2>
                <button onClick={() => setIsFavorite(!isFavorite)} className="p-1">
                  <Star
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isFavorite ? "text-warning fill-warning" : "text-muted-foreground",
                    )}
                  />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn("px-2 py-0.5 text-xs font-medium rounded text-white", levelConfig.bg)}>
                  {levelConfig.label}
                </span>
                {needsContact && contact.contactFrequency && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-urgent/10 text-urgent rounded flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {daysSinceContact - contact.contactFrequency}天未联系
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 快捷操作 */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-border">
            <a
              href={`tel:${contact.phone}`}
              className="flex-1 flex flex-col items-center gap-1 py-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="text-xs">电话</span>
            </a>
            {contact.wechat && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(contact.wechat!)
                  alert(`微信号已复制: ${contact.wechat}`)
                }}
                className="flex-1 flex flex-col items-center gap-1 py-3 bg-success/10 text-success rounded-xl hover:bg-success/20 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs">微信</span>
              </button>
            )}
            <button
              onClick={() => setShowRecordModal(true)}
              className="flex-1 flex flex-col items-center gap-1 py-3 bg-warning/10 text-warning rounded-xl hover:bg-warning/20 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="text-xs">记录</span>
            </button>
          </div>
        </div>

        {/* 速览卡片 */}
        <QuickGlanceCard contact={contact} lastRecord={lastRecord} pendingTasks={pendingTasks} />

        {/* 待办事项 */}
        {pendingTasks.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-warning" />
                待办事项
              </h3>
              <button
                onClick={() => router.push(`/tasks/new?contactId=${contactId}`)}
                className="text-primary text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                添加
              </button>
            </div>
            <div className="space-y-2">
              {pendingTasks.slice(0, 3).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  showContact={false}
                  onToggleComplete={handleToggleTask}
                  onClick={() => router.push(`/tasks/${task.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 联系方式 */}
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          <div className="flex items-center gap-3 p-4">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">电话</p>
              <p className="font-medium">{contact.phone}</p>
            </div>
          </div>
          {contact.wechat && (
            <div className="flex items-center gap-3 p-4">
              <MessageCircle className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">微信</p>
                <p className="font-medium">{contact.wechat}</p>
              </div>
            </div>
          )}
          {contact.email && (
            <div className="flex items-center gap-3 p-4">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">邮箱</p>
                <p className="font-medium">{contact.email}</p>
              </div>
            </div>
          )}
          {contact.birthday && (
            <div className="flex items-center gap-3 p-4">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">生日</p>
                <p className="font-medium">{formatDate(contact.birthday)}</p>
              </div>
            </div>
          )}
        </div>

        {/* 沟通记录 */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">沟通记录</h3>
            <button onClick={() => setShowRecordModal(true)} className="text-primary text-sm flex items-center gap-1">
              <Plus className="w-4 h-4" />
              添加
            </button>
          </div>

          {records.length > 0 ? (
            <div className="space-y-3">
              {records.slice(0, 3).map((record) => (
                <div key={record.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
                      {recordTypeLabels[record.type]}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatDate(record.date)}</span>
                  </div>
                  {record.summary && <p className="text-sm font-medium">{record.summary}</p>}
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{record.content}</p>
                  {record.promises && record.promises.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {record.promises.map((promise, i) => (
                        <span key={i} className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded">
                          承诺: {promise}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {records.length > 3 && (
                <button className="w-full text-center text-sm text-primary py-2">
                  查看全部 {records.length} 条记录
                </button>
              )}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">暂无沟通记录</p>
          )}
        </div>

        {/* 备注 */}
        {contact.notes && (
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="font-semibold mb-2">备注</h3>
            <p className="text-muted-foreground text-sm">{contact.notes}</p>
          </div>
        )}
      </main>

      <BottomNav />

      {/* 快速记录弹窗 */}
      <QuickRecordModal
        isOpen={showRecordModal}
        onClose={() => setShowRecordModal(false)}
        contactId={contactId}
        contactName={contact.name}
        onSubmit={handleQuickRecord}
      />
    </div>
  )
}