"use client"

import { User, Building2, Heart, MessageSquare, AlertCircle, Cake, Clock } from "lucide-react"
import type { Contact, Task, CommunicationRecord } from "@/lib/mock-data"
import { getDaysUntilBirthday } from "@/lib/mock-data"

interface QuickGlanceCardProps {
  contact: Contact
  lastRecord?: CommunicationRecord
  pendingTasks?: Task[]
}

export function QuickGlanceCard({ contact, lastRecord, pendingTasks = [] }: QuickGlanceCardProps) {
  const daysUntilBirthday = contact.birthday ? getDaysUntilBirthday(contact.birthday) : null
  const birthdaySoon = daysUntilBirthday !== null && daysUntilBirthday <= 30

  const formatBirthday = (birthday: string) => {
    const d = new Date(birthday)
    return `${d.getMonth() + 1}月${d.getDate()}日`
  }

  return (
    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2 text-primary font-medium">
        <Clock className="w-4 h-4" />
        <span>见面前速览</span>
      </div>

      <div className="grid grid-cols-1 gap-2 text-sm">
        {/* 基本信息 */}
        {(contact.company || contact.position) && (
          <div className="flex items-start gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <span>
              {contact.company}
              {contact.position && ` · ${contact.position}`}
            </span>
          </div>
        )}

        {/* 喜好关注点 */}
        {contact.preferences && (
          <div className="flex items-start gap-2">
            <Heart className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <span>{contact.preferences}</span>
          </div>
        )}

        {/* 家庭信息 */}
        {contact.familyInfo && (
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <span>{contact.familyInfo}</span>
          </div>
        )}

        {/* 上次聊了什么 */}
        {lastRecord && (
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <span>上次: {lastRecord.summary || lastRecord.content.slice(0, 30)}</span>
          </div>
        )}

        {/* 待办承诺 */}
        {pendingTasks.length > 0 && (
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <div>
              <span className="text-warning font-medium">待办: </span>
              {pendingTasks.map((t) => t.title).join("、")}
            </div>
          </div>
        )}

        {/* 生日提醒 */}
        {birthdaySoon && contact.birthday && (
          <div className="flex items-start gap-2">
            <Cake className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
            <span className="text-pink-600">
              {daysUntilBirthday === 0
                ? "今天生日！"
                : `生日: ${formatBirthday(contact.birthday)}（${daysUntilBirthday}天后）`}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
