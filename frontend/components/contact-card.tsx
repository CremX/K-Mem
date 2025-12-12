"use client"

import { Phone, MessageCircle, Star, ChevronRight, Link as LinkIcon, Briefcase } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import type { Contact } from "@/lib/mock-data"
import { getDaysUntilBirthday } from "@/lib/mock-data"
import { LEVEL_CONFIG } from "@/lib/constants"

interface ContactCardProps {
  contact: Contact
  showWarnings?: boolean
}

export function ContactCard({ contact, showWarnings = true }: ContactCardProps) {
  const router = useRouter()
  
  const lastDateStr = contact.lastContactDate || contact.createdAt
  const lastDate = new Date(lastDateStr)
  const today = new Date()
  const daysSinceContact = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
  
  const frequency = contact.interactionFrequency || 30
  const isOverdue = daysSinceContact > frequency

  const levelConfig = LEVEL_CONFIG[contact.level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG.C
  
  const isSLevel = contact.level === 'S'
  
  // 模拟关系钩子数据
  const connectionHook = contact.tags.includes("老乡") ? "🏠 同乡会成员" : (contact.level === 'S' ? "🔗 王总 (天使投资人) 介绍" : null)

  const handleCall = (e: React.MouseEvent) => {
      e.stopPropagation()
      window.location.href = `tel:${contact.phone}`
  }

  return (
    <div
      onClick={() => router.push(`/contacts/${contact.id}`)}
      className={cn(
        "relative group flex items-start gap-3 p-4 rounded-[16px] transition-all duration-300 cursor-pointer active:scale-[0.98]",
        "bg-card border shadow-sm hover:shadow-md hover:border-primary/20", // 基础样式
        isSLevel ? "border-secondary/30 bg-gradient-to-br from-card to-secondary/5" : "border-border", // S级特殊质感
      )}
    >
      {/* 头像区域 */}
      <div className="relative shrink-0 mt-0.5">
        <div
          className={cn(
            "w-11 h-11 rounded-full flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm",
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
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-1.5">
            <span className={cn(
                "font-bold text-base truncate text-foreground font-sans",
                isSLevel && "text-primary dark:text-secondary"
            )}>
                {contact.name}
            </span>
            {contact.isFavorite && <Star className="w-3 h-3 text-secondary fill-secondary shrink-0" />}
          </div>
          
          {/* 最近联系时间 (弱化) */}
          <span className={cn(
            "text-[10px]",
            isOverdue 
                ? "text-destructive font-medium" 
                : "text-muted-foreground/60"
          )}>
            {isOverdue ? `${daysSinceContact}天未联系` : `${daysSinceContact}天前`}
          </span>
        </div>

        {/* 职位 | 公司 */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
          <span className="truncate max-w-[80px] font-medium text-foreground/80">
            {contact.title || "职位未填"}
          </span>
          <span className="w-[1px] h-2.5 bg-border/80"></span>
          <span className="truncate max-w-[120px]">
            {contact.company || "公司未填"}
          </span>
        </div>

        {/* 底部：关系钩子/标签 + 快捷操作 */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30 border-dashed">
            {/* 左侧：记忆钩子 */}
            <div className="flex items-center gap-1.5 min-w-0">
                {connectionHook ? (
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded border border-border/50 truncate max-w-[160px]">
                        <LinkIcon className="w-2.5 h-2.5 opacity-70" />
                        {connectionHook}
                    </span>
                ) : (
                    <div className="flex gap-1.5">
                        {contact.tags?.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[10px] text-muted-foreground/70 bg-muted/20 px-1.5 py-0.5 rounded border border-border/30">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* 右侧：快捷电话 */}
            <button 
                onClick={handleCall}
                className="w-7 h-7 rounded-full bg-primary/5 hover:bg-primary/10 flex items-center justify-center text-primary transition-colors active:scale-90"
            >
                <Phone className="w-3.5 h-3.5" />
            </button>
        </div>
      </div>
    </div>
  )
}
