"use client"

import { Mic, Camera, X, UserPlus, CheckSquare, ArrowUp, MapPin, Calendar, PenLine } from "lucide-react"
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface OmniEntryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function OmniEntryModal({ isOpen, onClose }: OmniEntryModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [text, setText] = useState("")
  const [targetType, setTargetType] = useState<'task' | 'contact'>('task') // 默认存为任务
  
  // 模拟环境信息
  const [contextInfo, setContextInfo] = useState({
      time: '',
      date: '',
      solarTerm: '霜降',
      location: '杭州'
  })

  useEffect(() => {
      const now = new Date()
      setContextInfo(prev => ({
          ...prev,
          time: now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          date: now.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })
      }))
  }, [])

  const handleSubmit = () => {
      if (!text.trim()) return
      
      onClose() // 先关闭弹窗，体验更流畅

      if (targetType === 'task') {
          // 场景 A：存为待办 -> 留在当前页，给强反馈
          toast({ 
              title: "✅ 已加入今日待办", 
              description: "AI 已自动提取时间：明天下午 3 点",
              duration: 3000
          })
          // 清空输入
          setText("")
      } else {
          // 场景 B：存为人脉 -> 跳转到新建/编辑页进行确认
          toast({ 
              title: "🤖 正在解析名片信息...", 
              description: "即将前往确认页面",
              duration: 1500
          })
          
          // 模拟延迟跳转，给 Toast 展示时间
          setTimeout(() => {
              const encodedText = encodeURIComponent(text)
              router.push(`/contacts/new?raw=${encodedText}`)
              setText("")
          }, 800)
      }
  }

  const handleProAction = (feature: string) => {
      toast({
          title: `解锁 ${feature}`,
          description: "升级 Pro 会员，体验 AI 极速录入。",
      })
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* 
          1. h-[92vh]: 保持高屏占比
          2. max-w-md: 限制宽度
          3. flex flex-col: 确保布局撑满
      */}
      <DrawerContent className="bg-background rounded-t-[32px] max-w-md mx-auto focus:outline-none h-[92vh] flex flex-col shadow-2xl">
        <DrawerTitle className="sr-only">灵感中枢</DrawerTitle>
        
        {/* === 顶部：时空坐标 === */}
        <div className="pt-6 px-6 pb-2 shrink-0 flex items-start justify-between">
            <div className="flex flex-col gap-1 opacity-60">
                <div className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{contextInfo.date}</span>
                    <span className="w-px h-3 bg-border" />
                    <span>{contextInfo.solarTerm}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground/80">
                    <MapPin className="w-3 h-3" />
                    <span>{contextInfo.location} · {contextInfo.time}</span>
                </div>
            </div>
            
            <button 
                onClick={onClose}
                className="p-2 -mr-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
            >
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* === 核心：沉浸式书写区 (修复：移除 autoFocus) === */}
        <div className="flex-1 px-6 relative group" onClick={() => document.getElementById('omni-input')?.focus()}>
            <textarea
                id="omni-input"
                // 移除 autoFocus，防止键盘自动弹起遮挡视图
                // autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="此刻，在想什么？"
                className="w-full h-full bg-transparent border-none text-xl text-foreground placeholder:text-muted-foreground/30 resize-none focus:outline-none leading-relaxed font-serif tracking-wide pt-4"
                style={{ caretColor: 'var(--primary)' }}
            />
            
            {/* 字数统计 */}
            <div className={cn(
                "absolute bottom-4 right-6 text-xs font-mono transition-opacity duration-500 text-muted-foreground/40",
                text.length > 0 ? "opacity-100" : "opacity-0"
            )}>
                {text.length} 字
            </div>
        </div>

        {/* === 底部：稳健的操作栏 === */}
        <div className="shrink-0 bg-muted/30 border-t border-border/50 pb-safe">
            <div className="px-4 py-3 flex items-center justify-between gap-4">
                
                {/* 左侧：Pro 工具 (Voice & Camera) */}
                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => handleProAction('语音')}
                        className="p-3 rounded-xl hover:bg-background transition-colors text-muted-foreground hover:text-foreground relative group"
                    >
                        <Mic className="w-6 h-6" />
                        <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-amber-400 rounded-full border border-muted" />
                    </button>
                    <button 
                        onClick={() => handleProAction('拍照')}
                        className="p-3 rounded-xl hover:bg-background transition-colors text-muted-foreground hover:text-foreground relative group"
                    >
                        <Camera className="w-6 h-6" />
                        <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-amber-400 rounded-full border border-muted" />
                    </button>
                </div>

                {/* 右侧：类型切换 + 发送 */}
                <div className="flex items-center gap-2">
                    {/* 类型切换胶囊 */}
                    <div className="flex bg-background rounded-full p-1 border border-border shadow-sm">
                        <button
                            onClick={() => setTargetType('task')}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5",
                                targetType === 'task' 
                                    ? "bg-primary text-primary-foreground shadow-sm" 
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <CheckSquare className="w-3.5 h-3.5" />
                            待办
                        </button>
                        <button
                            onClick={() => setTargetType('contact')}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5",
                                targetType === 'contact' 
                                    ? "bg-secondary text-secondary-foreground shadow-sm" 
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <UserPlus className="w-3.5 h-3.5" />
                            人脉
                        </button>
                    </div>

                    {/* 发送按钮 */}
                    <button
                        onClick={handleSubmit}
                        disabled={!text.trim()}
                        className={cn(
                            "w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-md",
                            text.trim()
                                ? "bg-foreground text-background hover:scale-105 active:scale-95"
                                : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                        )}
                    >
                        <ArrowUp className="w-5 h-5" strokeWidth={3} />
                    </button>
                </div>
            </div>
        </div>

      </DrawerContent>
    </Drawer>
  )
}
