"use client"

import { Phone, MessageCircle, AlertTriangle, Star, Cake } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import type { Contact } from "@/lib/mock-data"
import { getDaysSinceLastContact, getDaysUntilBirthday } from "@/lib/mock-data"

interface ContactCardProps {
  contact: Contact
  showWarnings?: boolean
}

export function ContactCard({ contact, showWarnings = true }: ContactCardProps) {
  const router = useRouter()
  const lastService = contact.lastService || contact.lastContact
  const frequency = contact.serviceFrequency || contact.contactFrequency || 30
  const daysSinceService = getDaysSinceLastContact(lastService)
  const daysUntilBirthday = contact.birthday ? getDaysUntilBirthday(contact.birthday) : null

  // 是否需要服务预警（长时间未到店）
  const needsService = lastService ? daysSinceService > frequency : false
  const overdueDays = needsService ? daysSinceService - frequency : 0

  // 生日是否临近（7天内）
  const birthdaySoon = daysUntilBirthday !== null && daysUntilBirthday <= 7 && daysUntilBirthday >= 0

  const getAvatarColor = (name: string, level: string) => {
    if (level === "S") return "bg-amber-500"
    if (level === "A") return "bg-primary"
    if (level === "B") return "bg-emerald-500"
    return "bg-slate-400"
  }

  const getLevelBadge = (level: string) => {
    const config = {
      S: { bg: "bg-amber-500/10", text: "text-amber-600", label: "S级" },
      A: { bg: "bg-primary/10", text: "text-primary", label: "A级" },
      B: { bg: "bg-emerald-500/10", text: "text-emerald-600", label: "B级" },
      C: { bg: "bg-slate-500/10", text: "text-slate-500", label: "C级" },
    }
    return config[level as keyof typeof config] || config.C
  }

  const levelBadge = getLevelBadge(contact.level)

  return (
    <div
      onClick={() => router.push(`/contacts/${contact.id}`)}
      className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border touch-active"
    >
      {/* 头像 */}
      <div className="relative shrink-0">
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-lg",
            getAvatarColor(contact.name, contact.level),
          )}
        >
          {contact.name.slice(0, 1)}
        </div>
        {/* 客户等级角标 */}
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 text-[10px] font-bold px-1 rounded",
            levelBadge.bg,
            levelBadge.text,
          )}
        >
          {contact.level}
        </span>
      </div>

      {/* 主要信息 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{contact.name}</span>
          {contact.isFavorite && <Star className="w-3.5 h-3.5 text-warning fill-warning shrink-0" />}
        </div>

        {/* 公司职位 */}
        {contact.company && (
          <p className="text-xs text-muted-foreground truncate">
            {contact.company}
            {contact.position && ` · ${contact.position}`}
          </p>
        )}

        {/* 上次服务摘要 */}
        {contact.lastContactSummary && (
          <p className="text-xs text-muted-foreground/80 truncate mt-0.5">{contact.lastContactSummary}</p>
        )}

        {/* 服务偏好提示 */}
        {contact.servicePreferences && (
          <p className="text-xs text-muted-foreground/60 truncate mt-0.5">
            {contact.servicePreferences.split("，")[0]}
          </p>
        )}

        {/* 预警信息 */}
        {showWarnings && (needsService || birthdaySoon) && (
          <div className="flex items-center gap-2 mt-1.5">
            {needsService && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium bg-urgent/10 text-urgent rounded">
                <AlertTriangle className="w-3 h-3" />
                {overdueDays}天未到店
              </span>
            )}
            {birthdaySoon && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium bg-warning/10 text-warning rounded">
                <Cake className="w-3 h-3" />
                {daysUntilBirthday === 0 ? "今天生日" : `${daysUntilBirthday}天后生日`}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 快捷操作 */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation()
            window.location.href = `tel:${contact.phone}`
          }}
          className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          aria-label="打电话"
        >
          <Phone className="w-4 h-4" />
        </button>
        {contact.wechat && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              // 复制微信号
              navigator.clipboard.writeText(contact.wechat!)
              alert(`微信号已复制: ${contact.wechat}`)
            }}
            className="p-2 rounded-full bg-success/10 text-success hover:bg-success/20 transition-colors"
            aria-label="微信"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
