"use client"

import { useState } from "react"
import { Users, MessageSquare, Calendar, TrendingUp, Star, Tag, PieChart, Activity } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { mockContacts, mockTasks, mockRecords, mockTags } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type TimeRange = "week" | "month" | "quarter"

export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month")

  // 统计数据
  const stats = {
    totalContacts: mockContacts.length,
    sLevelContacts: mockContacts.filter((c) => c.level === 'S').length,
    totalInteractions: mockRecords.length,
    pendingTasks: mockTasks.filter((r) => r.status === 'pending').length,
    completedTasks: mockTasks.filter((r) => r.status === 'completed').length,
  }

  // 标签分布 (Mock Data)
  const tagDistribution = mockTags.map((tag) => ({
      ...tag,
      percentage: Math.round((tag.count / stats.totalContacts) * 100) || 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // 活跃度数据（模拟）
  const activityData = [
    { day: "周一", count: 3 },
    { day: "周二", count: 5 },
    { day: "周三", count: 2 },
    { day: "周四", count: 7 },
    { day: "周五", count: 4 },
    { day: "周六", count: 1 },
    { day: "周日", count: 2 },
  ]
  const maxActivity = Math.max(...activityData.map((d) => d.count))

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="人脉大盘" />

      <main className="px-4 py-4 space-y-6">
        {/* 核心数据 */}
        <section>
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">核心资产</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={Users}
              label="人脉总数"
              value={stats.totalContacts}
              iconClassName="bg-blue-100 text-blue-600"
            />
            <StatCard
              icon={Star}
              label="S级核心"
              value={stats.sLevelContacts}
              iconClassName="bg-amber-100 text-amber-600"
            />
            <StatCard
              icon={MessageSquare}
              label="本月互动"
              value={stats.totalInteractions}
              trend={{ value: 12, isPositive: true }}
              iconClassName="bg-green-100 text-green-600"
            />
            <StatCard
              icon={Calendar}
              label="待办任务"
              value={stats.pendingTasks}
              iconClassName="bg-red-100 text-red-600"
            />
          </div>
        </section>

        {/* 活跃度 */}
        <section className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2 text-sm">
              <Activity className="w-5 h-5 text-primary" />
              互动频率趋势
            </h3>
            <span className="text-xs text-muted-foreground">
              本周共 {activityData.reduce((sum, d) => sum + d.count, 0)} 次
            </span>
          </div>
          <div className="flex items-end justify-between gap-2 h-32">
            {activityData.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center">
                  <span className="text-[10px] text-muted-foreground mb-1">{item.count}</span>
                  <div
                    className="w-full bg-primary/10 rounded-t-md transition-all"
                    style={{
                      height: `${(item.count / maxActivity) * 80}px`,
                      minHeight: "4px",
                    }}
                  >
                    <div
                      className="w-full h-full bg-primary rounded-t-md"
                      style={{ opacity: item.count / maxActivity + 0.3 }}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground">{item.day}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 资源分布 */}
        <section className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm">
            <PieChart className="w-5 h-5 text-primary" />
            资源标签分布
          </h3>
          <div className="space-y-4">
            {tagDistribution.map((tag) => (
              <div key={tag.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{tag.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {tag.count} 人
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${tag.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 任务完成率 */}
        <section className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm">
            <TrendingUp className="w-5 h-5 text-primary" />
            任务执行力
          </h3>
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted/30"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(stats.completedTasks / (stats.completedTasks + stats.pendingTasks || 1)) * 226} 226`}
                  className="text-green-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold">
                  {Math.round((stats.completedTasks / (stats.completedTasks + stats.pendingTasks || 1)) * 100)}%
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  已完成
                </span>
                <span className="font-bold text-sm">{stats.completedTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-muted" />
                  待处理
                </span>
                <span className="font-bold text-sm">{stats.pendingTasks}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
