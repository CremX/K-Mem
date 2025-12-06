"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Check, Phone, Users, Mail, MessageCircle, MoreHorizontal } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { mockContacts } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type CommunicationType = "call" | "meeting" | "email" | "wechat" | "other"

const typeOptions: { value: CommunicationType; label: string; icon: React.ElementType }[] = [
  { value: "call", label: "电话", icon: Phone },
  { value: "meeting", label: "会议", icon: Users },
  { value: "email", label: "邮件", icon: Mail },
  { value: "wechat", label: "微信", icon: MessageCircle },
  { value: "other", label: "其他", icon: MoreHorizontal },
]

export default function RecordCommunicationPage() {
  const params = useParams()
  const router = useRouter()
  const contactId = params.id as string
  const contact = mockContacts.find((c) => c.id === contactId)

  const [type, setType] = useState<CommunicationType>("call")
  const [content, setContent] = useState("")
  const [nextAction, setNextAction] = useState("")
  const [duration, setDuration] = useState("")

  const handleSubmit = () => {
    if (!content.trim()) {
      alert("请输入沟通内容")
      return
    }

    // 这里实际应该调用 API 保存数据
    console.log("提交沟通记录:", {
      contactId,
      type,
      content,
      nextAction,
      duration: duration ? Number.parseInt(duration) : undefined,
      date: new Date().toISOString().split("T")[0],
    })
    router.back()
  }

  return (
    <div className="min-h-screen bg-background pb-safe">
      <PageHeader
        title="记录沟通"
        showBack
        rightContent={
          <button onClick={handleSubmit} className="p-2 rounded-full hover:bg-muted transition-colors text-primary">
            <Check className="w-5 h-5" />
          </button>
        }
      />

      <main className="px-4 py-4 space-y-6">
        {/* 联系人信息 */}
        {contact && (
          <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-white font-medium",
                "bg-blue-500",
              )}
            >
              {contact.name.slice(0, 1)}
            </div>
            <div>
              <p className="font-medium">{contact.name}</p>
            </div>
          </div>
        )}

        {/* 沟通类型 */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">沟通类型</h3>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {typeOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.value}
                  onClick={() => setType(option.value)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors",
                    type === option.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {option.label}
                </button>
              )
            })}
          </div>
        </section>

        {/* 沟通内容 */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            沟通内容 <span className="text-destructive">*</span>
          </h3>
          <div className="bg-card rounded-xl border border-border p-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="记录本次沟通的要点..."
              rows={6}
              className="w-full bg-transparent text-foreground focus:outline-none resize-none"
            />
          </div>
        </section>

        {/* 时长 */}
        {(type === "call" || type === "meeting") && (
          <section>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">沟通时长（分钟）</h3>
            <div className="bg-card rounded-xl border border-border p-4">
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="输入时长"
                className="w-full bg-transparent text-foreground focus:outline-none"
              />
            </div>
          </section>
        )}

        {/* 下一步行动 */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">下一步行动</h3>
          <div className="bg-card rounded-xl border border-border p-4">
            <input
              type="text"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder="计划下一步做什么..."
              className="w-full bg-transparent text-foreground focus:outline-none"
            />
          </div>
        </section>
      </main>
    </div>
  )
}