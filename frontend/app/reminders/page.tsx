"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Filter, Calendar } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { PageHeader } from "@/components/page-header"
import { ReminderCard } from "@/components/reminder-card"
import { EmptyState } from "@/components/empty-state"
import { mockReminders, type Reminder } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type FilterStatus = "all" | "pending" | "completed"
type FilterType = "all" | "follow_up" | "birthday" | "meeting" | "call" | "custom"

export default function RemindersPage() {
  const router = useRouter()
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("pending")
  const [filterType, setFilterType] = useState<FilterType>("all")
  const [showFilters, setShowFilters] = useState(false)

  const filteredReminders = useMemo(() => {
    let result = [...reminders]

    // 搜索
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.contactName?.toLowerCase().includes(query) ||
          r.description?.toLowerCase().includes(query),
      )
    }

    // 状态筛选
    if (filterStatus === "pending") {
      result = result.filter((r) => !r.isCompleted)
    } else if (filterStatus === "completed") {
      result = result.filter((r) => r.isCompleted)
    }

    // 类型筛选
    if (filterType !== "all") {
      result = result.filter((r) => r.type === filterType)
    }

    // 按日期排序
    result.sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })

    return result
  }, [reminders, searchQuery, filterStatus, filterType])

  const handleToggleComplete = (id: string) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r)))
  }

  // 统计数据
  const pendingCount = reminders.filter((r) => !r.isCompleted).length
  const todayCount = reminders.filter(
    (r) => !r.isCompleted && new Date(r.dueDate).toDateString() === new Date().toDateString(),
  ).length
  const overdueCount = reminders.filter((r) => !r.isCompleted && new Date(r.dueDate) < new Date()).length

  const typeLabels = {
    all: "全部",
    follow_up: "跟进",
    birthday: "生日",
    meeting: "会议",
    call: "电话",
    custom: "自定义",
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title="提醒"
        rightContent={
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "p-2 rounded-full transition-colors",
                showFilters ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push("/reminders/new")}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        }
      />

      <main className="px-4 py-4">
        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-card rounded-xl border border-border p-3 text-center">
            <p className="text-2xl font-bold text-primary">{todayCount}</p>
            <p className="text-xs text-muted-foreground">今日待办</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-3 text-center">
            <p className="text-2xl font-bold">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">待处理</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-3 text-center">
            <p className={cn("text-2xl font-bold", overdueCount > 0 && "text-destructive")}>{overdueCount}</p>
            <p className="text-xs text-muted-foreground">已逾期</p>
          </div>
        </div>

        {/* 搜索框 */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索提醒..."
            className="w-full pl-10 pr-4 py-3 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* 状态筛选 */}
        <div className="flex gap-2 mb-4">
          {[
            { value: "pending", label: "待办" },
            { value: "completed", label: "已完成" },
            { value: "all", label: "全部" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilterStatus(option.value as FilterStatus)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                filterStatus === option.value ? "bg-primary text-primary-foreground" : "bg-card border border-border",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* 类型筛选 */}
        {showFilters && (
          <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4 pb-1">
            {Object.entries(typeLabels).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilterType(value as FilterType)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors",
                  filterType === value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* 提醒列表 */}
        {filteredReminders.length > 0 ? (
          <div className="space-y-2">
            {filteredReminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onToggleComplete={handleToggleComplete}
                onClick={() => router.push(`/reminders/${reminder.id}`)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title="没有提醒"
            description={filterStatus === "completed" ? "还没有已完成的提醒" : "添加一个提醒开始管理待办事项"}
            action={{
              label: "新建提醒",
              onClick: () => router.push("/reminders/new"),
            }}
          />
        )}
      </main>

      <BottomNav />
    </div>
  )
}
