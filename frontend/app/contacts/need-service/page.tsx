"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, Phone, MessageCircle, Heart, ChevronRight, Clock, Check, RefreshCw } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { PageHeader } from "@/components/page-header"
import { mockContacts, getDaysSinceLastContact } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { LEVEL_CONFIG } from "@/lib/constants"

type SortBy = "days" | "level" | "name"

export default function NeedMaintenancePage() {
  const router = useRouter()
  const [sortBy, setSortBy] = useState<SortBy>("days")

  // 筛选需维护的联系人 (超过建议频率未联系)
  const maintenanceContacts = useMemo(() => {
    return mockContacts
      .filter((c) => {
        const lastDateStr = c.lastContactDate || c.createdAt
        const freq = c.interactionFrequency || 30
        const days = getDaysSinceLastContact(lastDateStr)
        return days > freq
      })
      .map((c) => {
        const lastDateStr = c.lastContactDate || c.createdAt
        const freq = c.interactionFrequency || 30
        const days = getDaysSinceLastContact(lastDateStr)
        const overdueDays = days - freq
        return { ...c, overdueDays, daysSinceContact: days }
      })
  }, [])

  // 排序
  const sortedContacts = useMemo(() => {
    const sorted = [...maintenanceContacts]
    switch (sortBy) {
      case "days":
        sorted.sort((a, b) => b.overdueDays - a.overdueDays) // 超期越多越靠前
        break
      case "level":
        const levelOrder = { S: 0, A: 1, B: 2, C: 3, D: 4 }
        sorted.sort((a, b) => {
          const orderA = levelOrder[a.level as keyof typeof levelOrder] ?? 3
          const orderB = levelOrder[b.level as keyof typeof levelOrder] ?? 3
          if (orderA !== orderB) return orderA - orderB
          return b.overdueDays - a.overdueDays
        })
        break
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name, "zh-CN"))
        break
    }
    return sorted
  }, [maintenanceContacts, sortBy])

  // 按等级统计
  const stats = useMemo(() => {
    const levelStats = {
      S: { count: 0, totalDays: 0 },
      A: { count: 0, totalDays: 0 },
      B: { count: 0, totalDays: 0 },
      C: { count: 0, totalDays: 0 },
    }
    maintenanceContacts.forEach((c) => {
      const level = c.level as keyof typeof levelStats
      if (levelStats[level]) {
        levelStats[level].count++
        levelStats[level].totalDays += c.overdueDays
      }
    })
    return levelStats
  }, [maintenanceContacts])

  const handleQuickCare = (contactId: string) => {
    // 快速创建关怀提醒
    router.push(`/tasks/new?contactId=${contactId}&type=follow_up`)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="需维护人脉" showBack />

      <main className="px-4 py-4 space-y-4">
        {/* 说明卡片 */}
        <section className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">关系需要经营</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                这些人脉已经超过了您设定的维护周期。建议优先联系 S/A 级关键人物，保持关系热度。
              </p>
            </div>
          </div>
        </section>

        {/* 统计概览 */}
        {maintenanceContacts.length > 0 && (
          <section className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium">逾期概览</p>
              <span className="text-xs text-muted-foreground">共 {maintenanceContacts.length} 位</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(stats).map(([level, stat]) => {
                if (stat.count === 0) return null
                const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG]
                const avgDays = Math.round(stat.totalDays / stat.count)
                return (
                  <div key={level} className="text-center">
                    <p className={cn("text-lg font-bold", config.textColor)}>{stat.count}</p>
                    <p className="text-xs text-muted-foreground">{config.label.split('/')[0]}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">平均逾期{avgDays}天</p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* 排序选项 */}
        {sortedContacts.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">排序方式</span>
            </div>
            <div className="flex gap-2">
              {[
                { value: "days" as SortBy, label: "逾期天数" },
                { value: "level" as SortBy, label: "重要等级" },
                { value: "name" as SortBy, label: "姓名" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    sortBy === option.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 客人列表 */}
        {sortedContacts.length > 0 ? (
          <section className="space-y-3">
            {sortedContacts.map((contact) => {
              const config = LEVEL_CONFIG[contact.level as keyof typeof LEVEL_CONFIG]
              const lastDateStr = contact.lastContactDate || contact.createdAt
              const freq = contact.interactionFrequency || 30

              return (
                <div key={contact.id} className="bg-card rounded-xl border border-border overflow-hidden">
                  {/* 客人信息卡片 */}
                  <div
                    onClick={() => router.push(`/contacts/${contact.id}`)}
                    className="p-4 touch-active"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-lg",
                          config.bgColor,
                        )}
                      >
                        {contact.name.slice(0, 1)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{contact.name}</p>
                          <span className={cn("text-xs px-1.5 py-0.5 rounded text-white", config.bgColor)}>
                            {contact.level}级
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {contact.company || contact.title || "暂无职位信息"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-red-500">{contact.overdueDays}天</p>
                        <p className="text-xs text-muted-foreground">逾期</p>
                      </div>
                    </div>

                    {/* 服务信息 */}
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            <span>上次联系：{new Date(lastDateStr).toLocaleDateString("zh-CN")}</span>
                            <span className="text-red-500">（{contact.daysSinceContact}天前）</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>建议频率：每{freq}天</span>
                        </div>
                    </div>
                  </div>

                  {/* 快捷操作 */}
                  <div className="border-t border-border p-3 flex gap-2">
                    {contact.phone && (
                      <a
                        href={`tel:${contact.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm"
                      >
                        <Phone className="w-4 h-4" />
                        电话
                      </a>
                    )}
                    {contact.wechat && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigator.clipboard.writeText(contact.wechat!)
                          alert(`微信号已复制: ${contact.wechat}`)
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-green-50 text-green-600 font-medium text-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        微信
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleQuickCare(contact.id)
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-amber-50 text-amber-600 font-medium text-sm"
                    >
                      <Heart className="w-4 h-4" />
                      跟进
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/contacts/${contact.id}`)
                      }}
                      className="px-3 py-2 rounded-lg border border-border"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </section>
        ) : (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8" />
            </div>
            <p className="text-muted-foreground mb-2">太棒了！</p>
            <p className="text-sm text-muted-foreground">所有人脉都在维护周期内</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
