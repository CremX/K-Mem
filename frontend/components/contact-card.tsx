"use client"

import { Phone, Star, Link as LinkIcon, Clock, MapPin, Briefcase, Search, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import type { Contact } from "@/lib/mock-data"
import { LEVEL_CONFIG } from "@/lib/constants"

interface ContactCardProps {
  contact: Contact
  showWarnings?: boolean
  matchContext?: {
      type: 'note' | 'bio' | 'tag' | 'chat'
      text: string
      highlight?: string
  }
}

export function ContactCard({ contact, showWarnings = true, matchContext }: ContactCardProps) {
  const router = useRouter()
  
  const lastDateStr = contact.lastContactDate || contact.createdAt
  const lastDate = new Date(lastDateStr)
  const today = new Date()
  const daysSinceContact = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
  
  const frequency = contact.interactionFrequency || 30
  const isOverdue = daysSinceContact > frequency

  const levelConfig = LEVEL_CONFIG[contact.level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG.C
  
  const isSLevel = contact.level === 'S'
  
  // 智能提取“记忆钩子”逻辑
  let memoryHook = null

  if (matchContext) {
      // 1. 如果有搜索命中上下文，最高优先级展示
      let icon = Search
      if (matchContext.type === 'note') icon = MessageSquare
      if (matchContext.type === 'tag') icon = LinkIcon
      
      memoryHook = { 
          icon, 
          text: matchContext.text, 
          isHighlight: true 
      }
  } else {
      // 2. 默认展示逻辑
      if (contact.tags.includes("转介绍") || contact.tags.includes("老乡")) {
          memoryHook = { icon: LinkIcon, text: contact.tags.includes("老乡") ? "同乡会成员" : "王总推荐" }
      } else if (contact.preferences) {
          memoryHook = { icon: Star, text: `喜好: ${contact.preferences.split(',')[0]}` } 
      } else {
          memoryHook = { icon: Briefcase, text: contact.tags.slice(0, 2).join(" · ") }
      }
  }

  const handleCall = (e: React.MouseEvent) => {
      e.stopPropagation()
      window.location.href = `tel:${contact.phone}`
  }

  // 高亮文本渲染帮助函数
  const renderHighlight = (text: string, highlight?: string) => {
      if (!highlight) return text
      const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
      return (
          <span>
              {parts.map((part, i) => 
                  part.toLowerCase() === highlight.toLowerCase() 
                      ? <span key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-foreground font-bold px-0.5 rounded-[2px]">{part}</span> 
                      : part
              )}
          </span>
      )
  }

  return (
    <div
      onClick={() => router.push(`/contacts/${contact.id}`)}
      className={cn(
        "relative group flex items-start gap-3 p-4 rounded-[16px] transition-all duration-300 cursor-pointer active:scale-[0.98]",
        "bg-card border shadow-sm hover:shadow-md hover:border-primary/20",
        isSLevel ? "border-secondary/30 bg-gradient-to-br from-card to-secondary/5" : "border-border",
        // 逾期高亮：左侧加红条提示，而不是整卡变红，保持优雅
        isOverdue && !isSLevel && "border-l-[3px] border-l-destructive border-y-border border-r-border"
      )}
    >
      {/* 头像区域 */}
      <div className="relative shrink-0 mt-0.5">
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm",
             levelConfig.bgColor
          )}
        >
          {contact.name.slice(0, 1)}
        </div>
        
        {/* 等级徽标 */}
        {isSLevel && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary text-white rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-card shadow-sm">
                S
            </div>
        )}
      </div>

      {/* 主要信息 */}
      <div className="flex-1 min-w-0 pr-8"> {/* pr-8 给电话按钮留位置 */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={cn(
                "font-bold text-[17px] truncate text-foreground font-sans",
                isSLevel && "text-primary dark:text-secondary"
            )}>
                {renderHighlight(contact.name, matchContext?.highlight)}
            </span>
            {contact.isFavorite && <Star className="w-3.5 h-3.5 text-secondary fill-secondary shrink-0" />}
          </div>
          
          {/* 右上角：状态胶囊 */}
          <span className={cn(
            "text-[10px] px-1.5 py-0.5 rounded-md font-medium border shrink-0 ml-2",
            isOverdue 
                ? "bg-destructive/10 text-destructive border-destructive/20" 
                : "bg-muted/50 text-muted-foreground border-transparent"
          )}>
            {isOverdue ? `${daysSinceContact}天未联系` : `${daysSinceContact}天前`}
          </span>
        </div>

        {/* 职位 | 公司 (当没有高亮Context且不是S级时，如果信息太长可以隐藏，这里暂时保留) */}
        {!matchContext && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2.5">
              <span className="truncate max-w-[80px] font-medium text-foreground/80">
                {contact.title || "职位未填"}
              </span>
              <span className="w-px h-2.5 bg-border/80"></span>
              <span className="truncate max-w-[140px]">
                {contact.company || "公司未填"}
              </span>
            </div>
        )}

        {/* 记忆钩子 (Context Hook) - 核心改动区域 */}
        {memoryHook && (
            <div className={cn(
                "flex items-start gap-1.5 text-xs px-2 py-1.5 rounded-lg border w-fit max-w-full mt-1",
                memoryHook.isHighlight 
                    ? "bg-primary/5 border-primary/20 text-foreground" 
                    : "bg-muted/30 border-border/40 text-muted-foreground/80"
            )}>
                <memoryHook.icon className={cn(
                    "w-3.5 h-3.5 shrink-0 mt-0.5",
                    memoryHook.isHighlight ? "text-primary" : "opacity-70"
                )} />
                <span className="truncate-2 leading-tight">
                    {matchContext ? renderHighlight(memoryHook.text, matchContext.highlight) : memoryHook.text}
                </span>
            </div>
        )}
      </div>

      {/* 快捷电话 */}
      <button 
          onClick={handleCall}
          className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-primary/5 hover:bg-primary/10 flex items-center justify-center text-primary transition-colors active:scale-90"
      >
          <Phone className="w-4 h-4" />
      </button>
    </div>
  )
}
