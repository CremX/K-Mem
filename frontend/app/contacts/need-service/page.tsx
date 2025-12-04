"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, Phone, MessageCircle, Heart, ChevronRight, User, Clock, Check } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { PageHeader } from "@/components/page-header"
import { ContactCard } from "@/components/contact-card"
import { mockContacts, getDaysSinceLastContact } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { getLevelConfig } from "@/lib/level-config"

type SortBy = "days" | "level" | "name"

export default function NeedServicePage() {
  const router = useRouter()
  const [sortBy, setSortBy] = useState<SortBy>("days")

  // 筛选长时间未到店的客人
  const needServiceContacts = useMemo(() => {
    return mockContacts
      .filter((c) => {
        const lastService = c.lastService || c.lastContact
        const frequency = c.serviceFrequency || c.contactFrequency || 30
        if (!lastService) return true // 从未服务过的也算
        const days = getDaysSinceLastContact(lastService)
        return days > frequency
      })
      .map((c) => {
        const lastService = c.lastService || c.lastContact
        const frequency = c.serviceFrequency || c.contactFrequency || 30
        const days = lastService ? getDaysSinceLastContact(lastService) : 999
        const overdueDays = days - frequency
        return { ...c, overdueDays, daysSinceService: days }
      })
  }, [])

  // 排序
  const sortedContacts = useMemo(() => {
    const sorted = [...needServiceContacts]
    switch (sortBy) {
      case "days":
        sorted.sort((a, b) => b.overdueDays - a.overdueDays) // 超期越多越靠前
        break
      case "level":
        const levelOrder = { S: 0, A: 1, B: 2, C: 3 }
        sorted.sort((a, b) => {
          const orderA = levelOrder[a.level] ?? 3
          const orderB = levelOrder[b.level] ?? 3
          if (orderA !== orderB) return orderA - orderB
          return b.overdueDays - a.overdueDays
        })
        break
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name, "zh-CN"))
        break
    }
    return sorted
  }, [needServiceContacts, sortBy])

  // 按等级统计
  const stats = useMemo(() => {
    const levelStats = {
      S: { count: 0, totalDays: 0 },
      A: { count: 0, totalDays: 0 },
      B: { count: 0, totalDays: 0 },
      C: { count: 0, totalDays: 0 },
    }
    needServiceContacts.forEach((c) => {
      const level = c.level as keyof typeof levelStats
      if (levelStats[level]) {
        levelStats[level].count++
        levelStats[level].totalDays += c.overdueDays
      }
    })
    return levelStats
  }, [needServiceContacts])

  const handleQuickCare = (contactId: string) => {
    // 快速创建关怀提醒
    const contact = mockContacts.find((c) => c.id === contactId)
    if (contact) {
      router.push(`/tasks/new?contactId=${contactId}`)
      // 注意：需要在 tasks/new 页面中根据 URL 参数自动设置类型
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="长时间未到店" showBack />

      <main className="px-4 py-4 space-y-4">
        {/* 说明卡片 */}
        <section className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-warning/10 text-warning flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">主动关怀，提升回头率</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                这些客人已经超过建议服务频率未到店了。主动关怀可以提升客户满意度，增加回头率。建议优先联系高等级客人。
              </p>
            </div>
          </div>
        </section>

        {/* 统计概览 */}
        {needServiceContacts.length > 0 && (
          <section className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium">统计概览</p>
              <span className="text-xs text-muted-foreground">共 {needServiceContacts.length} 位客人</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(stats).map(([level, stat]) => {
                if (stat.count === 0) return null
                const config = getLevelConfig(level as "S" | "A" | "B" | "C")
                const avgDays = Math.round(stat.totalDays / stat.count)
                return (
                  <div key={level} className="text-center">
                    <p className={cn("text-lg font-bold", config.textColor)}>{stat.count}</p>
                    <p className="text-xs text-muted-foreground">{config.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">平均超期{avgDays}天</p>
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
                { value: "days" as SortBy, label: "超期天数" },
                { value: "level" as SortBy, label: "客人等级" },
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
              const config = getLevelConfig(contact.level as "S" | "A" | "B" | "C")
              const lastService = contact.lastService || contact.lastContact
              const frequency = contact.serviceFrequency || contact.contactFrequency || 30

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
                          <span className={cn("text-xs px-1.5 py-0.5 rounded", config.bgColor, "text-white")}>
                            {contact.level}级
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {contact.servicePreferences?.split("，")[0] || "暂无偏好"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-urgent">{contact.overdueDays}天</p>
                        <p className="text-xs text-muted-foreground">超期</p>
                      </div>
                    </div>

                    {/* 服务信息 */}
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      {lastService ? (
                        <>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            <span>上次服务：{new Date(lastService).toLocaleDateString("zh-CN")}</span>
                            <span className="text-urgent">（{contact.daysSinceService}天前）</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>建议频率：每{frequency}天</span>
                            <span className="text-urgent">已超期{contact.overdueDays}天</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-urgent" />
                          <span className="text-urgent">从未服务过</span>
                        </div>
                      )}
                      {contact.lastServiceProject && (
                        <div className="flex items-center gap-2">
                          <span>上次项目：{contact.lastServiceProject}</span>
                        </div>
                      )}
                    </div>

                    {/* 服务偏好和禁忌提示 */}
                    {contact.taboos && (
                      <div className="mt-2 p-2 bg-urgent/5 rounded-lg border border-urgent/20">
                        <p className="text-xs text-urgent flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          禁忌：{contact.taboos}
                        </p>
                      </div>
                    )}
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
                        打电话
                      </a>
                    )}
                    {contact.wechat && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigator.clipboard.writeText(contact.wechat!)
                          alert(`微信号已复制: ${contact.wechat}`)
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-success/10 text-success font-medium text-sm"
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
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-warning/10 text-warning font-medium text-sm"
                    >
                      <Heart className="w-4 h-4" />
                      关怀
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
            <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8" />
            </div>
            <p className="text-muted-foreground mb-2">太好了！</p>
            <p className="text-sm text-muted-foreground">目前没有长时间未到店的客人</p>
          </div>
        )}

        {/* 使用提示 */}
        {sortedContacts.length > 0 && (
          <section className="bg-card rounded-xl border border-border p-4 text-xs text-muted-foreground space-y-1">
            <p>· 建议优先联系高等级（S级、A级）客人，他们对回头率影响更大。</p>
            <p>· 主动关怀时可以询问客人近况，表达关心，不要直接推销。</p>
            <p>· 点击"关怀"可以快速创建关怀提醒，记录关怀行动。</p>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

