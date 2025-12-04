"use client"

import { useState } from "react"
import { X, Phone, Users, MessageCircle, Car, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickRecordModalProps {
  isOpen: boolean
  onClose: () => void
  contactId: string
  contactName: string
  onSubmit: (data: {
    type: string
    summary: string
    hasPromise: boolean
    promiseContent?: string
    nextFollowUpDays?: number
  }) => void
}

const recordTypes = [
  { value: "call", label: "电话", icon: Phone },
  { value: "meeting", label: "见面", icon: Users },
  { value: "wechat", label: "微信", icon: MessageCircle },
  { value: "visit", label: "拜访", icon: Car },
  { value: "other", label: "其他", icon: MoreHorizontal },
]

const followUpOptions = [
  { value: 1, label: "明天" },
  { value: 3, label: "3天后" },
  { value: 7, label: "一周后" },
  { value: 14, label: "两周后" },
  { value: 30, label: "一个月后" },
]

export function QuickRecordModal({ isOpen, onClose, contactId, contactName, onSubmit }: QuickRecordModalProps) {
  const [type, setType] = useState("call")
  const [summary, setSummary] = useState("")
  const [hasPromise, setHasPromise] = useState(false)
  const [promiseContent, setPromiseContent] = useState("")
  const [nextFollowUpDays, setNextFollowUpDays] = useState<number | undefined>(undefined)

  if (!isOpen) return null

  const handleSubmit = () => {
    if (!summary.trim()) return
    onSubmit({
      type,
      summary: summary.trim(),
      hasPromise,
      promiseContent: hasPromise ? promiseContent : undefined,
      nextFollowUpDays,
    })
    // 重置表单
    setType("call")
    setSummary("")
    setHasPromise(false)
    setPromiseContent("")
    setNextFollowUpDays(undefined)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 弹窗内容 */}
      <div className="relative w-full max-w-lg bg-card rounded-t-2xl p-4 pb-safe animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-card pt-2 -mt-2 pb-2 z-10">
          <h3 className="text-lg font-semibold">快速记录 · {contactName}</h3>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="pb-4">
          {/* 步骤1：沟通方式 */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">沟通方式</p>
            <div className="flex gap-2">
              {recordTypes.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.value}
                    onClick={() => setType(item.value)}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-colors",
                      type === item.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 步骤2：一句话记录 */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">聊了什么（一句话）</p>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="例如：讨论了Q2合作计划"
              className="w-full px-3 py-3 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* 步骤3：承诺和下次跟进（可选） */}
          <div className="space-y-3 mb-6">
            {/* 承诺事项 */}
            <div>
              <button onClick={() => setHasPromise(!hasPromise)} className="flex items-center gap-2 text-sm">
                <div
                  className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                    hasPromise ? "bg-warning border-warning text-white" : "border-muted-foreground/50",
                  )}
                >
                  {hasPromise && <span className="text-xs">✓</span>}
                </div>
                <span>我答应了客户什么事</span>
              </button>
              {hasPromise && (
                <input
                  type="text"
                  value={promiseContent}
                  onChange={(e) => setPromiseContent(e.target.value)}
                  placeholder="例如：明天发报价单"
                  className="w-full mt-2 px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-warning/50"
                />
              )}
            </div>

            {/* 下次跟进 */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">下次跟进</p>
              <div className="flex gap-2 flex-wrap">
                {followUpOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setNextFollowUpDays(nextFollowUpDays === option.value ? undefined : option.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm transition-colors",
                      nextFollowUpDays === option.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="sticky bottom-0 bg-card pt-4 pb-safe -mb-4">
            <button
              onClick={handleSubmit}
              disabled={!summary.trim()}
              className={cn(
                "w-full py-3 rounded-xl font-medium transition-colors",
                summary.trim() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              保存记录
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
