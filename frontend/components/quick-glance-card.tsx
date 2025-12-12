"use client"

import { X, Phone, MessageCircle, Share2, MapPin, AlertTriangle, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Contact } from "@/lib/mock-data"
import { LEVEL_CONFIG } from "@/lib/constants"
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog" 

interface QuickGlanceCardProps {
  isOpen: boolean
  onClose: () => void
  contact: Contact
}

export function QuickGlanceCard({ isOpen, onClose, contact }: QuickGlanceCardProps) {
  if (!contact) return null

  // 模拟数据
  const preferences = ["❤️ 普洱茶", "❤️ 高尔夫", "🚫 痛风/海鲜", "🚫 迟到"]
  const lastTopic = "上次（3周前）聊到他儿子刚拿到英国 UCL 的 Offer，可以以此为破冰话题。"
  const relationNode = "王总 (天使投资人) 的大学同学"

  const levelConfig = LEVEL_CONFIG[contact.level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG.C

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* 自适应宽度调整 */}
      <DialogContent className="w-[90vw] max-w-[360px] p-0 overflow-hidden bg-transparent border-none shadow-none gap-0 rounded-[24px]">
        <DialogTitle className="sr-only">{contact.name} 的速览档案</DialogTitle>
        
        <div className="relative bg-white dark:bg-slate-900 shadow-2xl border-2 border-primary/20 dark:border-secondary/30 overflow-hidden rounded-[24px] flex flex-col max-h-[85vh]">
            {/* 顶部装饰背景 */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary to-primary/80 dark:from-secondary dark:to-secondary/80 shrink-0" />
            
            {/* 关闭按钮 */}
            <button 
                onClick={onClose}
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/10 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/20 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>

            {/* 可滚动区域 */}
            <div className="relative pt-10 px-6 pb-6 text-center overflow-y-auto hide-scrollbar">
                {/* 头像 */}
                <div className="mx-auto w-20 h-20 rounded-full p-1 bg-white dark:bg-slate-900 shadow-xl mb-3 relative shrink-0">
                     <div className={cn(
                        "w-full h-full rounded-full flex items-center justify-center text-white text-2xl font-bold font-serif",
                        levelConfig.bgColor
                     )}>
                         {contact.name.slice(0, 1)}
                     </div>
                     <div className="absolute bottom-0 right-0 bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-slate-900">
                         {contact.level}级
                     </div>
                </div>

                {/* 姓名 & 职位 */}
                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-serif mb-1">{contact.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 flex items-center justify-center gap-1.5">
                    {contact.company} <span className="w-0.5 h-3 bg-slate-300" /> {contact.title}
                </p>

                {/* --- 核心板块：考前小抄 --- */}
                <div className="space-y-4 text-left">
                    
                    {/* 1. 喜好/雷区 */}
                    <div className="bg-orange-50 dark:bg-orange-950/20 rounded-xl p-3 border border-orange-100 dark:border-orange-900/30">
                        <div className="flex items-center gap-1.5 mb-2">
                             <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                             <span className="text-xs font-bold text-orange-700 dark:text-orange-400">喜好 & 雷区</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {preferences.map((pref, i) => (
                                <span key={i} className={cn(
                                    "text-[10px] px-2 py-1 rounded-md font-medium",
                                    pref.includes("🚫") 
                                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                        : "bg-white text-orange-800 dark:bg-slate-800 dark:text-orange-200 shadow-sm"
                                )}>
                                    {pref}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* 2. 最近话题 */}
                    <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-3 border border-primary/10 dark:border-primary/20">
                         <div className="flex items-center gap-1.5 mb-2">
                             <MessageCircle className="w-3.5 h-3.5 text-primary dark:text-secondary" />
                             <span className="text-xs font-bold text-primary dark:text-secondary">上次聊到</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {lastTopic}
                        </p>
                    </div>

                    {/* 3. 关系图谱 */}
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 justify-center pt-2">
                        <Share2 className="w-3 h-3" />
                        <span>关系节点：{relationNode}</span>
                    </div>

                </div>

                {/* 底部悬浮操作栏 */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
                    <button className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                         <MessageCircle className="w-4 h-4" />
                         微信
                    </button>
                    <button className="flex-1 bg-primary dark:bg-secondary text-white dark:text-slate-900 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                         <Phone className="w-4 h-4" />
                         通话
                    </button>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
