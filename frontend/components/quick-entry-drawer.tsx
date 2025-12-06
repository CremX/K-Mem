// components/quick-entry-drawer.tsx
"use client"

import { useState, useEffect } from "react"
import { X, Mic, Check, Battery, CloudOff, Dumbbell, Feather, Thermometer } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickEntryDrawerProps {
  isOpen: boolean
  onClose: () => void
}

// 预设的“脏手”快捷标签
const QUICK_TAGS = [
  { id: "tired", label: "很疲惫", icon: Battery, color: "bg-orange-100 text-orange-700 border-orange-200" },
  { id: "quiet", label: "不说话", icon: CloudOff, color: "bg-gray-100 text-gray-700 border-gray-200" },
  { id: "hard", label: "受力重", icon: Dumbbell, color: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: "soft", label: "受力轻", icon: Feather, color: "bg-green-100 text-green-700 border-green-200" },
  { id: "hot", label: "喜水热", icon: Thermometer, color: "bg-red-100 text-red-700 border-red-200" },
]

export function QuickEntryDrawer({ isOpen, onClose }: QuickEntryDrawerProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [note, setNote] = useState("")

  // 处理标签点击（多选）
  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  // 模拟保存
  const handleSave = () => {
    // 这里可以调用 API 保存
    alert(`已保存！\n标签: ${selectedTags.join(", ")}\n语音备注: ${note || "无"}`)
    // 重置并关闭
    setSelectedTags([])
    setNote("")
    onClose()
  }

  // 模拟语音录入
  const startRecording = () => {
    setIsRecording(true)
    setTimeout(() => {
        setNote("（模拟语音转文字）客户说下周二要去参加婚礼，可能会穿高跟鞋。")
        setIsRecording(false)
    }, 1500)
  }

  // 防止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [isOpen])

  // 动画样式控制
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* 1. 黑色遮罩 (点击关闭) */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* 2. 抽屉主体 */}
      <div className="relative bg-background w-full rounded-t-[24px] p-5 pb-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        {/* 顶部把手 */}
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6 opacity-50" />
        
        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-6">
            <div>
                <h2 className="text-xl font-bold">快速记一笔</h2>
                <p className="text-sm text-muted-foreground">刚才服务感觉怎么样？</p>
            </div>
            <button onClick={onClose} className="p-2 bg-muted/50 rounded-full">
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* 核心：指关节大按钮区域 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
            {QUICK_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag.id)
                const Icon = tag.icon
                return (
                    <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        className={cn(
                            "h-[70px] flex items-center justify-center gap-3 rounded-2xl border-2 transition-all active:scale-95 touch-manipulation",
                            isSelected 
                                ? `${tag.color} border-current font-bold shadow-sm` 
                                : "bg-card border-transparent text-muted-foreground hover:bg-muted/50"
                        )}
                    >
                        <Icon className={cn("w-6 h-6", isSelected ? "stroke-[2.5px]" : "stroke-2")} />
                        <span className="text-lg">{tag.label}</span>
                        {isSelected && <Check className="w-5 h-5 ml-1" />}
                    </button>
                )
            })}
        </div>

        {/* 语音补充区域 */}
        <div className="mb-6">
            <p className="text-sm font-medium mb-3 text-muted-foreground">补充备注</p>
            <div 
                onMouseDown={startRecording}
                onTouchStart={startRecording}
                className={cn(
                    "w-full h-[60px] rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all select-none",
                    isRecording ? "bg-red-50 text-red-600 border border-red-200" : "bg-muted/30 text-primary border border-dashed border-primary/30"
                )}
            >
                {isRecording ? (
                    <>
                        <span className="animate-pulse font-bold">正在聆听...</span>
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" />
                    </>
                ) : (
                    <>
                        <Mic className="w-5 h-5" />
                        <span>{note ? "已录入语音 (点击重录)" : "按住说话"}</span>
                    </>
                )}
            </div>
            {/* 显示录入结果 */}
            {note && (
                <div className="mt-3 p-3 bg-muted/30 rounded-lg text-sm text-foreground/80 leading-relaxed">
                    {note}
                </div>
            )}
        </div>

        {/* 保存按钮 */}
        <button 
            onClick={handleSave}
            className="w-full h-14 bg-primary text-primary-foreground text-lg font-bold rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
            保存记录
        </button>
      </div>
    </div>
  )
}