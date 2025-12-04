"use client"

import { useRouter } from "next/navigation"
import { Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight, Moon, Target, TrendingUp } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { PageHeader } from "@/components/page-header"
import { mockContacts, mockTasks, mockRecords, getDaysSinceLastContact } from "@/lib/mock-data"

export default function ProfilePage() {
  const router = useRouter()

  // 统计数据
  const stats = {
    totalContacts: mockContacts.length,
    aLevel: mockContacts.filter((c) => c.level === "A").length,
    bLevel: mockContacts.filter((c) => c.level === "B").length,
    cLevel: mockContacts.filter((c) => c.level === "C").length,
    pendingTasks: mockTasks.filter((t) => !t.isCompleted).length,
    completedTasks: mockTasks.filter((t) => t.isCompleted).length,
    needContact: mockContacts.filter((c) => {
      const lastService = c.lastService || c.lastContact
      const frequency = c.serviceFrequency || c.contactFrequency || 30
      if (!lastService) return false
      return getDaysSinceLastContact(lastService) > frequency
    }).length,
    thisWeekRecords: mockRecords.filter((r) => {
      const recordDate = new Date(r.date)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return recordDate >= weekAgo
    }).length,
  }

  const menuSections = [
    {
      title: "设置",
      items: [
        { icon: Bell, label: "提醒设置", path: "/profile/notifications", desc: "服务频率、生日、关怀提醒" },
        {
          icon: Target,
          label: "客户等级标准",
          path: "/profile/levels",
          desc: `A级:${stats.aLevel} B级:${stats.bLevel} C级:${stats.cLevel}`,
        },
        { icon: Moon, label: "深色模式", path: "/profile/theme", trailing: "跟随系统" },
      ],
    },
    // {
    //   title: "数据",
    //   items: [
    //     { icon: TrendingUp, label: "工作统计", path: "/profile/stats", desc: "跟进率、完成率" },
    //     { icon: Shield, label: "数据备份", path: "/profile/backup" },
    //   ],
    // },
    {
      title: "支持",
      items: [
        { icon: HelpCircle, label: "使用帮助", path: "/profile/help" },
        // { icon: Settings, label: "关于", path: "/profile/about" },
      ],
    },
  ]

  const handleLogout = () => {
    if (confirm("确定要退出登录吗？")) {
      router.push("/auth/login")
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="我的" />

      <main className="px-4 py-4 space-y-4">
        {/* 用户信息卡片 */}
        <div
          onClick={() => router.push("/profile/info")}
          className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 touch-active"
        >
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-medium">
            R
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">待办客用户</h2>
            <p className="text-sm text-muted-foreground">点击编辑个人信息</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* 工作概览 */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold mb-3">工作概览</h3>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-xl font-bold text-primary">{stats.totalContacts}</p>
              <p className="text-xs text-muted-foreground">客户</p>
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{stats.aLevel}</p>
              <p className="text-xs text-muted-foreground">A级</p>
            </div>
            <div>
              <p className="text-xl font-bold">{stats.thisWeekRecords}</p>
              <p className="text-xs text-muted-foreground">本周跟进</p>
            </div>
            <div>
              <p className={`text-xl font-bold ${stats.needContact > 0 ? "text-urgent" : "text-success"}`}>
                {stats.needContact}
              </p>
              <p className="text-xs text-muted-foreground">需联系</p>
            </div>
          </div>

          {/* 完成率 */}
          {/* <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">任务完成率</span>
              <span className="font-medium">
                {stats.completedTasks + stats.pendingTasks > 0
                  ? Math.round((stats.completedTasks / (stats.completedTasks + stats.pendingTasks)) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-success rounded-full transition-all"
                style={{
                  width: `${
                    stats.completedTasks + stats.pendingTasks > 0
                      ? (stats.completedTasks / (stats.completedTasks + stats.pendingTasks)) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div> */}
        </div>

        {/* 菜单列表 */}
        {menuSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-sm font-medium text-muted-foreground mb-2 px-1">{section.title}</h3>
            <div className="bg-card rounded-xl border border-border divide-y divide-border">
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 active:bg-muted/50 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1 text-left">
                      <p>{item.label}</p>
                      {"desc" in item && item.desc && <p className="text-xs text-muted-foreground">{item.desc}</p>}
                    </div>
                    {"trailing" in item && item.trailing ? (
                      <span className="text-sm text-muted-foreground">{item.trailing}</span>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {/* 退出登录 */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-card rounded-xl border border-border text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>退出登录</span>
        </button>

        <p className="text-center text-xs text-muted-foreground">RTA · 待办客 v1.0.0</p>
      </main>

      <BottomNav />
    </div>
  )
}
