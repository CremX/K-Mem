"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Crown, Zap, Shield, Database, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MembershipPage() {
  const router = useRouter()

  const benefits = [
    {
      icon: Zap,
      title: "无限名片识别",
      desc: "告别手动录入，精准高效",
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      icon: Database,
      title: "人脉数据导出",
      desc: "一键导出 Excel，安全备份",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      icon: Crown,
      title: "尊贵身份标识",
      desc: "金圈头像，专属 VIP 徽章",
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      icon: Shield,
      title: "数据隐私保险箱",
      desc: "指纹/面容解锁，守护资产",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      icon: Sparkles,
      title: "AI 智能撩客",
      desc: "无限次生成高情商话术",
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      icon: Check,
      title: "专属客服",
      desc: "1对1 人工服务响应",
      color: "text-rose-500",
      bg: "bg-rose-500/10"
    }
  ]

  return (
    <div className="min-h-screen bg-[#0d1210] text-white pb-24">
      {/* Header */}
      <header className="pt-12 px-5 pb-4 flex items-center gap-4 relative z-10">
        <button 
          onClick={() => router.back()} 
          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white/80" />
        </button>
        <h1 className="text-lg font-bold">会员中心</h1>
      </header>

      <main className="px-5 space-y-8">
        {/* SVIP Card */}
        <div className="relative aspect-[1.8/1] rounded-2xl overflow-hidden bg-gradient-to-br from-[#2a2620] via-[#1f1d19] to-[#1a1714] border border-[#D4AF37]/30 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
            {/* 噪点与光效 */}
            <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/10 blur-[60px] rounded-full"></div>
            
            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F4D58D] to-[#D4AF37] flex items-center justify-center shadow-lg">
                            <Crown className="w-6 h-6 text-[#1a1714] fill-current" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-[#F4D58D]">SVIP</h2>
                            <p className="text-[10px] text-[#D4AF37]/70 mt-0.5">尊享 12 项专属特权，助力事业腾飞</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-white/40 mb-1">当前状态</p>
                        <p className="text-sm font-bold text-white/60">未开通</p>
                    </div>
                </div>

                <div className="flex gap-6 text-xs text-[#D4AF37]/80">
                    <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" /> 无限OCR
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" /> 数据导出
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" /> 身份标识
                    </div>
                </div>
            </div>
        </div>

        {/* 套餐选择 */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-2 border-[#D4AF37] pl-3">
                <h3 className="text-lg font-bold font-serif text-[#F4D58D]">选择会员套餐</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                {/* 月度 */}
                <div className="bg-[#1a1814] border border-white/10 rounded-2xl p-5 relative group cursor-pointer hover:border-[#D4AF37]/50 transition-all">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                        限时特惠
                    </div>
                    <div className="text-center pt-2">
                        <p className="text-sm font-medium text-white/80">月度会员</p>
                        <div className="my-2 flex items-baseline justify-center gap-0.5">
                            <span className="text-sm text-[#D4AF37]">¥</span>
                            <span className="text-4xl font-bold text-white">99</span>
                        </div>
                        <p className="text-xs text-white/30 line-through">¥128</p>
                        <p className="text-[10px] text-white/40 mt-3">低门槛体验</p>
                    </div>
                </div>

                {/* 年度 */}
                <div className="bg-gradient-to-b from-[#2a2620] to-[#1a1714] border-2 border-[#D4AF37] rounded-2xl p-5 relative cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.15)] transform scale-105">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] to-[#F4D58D] text-black text-[10px] font-bold px-3 py-0.5 rounded-full shadow-lg">
                        超值推荐
                    </div>
                    <div className="text-center pt-2">
                        <p className="text-sm font-bold text-[#F4D58D]">年度会员</p>
                        <div className="my-2 flex items-baseline justify-center gap-0.5">
                            <span className="text-sm text-[#D4AF37]">¥</span>
                            <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#F4D58D] to-[#D4AF37]">998</span>
                        </div>
                        <p className="text-xs text-white/30 line-through">¥1536</p>
                        <p className="text-[10px] text-[#D4AF37]/80 mt-3 font-medium">低至 83元/月</p>
                    </div>
                </div>
            </div>
        </div>

        {/* 特权详情 */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-2 border-[#D4AF37] pl-3">
                <h3 className="text-lg font-bold font-serif text-[#F4D58D]">特权详情</h3>
            </div>

            <div className="bg-[#151515] border border-white/5 rounded-2xl p-5 grid grid-cols-2 gap-y-6 gap-x-4">
                {benefits.map((item, i) => (
                    <div key={i} className="flex gap-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", item.bg)}>
                            <item.icon className={cn("w-4 h-4", item.color)} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white/90">{item.title}</h4>
                            <p className="text-[10px] text-white/40 mt-1 leading-tight">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </main>

      {/* 底部悬浮按钮 */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/90 to-transparent z-20">
          <button className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F4D58D] text-black font-bold h-12 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)] active:scale-95 transition-transform flex items-center justify-center gap-2">
              <Crown className="w-4 h-4 fill-black" />
              立即开通 SVIP
          </button>
      </div>
    </div>
  )
}

