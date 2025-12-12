"use client"

import { Copy, MessageCircle, Phone, Sparkles, X, Heart, TrendingUp, Calendar, UserCheck } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { Contact } from "@/lib/mock-data"
import { useState, useMemo } from "react"
import { useToast } from "@/components/ui/use-toast"

interface IcebreakerModalProps {
  isOpen: boolean
  onClose: () => void
  contact: Contact
}

const generateStrategies = (contact: Contact) => {
  const strategies = []
  
  const isNearBirthday = false 
  
  if (isNearBirthday) {
      strategies.push({
        id: 'birthday',
        title: '生日关怀',
        reason: '📅 还有3天生日',
        icon: Calendar,
        color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
        content: `${contact.name}总，提前祝您生日快乐！🎂 记得上次您说最近在忙${contact.company || '公司'}的事，注意身体，期待您的好消息。`
      })
  } else {
      strategies.push({
        id: 'season',
        title: '节气/时令',
        reason: '🍂 今日霜降',
        icon: Sparkles,
        color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        content: `${contact.name.charAt(0)}总，今日霜降，气温转凉，记得多添衣物。上次您提到的那个项目，最近刚好有些新动向，不知方便时能否请教一二？`
      })
  }

  if (contact.tags && contact.tags.length > 0) {
      const interest = contact.tags[0] 
      strategies.push({
        id: 'interest',
        title: '投其所好',
        reason: `🎯 命中喜好：${interest}`,
        icon: Heart,
        color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
        content: `${contact.name.charAt(0)}总，刚才看到一篇关于${interest}的深度好文，分析得很透彻，想必您会感兴趣，特转给您看看。`
      })
  } else {
      strategies.push({
        id: 'value',
        title: '行业价值',
        reason: '💼 行业动态',
        icon: TrendingUp,
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        content: `${contact.name.charAt(0)}总，关注到${contact.company || '行业'}最近有些新政策导向，感觉对咱们接下来的布局可能有参考价值。`
      })
  }

  strategies.push({
    id: 'casual',
    title: '路过约见',
    reason: '📍 地理位置接近',
    icon: MessageCircle,
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    content: `许久未见，甚是挂念。下周二我去您公司附近办事，不知${contact.name.charAt(0)}总是否在公司？方便的话讨杯茶喝。`
  })

  return strategies
}

export function IcebreakerModal({ isOpen, onClose, contact }: IcebreakerModalProps) {
  const { toast } = useToast()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const strategies = useMemo(() => contact ? generateStrategies(contact) : [], [contact])

  if (!contact) return null

  const wechatInfo = {
      nickname: `AAA ${contact.name}`,
      id: `wxid_${Math.random().toString(36).substr(2, 8)}`
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast({
      title: "话术已复制",
      description: "即将跳转微信...",
    })
    
    setTimeout(() => {
        setCopiedId(null)
    }, 1500)
  }

  const handleCopyWechat = () => {
      navigator.clipboard.writeText(wechatInfo.nickname)
      toast({ title: "微信昵称已复制", description: "去微信搜索吧" })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* 响应式宽度适配 */}
      <DialogContent className="w-[90vw] max-w-[360px] bg-card p-0 gap-0 rounded-[24px] overflow-hidden border-none shadow-2xl flex flex-col max-h-[85vh]">
        <DialogTitle className="sr-only">破冰锦囊</DialogTitle>
        
        {/* Header - 固定高度 */}
        <div className="bg-gradient-to-br from-primary to-primary/80 dark:from-secondary dark:to-secondary/80 px-6 py-6 relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-black/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            
            <h3 className="text-white font-serif font-bold text-xl relative z-10 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                破冰锦囊
            </h3>
            <p className="text-white/90 text-xs mt-2 relative z-10 leading-relaxed">
                已根据 <span className="font-bold border-b border-white/40">{contact.name}</span> 的<br/>
                <span className="opacity-80">喜好、行业动态、节气</span> 生成专属策略
            </p>
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors bg-black/10 rounded-full p-1 hover:bg-black/20"
            >
                <X className="w-4 h-4" />
            </button>
        </div>

        {/* 策略列表 - 可滚动区域 */}
        <div className="p-5 space-y-4 bg-background overflow-y-auto hide-scrollbar flex-1">
            {strategies.map((strategy) => {
                const isCopied = copiedId === strategy.id

                return (
                    <div 
                        key={strategy.id} 
                        className="group relative bg-card border border-border rounded-xl p-4 transition-all hover:shadow-md hover:border-primary/30 shrink-0"
                    >
                        <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-background text-[10px] font-bold text-muted-foreground border border-border rounded-full shadow-sm flex items-center gap-1">
                            {strategy.reason}
                        </div>

                        <div className="flex items-center justify-between mb-3 mt-1">
                            <div className="flex items-center gap-2">
                                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shadow-sm", strategy.color)}>
                                    <strategy.icon className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-bold text-foreground">{strategy.title}</span>
                            </div>
                            <button 
                                onClick={() => handleCopy(strategy.content, strategy.id)}
                                className={cn(
                                    "text-[10px] px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 font-medium",
                                    isCopied 
                                        ? "bg-green-500 text-white border-green-500 shadow-sm" 
                                        : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                                )}
                            >
                                {isCopied ? "已复制" : "复制文案"}
                                {!isCopied && <Copy className="w-3 h-3" />}
                            </button>
                        </div>
                        
                        <div className="relative">
                            <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-lg border border-border/50 font-sans">
                                "{strategy.content}"
                            </p>
                            <span className="absolute -top-2 -left-1 text-4xl text-muted-foreground/10 font-serif leading-none">“</span>
                        </div>
                    </div>
                )
            })}
        </div>

        {/* 底部固定区域 */}
        <div className="shrink-0">
            {/* 微信信息 */}
            <div className="px-5 py-3 bg-green-50 dark:bg-green-900/10 border-t border-b border-green-100 dark:border-green-900/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <div className="flex flex-col">
                        <span className="text-[10px] text-green-700/70 dark:text-green-400/70">发送给 (微信昵称)</span>
                        <span className="text-xs font-bold text-green-800 dark:text-green-300">{wechatInfo.nickname}</span>
                    </div>
                </div>
                <button 
                    onClick={handleCopyWechat}
                    className="text-[10px] bg-white dark:bg-slate-800 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-2 py-1 rounded shadow-sm hover:bg-green-50 transition-colors"
                >
                    复制昵称
                </button>
            </div>

            {/* 底部操作 */}
            <div className="p-4 bg-muted/30 flex items-center justify-between">
                <span className="text-xs text-muted-foreground pl-1">觉得不合适？</span>
                <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-border shadow-sm text-xs font-bold text-foreground hover:bg-accent transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" />
                        去微信粘贴
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-colors">
                        <Phone className="w-3.5 h-3.5" />
                        拨打电话
                    </button>
                </div>
            </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}
