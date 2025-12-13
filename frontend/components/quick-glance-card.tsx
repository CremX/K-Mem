"use client"

import { Phone, MessageCircle, Share2, Heart, X, Sparkles, MapPin, Quote } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Contact } from "@/lib/mock-data"
import { LEVEL_CONFIG } from "@/lib/constants"
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"

interface QuickGlanceCardProps {
  isOpen: boolean
  onClose: () => void
  contact: Contact
}

export function QuickGlanceCard({ isOpen, onClose, contact }: QuickGlanceCardProps) {
  if (!contact) return null

  // 模拟数据
  const preferences = ["🍵 普洱茶", "🏌️ 高尔夫", "🚫 海鲜", "🚫 迟到"]
  const lastTopic = "上次（1月28日）聊到他儿子刚拿到英国 UCL 的 Offer，可以以此为破冰话题。"
  const relationNode = "王总 (天使投资人) 的大学同学"

  const levelConfig = LEVEL_CONFIG[contact.level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG.C

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-background rounded-t-[32px] max-w-md mx-auto focus:outline-none max-h-[85vh]">
        <DrawerTitle className="sr-only">速览档案</DrawerTitle>
        
        <div className="flex flex-col h-full overflow-hidden">
            
            {/* 顶部把手 & 标题 */}
            <div className="pt-4 pb-2 px-6 flex items-center justify-between shrink-0">
                <div className="w-12 h-1.5 bg-muted rounded-full absolute left-1/2 -translate-x-1/2 top-3" />
                <div className="flex items-center gap-2 text-primary font-bold font-serif text-lg mt-4">
                    <Sparkles className="w-4 h-4" />
                    <span>见面前速览</span>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 -mr-2 mt-4 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* 内容区域 */}
            <div className="p-6 overflow-y-auto hide-scrollbar space-y-6">
                
                {/* 1. 身份名片 (Identity Card) */}
                <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                        <div className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold font-serif shadow-md",
                            levelConfig.bgColor
                        )}>
                            {contact.name.slice(0, 1)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-background border border-border px-1.5 py-0.5 rounded-md text-[10px] font-bold text-foreground shadow-sm">
                            {contact.level}级
                        </div>
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                        <h3 className="text-xl font-bold text-foreground font-serif leading-tight">
                            {contact.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                            <span className="font-medium text-foreground/80">{contact.title || "职位未填"}</span>
                            <span className="w-px h-3 bg-border" />
                            <span className="truncate">{contact.company || "公司未填"}</span>
                        </p>
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground/70">
                            <Share2 className="w-3 h-3" />
                            <span className="truncate max-w-[200px]">{relationNode}</span>
                        </div>
                    </div>
                </div>

                {/* 分割线 */}
                <div className="h-px bg-border/50 w-full" />

                {/* 2. 关键记忆点 (Memory Points) */}
                <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5" />
                        喜好与雷区
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {preferences.map((pref, i) => (
                            <span key={i} className={cn(
                                "px-3 py-1.5 rounded-lg text-sm font-medium border",
                                pref.includes("🚫") 
                                    ? "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/30"
                                    : "bg-muted/50 text-foreground border-transparent"
                            )}>
                                {pref}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 3. 上次话题 (Last Context) */}
                <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-5 border border-primary/10 dark:border-primary/20 relative">
                    <Quote className="absolute top-4 left-4 w-4 h-4 text-primary/40 fill-primary/20" />
                    <p className="text-sm text-foreground/90 leading-relaxed pl-6 font-serif">
                        {lastTopic}
                    </p>
                    <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
                        <MessageCircle className="w-3 h-3" />
                        <span>记录于 2025.01.28</span>
                    </div>
                </div>

            </div>

            {/* 底部操作栏 */}
            <div className="p-4 border-t border-border/50 bg-muted/20 pb-safe">
                <div className="flex gap-3">
                    <button className="flex-1 bg-white dark:bg-card border border-border text-foreground py-3 rounded-xl text-sm font-bold hover:bg-muted transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-95">
                         <MessageCircle className="w-4 h-4" />
                         微信
                    </button>
                    <button className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 active:scale-95">
                         <Phone className="w-4 h-4" />
                         通话
                    </button>
                </div>
            </div>

        </div>
      </DrawerContent>
    </Drawer>
  )
}
