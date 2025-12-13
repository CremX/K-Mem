"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Filter, Calendar, Clock, Gift, Flag } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { ReminderCard } from "@/components/reminder-card"
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
    <div className="min-h-screen bg-background pb-24 relative overflow-hidden transition-colors duration-500">
      {/* 背景装饰：与全站统一的极简光晕 */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] pointer-events-none -translate-x-1/4 -translate-y-1/4 dark:opacity-30"></div>

      <header className="pt-16 px-6 pb-2 relative z-10 shrink-0">
          <div className="flex justify-between items-start mb-8">
              <div className="flex flex-col items-start max-w-[70%]">
                  <div className="text-[10px] text-primary dark:text-secondary font-bold tracking-[0.2em] uppercase mb-2 border border-primary/20 px-3 py-1 rounded-full inline-flex items-center gap-2 bg-background/50 backdrop-blur-sm shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_5px_var(--primary)]"></span>
                    {pendingCount} 个待办事项
                  </div>
                  <h1 className="text-4xl font-serif font-bold text-foreground leading-[1.1] tracking-tight mt-1">
                      纪念日<span className="text-primary ml-1 drop-shadow-sm italic text-2xl font-sans font-light opacity-60">Concierge</span>
                  </h1>
              </div>
              <div className="flex gap-3 shrink-0 self-end mb-1">
                 <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                        "w-11 h-11 rounded-full flex items-center justify-center border transition-all active:scale-95 shadow-soft group",
                        showFilters 
                            ? "bg-primary text-primary-foreground border-primary shadow-gold" 
                            : "glass-light dark:glass-dark border-border text-muted-foreground hover:border-primary/50"
                    )}
                >
                    <Filter className="w-5 h-5 stroke-[1.5px] group-hover:stroke-primary transition-colors" />
                </button>
                <button
                    onClick={() => router.push("/reminders/new")}
                    className="w-11 h-11 rounded-full btn-primary flex items-center justify-center shadow-gold hover:opacity-90 active:scale-95 transition-all p-0"
                >
                    <Plus className="w-6 h-6 stroke-[2px]" />
                </button>
              </div>
          </div>

          {/* 统计概览 - 卡片化 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="card-executive p-4 flex flex-col items-center justify-center gap-1 group cursor-default">
                  <div className="text-2xl font-serif font-bold text-primary group-hover:scale-110 transition-transform">{todayCount}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">今日待办</div>
              </div>
              <div className="card-executive p-4 flex flex-col items-center justify-center gap-1 group cursor-default">
                  <div className="text-2xl font-serif font-bold text-foreground group-hover:scale-110 transition-transform">{pendingCount}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">总待处理</div>
              </div>
              <div className="card-executive p-4 flex flex-col items-center justify-center gap-1 group cursor-default border-destructive/20 bg-destructive/5">
                  <div className={cn("text-2xl font-serif font-bold group-hover:scale-110 transition-transform", overdueCount > 0 ? "text-destructive" : "text-muted-foreground")}>{overdueCount}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium text-destructive/80">已逾期</div>
              </div>
          </div>

          <div className="relative mb-8 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors stroke-[1.5px]" />
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索提醒..."
                className="w-full pl-12 pr-6 py-4 glass-light dark:glass-dark border border-border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-soft group-hover:shadow-elevated font-medium tracking-wide"
            />
          </div>
      </header>

      <main className="px-6 relative z-10 flex-1 overflow-y-auto hide-scrollbar">
        
        {/* 筛选栏 - 胶囊风格 */}
        <div className="w-full overflow-x-auto hide-scrollbar -mx-6 px-6 mb-8 snap-x">
            <div className="flex items-center gap-3 min-w-full w-max">
                <button
                    onClick={() => setFilterStatus("pending")}
                    className={cn(
                        "flex-none h-9 px-5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border snap-start flex items-center justify-center tracking-[0.1em] uppercase",
                        filterStatus === "pending" 
                            ? "bg-primary text-primary-foreground border-primary shadow-[0_2px_8px_rgba(var(--primary),0.25)] translate-y-[-1px]" 
                            : "bg-card/50 backdrop-blur-sm border-border text-muted-foreground hover:bg-muted/20"
                    )}
                >
                    待处理
                </button>
                <button
                    onClick={() => setFilterStatus("completed")}
                    className={cn(
                        "flex-none h-9 px-5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border snap-start flex items-center justify-center tracking-[0.1em] uppercase",
                        filterStatus === "completed" 
                            ? "bg-primary text-primary-foreground border-primary shadow-[0_2px_8px_rgba(var(--primary),0.25)] translate-y-[-1px]" 
                            : "bg-card/50 backdrop-blur-sm border-border text-muted-foreground hover:bg-muted/20"
                    )}
                >
                    已完成
                </button>
                
                <div className="w-px h-4 bg-border/50 mx-1 shrink-0"></div>

                {showFilters && Object.entries(typeLabels).map(([value, label]) => (
                    <button
                        key={value}
                        onClick={() => setFilterType(value as FilterType)}
                        className={cn(
                            "flex-none h-9 px-4 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border flex items-center gap-2 snap-start tracking-wide uppercase",
                            filterType === value
                                ? "glass-dark dark:glass-dark light:glass-light border-primary/30 text-foreground shadow-sm ring-1 ring-primary/10 translate-y-[-1px]" 
                                : "bg-card/30 backdrop-blur-sm text-muted-foreground border-border/50 hover:bg-muted/20"
                        )}
                    >
                       {label}
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-5 pb-10 pr-6"> 
            {filteredReminders.length > 0 ? (
                filteredReminders.map((reminder) => (
                <ReminderCard 
                    key={reminder.id} 
                    reminder={reminder} 
                    onToggleComplete={handleToggleComplete}
                    onClick={() => router.push(`/reminders/${reminder.id}`)}
                />
                ))
            ) : (
                <div className="py-24 text-center flex flex-col items-center">
                    <div className="w-24 h-24 bg-card/30 rounded-full flex items-center justify-center mb-8 border border-dashed border-border group hover:border-primary/50 transition-colors">
                        <Calendar className="w-10 h-10 text-muted-foreground/40 group-hover:text-primary/50 transition-colors stroke-[1px]" />
                    </div>
                    <h3 className="text-foreground font-serif font-bold text-lg mb-2">暂无提醒</h3>
                    <p className="text-muted-foreground text-xs max-w-[200px] mb-8 tracking-wide">
                        {searchQuery ? `没有找到包含 "${searchQuery}" 的提醒` : "当前没有待处理的提醒"}
                    </p>
                    
                    <button
                        onClick={() => router.push("/reminders/new")}
                        className="btn-primary px-8 py-4 rounded-full font-bold shadow-gold hover:shadow-elevated hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 text-xs uppercase tracking-widest"
                    >
                        <Plus className="w-4 h-4" />
                        新建提醒
                    </button>
                </div>
            )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
