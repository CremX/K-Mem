"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Phone, MessageCircle, Mail, Calendar, Star, Edit, Plus, Clock, AlertCircle, Briefcase, MapPin, Users, Heart, AlertTriangle } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { PageHeader } from "@/components/page-header"
import { QuickGlanceCard } from "@/components/quick-glance-card"
import { TaskCard } from "@/components/task-card"
import { QuickRecordModal } from "@/components/quick-record-modal"
import { mockContacts, mockRecords, mockTasks } from "@/lib/mock-data"
import { LEVEL_CONFIG, TASK_TYPES } from "@/lib/constants"
import { cn } from "@/lib/utils"

export default function ContactDetailPage() {
  const params = useParams()
  const router = useRouter()
  const contactId = params.id as string

  const contact = mockContacts.find((c) => c.id === contactId)
  const records = mockRecords.filter((r) => r.contactId === contactId)
  const pendingTasks = mockTasks.filter((t) => t.contactId === contactId && t.status === "pending")
  const lastRecord = records[0]

  const [isFavorite, setIsFavorite] = useState(contact?.isFavorite || false)
  const [showRecordModal, setShowRecordModal] = useState(false)
  const [tasks, setTasks] = useState(mockTasks)

  if (!contact) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">联系人不存在</p>
      </div>
    )
  }

  // 计算是否逾期未联系
  const lastDateStr = contact.lastContactDate || contact.createdAt
  const lastDate = new Date(lastDateStr)
  const today = new Date()
  const daysSinceContact = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
  const frequency = contact.interactionFrequency || 30
  const isOverdue = daysSinceContact > frequency

  const levelConfig = LEVEL_CONFIG[contact.level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG.C

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
    })
  }

  const handleToggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.status } : t)))
  }

  const handleQuickRecord = (data: any) => {
    console.log("快速记录:", data)
    // 这里会保存记录到后端
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader
        title="联系人详情"
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
        {/* 1. 核心身份卡片 (Identity Card) */}
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-medium shrink-0 shadow-inner",
                levelConfig.bgColor,
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
                      isFavorite ? "text-amber-400 fill-amber-400" : "text-muted-foreground",
                    )}
                  />
                </button>
              </div>
              
              {/* 职位与公司 */}
              <div className="mt-1 space-y-0.5">
                <p className="text-base font-medium text-foreground/90 flex items-center gap-1.5">
                   <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                   {contact.title || "未填职位"}
                </p>
                <p className="text-sm text-muted-foreground pl-5">{contact.company || "未填公司"}</p>
              </div>

              {/* 状态徽章 */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={cn("px-2 py-0.5 text-xs font-bold rounded-full text-white shadow-sm", levelConfig.bgColor)}>
                  {levelConfig.label}
                </span>
                {isOverdue && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-red-50 text-red-600 border border-red-100 rounded-full flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {daysSinceContact}天未联系
                  </span>
                )}
                {contact.dealStatus && (
                   <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100 rounded-full">
                     阶段: {contact.dealStatus}
                   </span>
                )}
              </div>
            </div>
          </div>

          {/* 快捷操作栏 */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
            <a
              href={`tel:${contact.phone}`}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 bg-primary/5 text-primary rounded-lg active:bg-primary/10 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="text-xs font-medium">电话</span>
            </a>
            {contact.wechat && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(contact.wechat!)
                  alert(`微信号已复制: ${contact.wechat}`)
                }}
                className="flex-1 flex flex-col items-center gap-1 py-2.5 bg-green-50 text-green-600 rounded-lg active:bg-green-100 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs font-medium">微信</span>
              </button>
            )}
            <button
              onClick={() => setShowRecordModal(true)}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 bg-amber-50 text-amber-600 rounded-lg active:bg-amber-100 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="text-xs font-medium">记一笔</span>
            </button>
          </div>
        </div>

        {/* 2. 作弊小抄 (The Cheat Sheet) - 核心改动点 */}
        <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">破冰 & 禁忌</span>
                <div className="h-px bg-border flex-1" />
            </div>
            
            <div className="grid grid-cols-1 gap-3">
                {/* 抓手 (Hooks) */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3">
                    <div className="flex items-start gap-3">
                        <Heart className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-blue-700 mb-1">关键喜好 (The Hook)</p>
                            <div className="flex flex-wrap gap-1.5">
                                {contact.hobbies?.map(hobby => (
                                    <span key={hobby} className="px-1.5 py-0.5 bg-white text-blue-700 text-xs rounded border border-blue-200">
                                        {hobby}
                                    </span>
                                ))}
                                {!contact.hobbies && <span className="text-xs text-blue-400 italic">暂无爱好记录</span>}
                            </div>
                            {contact.familyInfo && (
                                <p className="text-xs text-blue-600 mt-2 leading-relaxed">
                                    👨‍👩‍👧 {contact.familyInfo}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 禁忌 (Taboos) */}
                {contact.taboos && (
                    <div className="bg-red-50/50 border border-red-100 rounded-xl p-3">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-red-700 mb-1">雷区禁忌</p>
                                <p className="text-xs text-red-600 leading-relaxed">{contact.taboos}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* 3. 待办事项 (Action Items) */}
        {pendingTasks.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-amber-500" />
                待办事项
              </h3>
              <button
                onClick={() => router.push(`/tasks/new?contactId=${contactId}`)}
                className="text-primary text-xs font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
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

        {/* 4. 交互记录 (Interaction Stream) */}
        <div className="bg-card rounded-xl border border-border p-4 min-h-[200px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                交往记录
            </h3>
            <button onClick={() => setShowRecordModal(true)} className="text-primary text-xs font-medium flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              添加
            </button>
          </div>

          {records.length > 0 ? (
            <div className="relative pl-4 space-y-6 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-px before:bg-border">
              {records.slice(0, 5).map((record) => {
                  const typeConfig = TASK_TYPES[record.type as keyof typeof TASK_TYPES] || { label: "记录", color: "text-gray-500" };
                  
                  return (
                    <div key={record.id} className="relative">
                        {/* 时间轴点 */}
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-background border-2 border-primary ring-2 ring-background z-10" />
                        
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground font-medium">{formatDate(record.date)}</span>
                            <span className={cn("text-[10px] px-1.5 py-0.5 rounded bg-muted font-medium", typeConfig.color)}>
                                {typeConfig.label}
                            </span>
                        </div>
                        
                        <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                            {record.participants && (
                                <p className="text-xs text-muted-foreground mb-1">
                                    👥 与 {record.participants} @ {record.location || "未知地点"}
                                </p>
                            )}
                            <p className="text-sm text-foreground/90 leading-relaxed">{record.content}</p>
                            
                            {record.outcome && (
                                <div className="mt-2 pt-2 border-t border-border/50">
                                    <p className="text-xs font-medium text-primary">👉 结论：{record.outcome}</p>
                                </div>
                            )}
                        </div>
                    </div>
                  )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mb-3">
                    <MessageCircle className="w-6 h-6 text-muted-foreground/50" />
                </div>
                <p className="text-sm text-muted-foreground">暂无交往记录</p>
                <p className="text-xs text-muted-foreground/50 mt-1">记录一次饭局或电话，开始积累信任</p>
            </div>
          )}
        </div>

        {/* 底部补充信息 */}
        {contact.notes && (
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="font-semibold mb-2 text-sm">备注</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{contact.notes}</p>
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
