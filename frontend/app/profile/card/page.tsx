"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Share2, Download, Eye, Share, UserPlus, Lock, Smartphone, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MyCardPage() {
  const router = useRouter()
  const [showShareOptions, setShowShareOptions] = useState(false)

  // 模拟当前用户数据
  const user = {
    name: "王建国",
    title: "PRESIDENT",
    role: "建材行业协会 · 会长",
    phone: "138 0013 8000",
    address: "北京市朝阳区建国路88号",
    views: 1208,
    shares: 89,
    avatar: "王"
  }

  // 模拟访客记录
  const visitors = [
    {
      id: 1,
      name: "李总",
      avatar: "李",
      action: "保存了您的名片",
      time: "2分钟前",
      intent: "high", // 高意向
      isKnown: true
    },
    {
      id: 2,
      name: "未知访客",
      avatar: "?",
      action: "浏览了公司简介",
      time: "15分钟前",
      intent: "medium",
      isKnown: false
    },
    {
      id: 3,
      name: "陈经理",
      avatar: "陈",
      action: "查看了您的手机号",
      time: "1小时前",
      intent: "low",
      isKnown: true
    }
  ]

  return (
    <div className="min-h-screen bg-[#0d1210] text-white pb-10">
      {/* 顶部导航 */}
      <header className="pt-12 px-5 pb-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-white/70 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-medium text-white/90">我的名片</h1>
        <div className="w-8"></div> {/* 占位 */}
      </header>

      <main className="px-5">
        <div className="text-center mb-6">
            <p className="text-[10px] text-white/30 tracking-[0.2em] uppercase">Business Identity</p>
        </div>

        {/* 电子名片卡片 */}
        <div className="relative w-full aspect-[1.7/1] rounded-2xl overflow-hidden mb-6 group perspective-1000">
            {/* 背景纹理 */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2a2620] via-[#1f1d19] to-[#1a1714]">
                <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
                {/* 金色光晕 - 调整为更优雅的古铜金 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A961]/15 blur-[50px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#D4AF37]/10 blur-[60px] rounded-full"></div>
            </div>

            {/* 卡片内容 */}
            <div className="relative z-10 h-full p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4D58D] to-[#C9A961]">
                            {user.name}
                        </h2>
                        <p className="text-[10px] text-[#C9A961]/70 tracking-widest mt-1 font-medium uppercase">{user.title}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-serif bg-[#D4AF37]/5">
                        <span className="text-sm">客</span>
                    </div>
                </div>

                <div className="space-y-2 text-xs text-[#C9A961]/70 font-light">
                    <div className="flex items-center gap-2">
                        <BriefcaseIcon className="w-3 h-3 text-[#D4AF37]/60" />
                        <span>{user.role}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <PhoneIcon className="w-3 h-3 text-[#D4AF37]/60" />
                        <span>{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPinIcon className="w-3 h-3 text-[#D4AF37]/60" />
                        <span>{user.address}</span>
                    </div>
                </div>

                {/* 二维码 (模拟) */}
                <div className="absolute bottom-5 right-5">
                    <div className="w-8 h-8 border-2 border-[#D4AF37]/20 p-0.5 rounded bg-black/50 backdrop-blur-sm">
                        <div className="w-full h-full bg-white/10 grid grid-cols-2 gap-0.5">
                            <div className="bg-[#D4AF37]/80"></div>
                            <div className="bg-[#D4AF37]/40"></div>
                            <div className="bg-[#D4AF37]/40"></div>
                            <div className="bg-[#D4AF37]/80"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 数据概览 */}
        <div className="flex justify-center gap-8 mb-8 text-xs text-white/30">
            <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#C9A961]/50" />
                <span>被查看 <span className="text-[#D4AF37]/90 font-mono">{user.views}</span> 次</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Share className="w-3.5 h-3.5 text-[#C9A961]/50" />
                <span>被转发 <span className="text-[#D4AF37]/90 font-mono">{user.shares}</span> 次</span>
            </div>
        </div>

        {/* 操作按钮 */}
        <div className="grid grid-cols-2 gap-4 mb-10">
            <button className="h-12 bg-gradient-to-r from-[#1c4532] to-[#123022] rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-emerald-100 shadow-lg shadow-emerald-900/20 active:scale-95 transition-all border border-emerald-500/20">
                <Share2 className="w-4 h-4" />
                发给微信好友
            </button>
            <button className="h-12 bg-[#1a1814] rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-white/70 border border-white/5 active:scale-95 transition-all hover:border-[#D4AF37]/20">
                <Download className="w-4 h-4" />
                保存海报
            </button>
        </div>

        {/* 访客雷达 */}
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white/90">访客雷达</h3>
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </div>
                    <span className="text-[10px] text-white/30">实时捕捉商机</span>
                </div>
                <button className="text-[10px] text-[#D4AF37] flex items-center gap-0.5 hover:text-[#F4D58D] transition-colors">
                    全部记录 <ChevronRight className="w-3 h-3" />
                </button>
            </div>

            <div className="space-y-3">
                {visitors.map((visitor) => (
                    <div key={visitor.id} className="bg-gradient-to-br from-[#1a1814]/80 to-[#141210]/60 border border-[#D4AF37]/10 rounded-xl p-4 flex items-center gap-4 backdrop-blur-sm hover:border-[#D4AF37]/20 transition-colors">
                        {/* 头像 */}
                        <div className="relative shrink-0">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border",
                                visitor.isKnown 
                                    ? "bg-[#2a2620] text-[#D4AF37]/80 border-[#D4AF37]/20" 
                                    : "bg-[#1a1814] text-white/20 border-white/10"
                            )}>
                                {visitor.isKnown ? visitor.avatar : <Lock className="w-4 h-4" />}
                            </div>
                            {/* 意向标记 */}
                            {visitor.intent === 'high' && (
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0d1210] shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                            )}
                        </div>

                        {/* 信息 */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-sm font-medium text-white/90">{visitor.name}</span>
                                {visitor.intent === 'high' && (
                                    <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-medium border border-red-500/30">高意向</span>
                                )}
                            </div>
                            <p className="text-xs text-white/30 truncate">{visitor.action} · {visitor.time}</p>
                        </div>

                        {/* 操作 */}
                        <div className="shrink-0">
                            {visitor.isKnown ? (
                                <button className="w-8 h-8 rounded-full bg-[#1a1814] border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]/60 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-colors">
                                    <UserPlus className="w-4 h-4" />
                                </button>
                            ) : (
                                <button className="px-3 py-1.5 rounded-full border border-[#D4AF37]/30 text-[10px] text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors font-medium">
                                    谁？
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </main>
    </div>
  )
}

// 简单的 Icon 组件替代 (Lucide 有些图标需要微调)
function BriefcaseIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
    )
}

function PhoneIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
    )
}

function MapPinIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    )
}

