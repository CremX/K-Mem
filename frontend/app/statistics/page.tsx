"use client"

import { useState } from "react"
import { Users, MessageSquare, Calendar, TrendingUp, Star, Tag } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { mockContacts, mockReminders, mockCommunications, mockTags } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type TimeRange = "week" | "month" | "quarter"

export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month")

  // 统计数据
  const stats = {
    totalContacts: mockContacts.length,
    favoriteContacts: mockContacts.filter((c) => c.isFavorite).length,
    totalCommunications: mockCommunications.length,
    completedReminders: mockReminders.filter((r) => r.isCompleted).length,
    pendingReminders: mockReminders.filter((r) => !r.isCompleted).length,
  }

  // 标签分布
  const tagDistribution = mockTags
    .map((tag) => ({
      ...tag,
      percentage: Math.round((tag.count / stats.totalContacts) * 100),
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
      <PageHeader title="数据统计" />

      <main className="px-4 py-4 space-y-6">
        {/* 时间范围选择 */}
        <div className="flex gap-2">
          {[
            { value: "week", label: "本周" },
            { value: "month", label: "本月" },
            { value: "quarter", label: "本季度" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value as TimeRange)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                timeRange === option.value ? "bg-primary text-primary-foreground" : "bg-card border border-border",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* 核心数据 */}
        <section>
          <h2 className="text-lg font-semibold mb-3">核心数据</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={Users}
              label="联系人总数"
              value={stats.totalContacts}
              iconClassName="bg-blue-100 text-blue-600"
            />
            <StatCard
              icon={Star}
              label="常联系"
              value={stats.favoriteContacts}
              iconClassName="bg-yellow-100 text-yellow-600"
            />
            <StatCard
              icon={MessageSquare}
              label="沟通记录"
              value={stats.totalCommunications}
              trend={{ value: 12, isPositive: true }}
              iconClassName="bg-green-100 text-green-600"
            />
            <StatCard
              icon={Calendar}
              label="已完成提醒"
              value={stats.completedReminders}
              iconClassName="bg-purple-100 text-purple-600"
            />
          </div>
        </section>

        {/* 本周活跃度 */}
        <section className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              本周活跃度
            </h3>
            <span className="text-sm text-muted-foreground">
              共 {activityData.reduce((sum, d) => sum + d.count, 0)} 次互动
            </span>
          </div>
          <div className="flex items-end justify-between gap-2 h-32">
            {activityData.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center">
                  <span className="text-xs text-muted-foreground mb-1">{item.count}</span>
                  <div
                    className="w-full bg-primary/20 rounded-t-md transition-all"
                    style={{
                      height: `${(item.count / maxActivity) * 80}px`,
                      minHeight: "8px",
                    }}
                  >
                    <div
                      className="w-full h-full bg-primary rounded-t-md"
                      style={{ opacity: item.count / maxActivity }}
                    />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{item.day}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 标签分布 */}
        <section className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            联系人标签分布
          </h3>
          <div className="space-y-3">
            {tagDistribution.map((tag) => (
              <div key={tag.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{tag.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {tag.count} 人 ({tag.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${tag.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 提醒完成情况 */}
        <section className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            提醒完成情况
          </h3>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(stats.completedReminders / (stats.completedReminders + stats.pendingReminders)) * 251.2} 251.2`}
                  className="text-primary"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">
                  {Math.round((stats.completedReminders / (stats.completedReminders + stats.pendingReminders)) * 100)}%
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  已完成
                </span>
                <span className="font-medium">{stats.completedReminders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-muted" />
                  待处理
                </span>
                <span className="font-medium">{stats.pendingReminders}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
