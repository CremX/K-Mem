"use client"

import { useRouter } from "next/navigation"
import { Settings, Bell, HelpCircle, LogOut, ChevronRight, Moon, Target, Crown, QrCode } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { mockContacts, mockTasks, mockRecords, getDaysSinceLastContact } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function ProfilePage() {
  const router = useRouter()

  // 统计数据
  const stats = {
    totalContacts: mockContacts.length,
    coreAssets: mockContacts.filter(c => c.level === 'S' || c.level === 'A').length,
    daysJoined: 365, 
  }

  const menuSections = [
    {
      title: "Settings",
      items: [
        { icon: Bell, label: "提醒设置", path: "/profile/notifications" },
        { icon: Target, label: "客户等级标准", path: "/profile/levels" },
        { icon: Moon, label: "深色模式", path: "/profile/theme", trailing: "系统默认" },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "使用帮助", path: "/profile/help" },
      ],
    },
  ]

  const handleLogout = () => {
    if (confirm("确定要退出登录吗？")) {
      router.push("/auth/login")
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24 relative overflow-hidden transition-colors duration-500">
      
      {/* 顶部大卡片区域 (深色背景) - 增加内阴影和质感 */}
      <div className="relative bg-[#141414] pt-12 pb-24 px-6 rounded-b-[3rem] shadow-2xl overflow-hidden border-b border-white/5">
          {/* 高级感纹理：噪点 + 径向光 */}
          <div className="absolute inset-0 opacity-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-secondary/10 blur-[80px] rounded-full pointer-events-none"></div>

          {/* 1. Header: 个人信息 */}
          <div className="relative z-10 flex items-center gap-5 mb-10">
              <div className="relative group cursor-pointer">
                  {/* 头像光环动画 */}
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-primary to-secondary rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                  <div className="relative w-18 h-18 rounded-full p-[2px] bg-[#141414]">
                      <img src="/placeholder-user.jpg" alt="avatar" className="w-full h-full object-cover rounded-full border border-white/10" />
                  </div>
              </div>
              
              <div className="flex-1 text-white min-w-0">
                  <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-serif font-bold tracking-wide text-white">王建国</h1>
                      <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_5px_var(--primary)]"></span>
                          <span className="text-[10px] text-white/60 font-mono tracking-widest uppercase">ID:888888</span>
                      </div>
                  </div>
                  <p className="text-xs text-white/40 mt-1.5 font-medium tracking-[0.15em] uppercase">President · 建材协会会长</p>
              </div>
              
              <button 
                  onClick={() => router.push("/profile/card")}
                  className="group relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 backdrop-blur-md"
              >
                  <QrCode className="w-4 h-4 text-primary" />
              </button>
          </div>

          {/* 2. 数据看板 - 极简排版 + 呼吸感 */}
          <div className="relative z-10 flex justify-between items-center px-4">
              <div className="text-center group cursor-default">
                  <div className="text-3xl font-serif font-bold text-white group-hover:text-primary transition-colors duration-300">{stats.totalContacts}</div>
                  <div className="text-[9px] text-white/30 mt-1 uppercase tracking-[0.25em]">Total</div>
              </div>
              <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
              <div className="text-center group cursor-default">
                  <div className="text-3xl font-serif font-bold text-primary drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                      {stats.coreAssets}
                  </div>
                  <div className="text-[9px] text-primary/60 mt-1 uppercase tracking-[0.25em] font-bold">Core</div>
              </div>
              <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
              <div className="text-center group cursor-default">
                  <div className="text-3xl font-serif font-bold text-white group-hover:text-primary transition-colors duration-300">{stats.daysJoined}</div>
                  <div className="text-[9px] text-white/30 mt-1 uppercase tracking-[0.25em]">Days</div>
              </div>
          </div>
      </div>

      {/* 3. 悬浮 VIP 卡片 - 黑金质感巅峰 */}
      <div className="px-6 -mt-14 relative z-20">
          <div 
              onClick={() => router.push("/profile/membership")}
              className="relative aspect-[3.2/1] rounded-[24px] p-6 shadow-float overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1"
          >
              {/* 卡片背景：复杂渐变 + 金属拉丝感 */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F]"></div>
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
              
              {/* 金色流光边框 */}
              <div className="absolute inset-0 border border-primary/30 rounded-[24px]"></div>
              <div className="absolute inset-[1px] border border-primary/10 rounded-[23px]"></div>
              
              {/* 动态光斑 */}
              <div className="absolute -right-10 -top-20 w-48 h-48 bg-primary/10 blur-[60px] rounded-full group-hover:bg-primary/20 transition-all duration-700"></div>

              <div className="relative z-10 flex items-center justify-between h-full">
                  <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-b from-primary to-secondary p-[1px] shadow-lg flex items-center justify-center">
                          <div className="w-full h-full rounded-full bg-[#141414] flex items-center justify-center">
                              <Crown className="w-7 h-7 text-primary fill-primary/20" />
                          </div>
                      </div>
                      <div>
                          <h3 className="text-xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#F4D58D] to-primary tracking-wide">
                              SVIP 尊享会员
                          </h3>
                          <p className="text-[10px] text-primary/50 mt-1.5 font-medium tracking-[0.1em] uppercase">
                              Unlock Exclusive Privileges
                          </p>
                      </div>
                  </div>
                  
                  <button className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary text-[#0F0F0F] text-[10px] font-bold px-5 py-2.5 rounded-full shadow-gold group-hover:shadow-elevated transition-all transform group-hover:translate-x-[-2px]">
                      <span className="relative z-10 tracking-[0.15em] uppercase">Upgrade</span>
                      {/* 按钮流光 */}
                      <div className="absolute top-0 left-[-100%] w-[100%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] animate-[shimmer_3s_infinite]"></div>
                  </button>
              </div>
          </div>
      </div>

      {/* 4. 菜单列表 - 极简悬浮风格 */}
      <main className="px-6 mt-10 space-y-8">
          {menuSections.map((section) => (
              <div key={section.title}>
                  <h4 className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-4 pl-2">
                      {section.title}
                  </h4>
                  <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden shadow-soft">
                      {section.items.map((item, index) => {
                          const Icon = item.icon
                          return (
                              <button
                                  key={item.path}
                                  onClick={() => router.push(item.path)}
                                  className={cn(
                                      "w-full flex items-center gap-4 p-5 hover:bg-muted/30 transition-colors group relative",
                                      index !== section.items.length - 1 && "border-b border-border/30"
                                  )}
                              >
                                  <div className="w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                      <Icon className="w-4 h-4 stroke-[1.5px]" />
                                  </div>
                                  <div className="flex-1 text-left">
                                      <span className="text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors tracking-wide">
                                          {item.label}
                                      </span>
                                  </div>
                                  {"trailing" in item && (
                                      <span className="text-[10px] text-muted-foreground/60 mr-2 font-mono tracking-wide uppercase">{item.trailing}</span>
                                  )}
                                  <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                              </button>
                          )
                      })}
                  </div>
              </div>
          ))}

          <button
              onClick={handleLogout}
              className="w-full py-5 text-center text-xs font-bold text-muted-foreground/40 hover:text-destructive transition-colors mt-8 tracking-[0.2em] uppercase"
          >
              Log Out
          </button>
      </main>

      <BottomNav />
    </div>
  )
}
