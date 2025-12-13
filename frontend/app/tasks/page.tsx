"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, CheckCircle2, Zap, Coffee, Moon, Sun } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { TaskCard } from "@/components/task-card"
import { mockTasks, type Task } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// 定义精力时段类型
type EnergyMode = "focus" | "routine" | "review" | "rest"

export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [searchQuery, setSearchQuery] = useState("")
  
  // 核心状态：精力模式
  const [currentMode, setCurrentMode] = useState<EnergyMode>("focus")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentTime, setCurrentTime] = useState(new Date())

  // 初始化检测时间
  useEffect(() => {
    const updateMode = () => {
        const hour = new Date().getHours()
        // 9:00 - 12:00 -> 攻坚 (Focus)
        if (hour >= 9 && hour < 12) setCurrentMode("focus")
        // 14:00 - 17:00 -> 耕耘 (Routine)
        else if (hour >= 14 && hour < 17) setCurrentMode("routine")
        // 17:00 - 20:00 -> 复盘 (Review)
        else if (hour >= 17 && hour < 20) setCurrentMode("review")
        // 其他 -> 休息/自由 (Rest)
        else setCurrentMode("rest")
        
        setCurrentTime(new Date())
    }
    updateMode()
    const timer = setInterval(updateMode, 60000) // 每分钟检查
    return () => clearInterval(timer)
  }, [])

  // 核心逻辑：智能任务筛选与排序
  const { todoTasks, completedTasks, stats } = useMemo(() => {
    let filtered = tasks.filter(t => !t.isCompleted) // 只看未完成
    const completed = tasks.filter(t => t.isCompleted)

    // 搜索
    if (searchQuery) {
        const q = searchQuery.toLowerCase()
        filtered = filtered.filter(t => 
            t.title.toLowerCase().includes(q) || 
            t.contactName?.toLowerCase().includes(q)
        )
    }

    // 智能排序：根据当前模式调整权重
    filtered.sort((a, b) => {
        // 1. 逾期永远置顶
        const isOverdueA = new Date(a.dueDate) < new Date(new Date().setHours(0,0,0,0))
        const isOverdueB = new Date(b.dueDate) < new Date(new Date().setHours(0,0,0,0))
        if (isOverdueA !== isOverdueB) return isOverdueA ? -1 : 1

        // 2. 模式权重
        if (currentMode === "focus") {
            // 攻坚模式：High Priority > Time > Others
            const pOrder = { high: 0, medium: 1, low: 2 }
            if (a.priority !== b.priority) return pOrder[a.priority] - pOrder[b.priority]
        } 
        else if (currentMode === "routine") {
            // 耕耘模式：Medium/Low (Routine) 稍微优先，或者按时间
            // 这里我们保持 High 在前，但视觉上会做区分
            const pOrder = { high: 0, medium: 1, low: 2 }
            if (a.priority !== b.priority) return pOrder[a.priority] - pOrder[b.priority]
        }

        // 3. 默认按时间
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })

    return { 
        todoTasks: filtered, 
        completedTasks: completed,
        stats: {
            total: tasks.length,
            done: completed.length,
            highPriority: filtered.filter(t => t.priority === 'high').length
        }
    }
  }, [tasks, searchQuery, currentMode])

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted, completedAt: !t.isCompleted ? new Date().toISOString() : undefined } : t))
  }

  // 模式配置
  const modeConfig = {
      focus: {
          title: "🔥 黄金攻坚时段",
          desc: "精力最充沛的时刻，请优先处理「高价值」与「逼单」任务。",
          bg: "bg-gradient-to-br from-orange-500/10 to-red-500/5 border-orange-500/20",
          icon: Zap,
          iconColor: "text-orange-500"
      },
      routine: {
          title: "🌱 耕耘种草时段",
          desc: "适合批量触达、发资料、处理日常事务。",
          bg: "bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/20",
          icon: Coffee,
          iconColor: "text-emerald-600"
      },
      review: {
          title: "🌇 每日复盘时刻",
          desc: "清点今日战果，淘汰无效客户，安心下班。",
          bg: "bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border-indigo-500/20",
          icon: Moon,
          iconColor: "text-indigo-500"
      },
      rest: {
          title: "☕ 自由/准备时间",
          desc: "做好准备，或享受生活。销售不是马拉松，是短跑。",
          bg: "bg-muted/30 border-border",
          icon: Sun,
          iconColor: "text-muted-foreground"
      }
  }[currentMode]

  return (
    <div className="flex flex-col h-screen bg-background relative overflow-hidden">
      {/* 顶部装饰 */}
      <div className={cn("absolute top-0 left-0 right-0 h-64 opacity-20 pointer-events-none transition-colors duration-1000", 
          currentMode === 'focus' ? "bg-orange-500/20" : 
          currentMode === 'routine' ? "bg-emerald-500/20" : 
          currentMode === 'review' ? "bg-indigo-500/20" : "bg-muted/20"
      )} />

      {/* Header */}
      <header className="pt-12 px-5 pb-4 relative z-10 shrink-0">
          <div className="flex justify-between items-start mb-6">
              <div>
                  <h1 className="text-3xl font-serif font-bold text-foreground">今日<span className="text-primary">作战</span></h1>
                  <p className="text-xs text-muted-foreground font-mono mt-1 opacity-70">
                      {new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
              </div>
              <button
                onClick={() => router.push("/tasks/new")}
                className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
          </div>

          {/* 精力模式卡片 (Energy Card) */}
          <div className={cn("rounded-2xl p-4 border transition-all duration-500 relative overflow-hidden", modeConfig.bg)}>
              <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                      <modeConfig.icon className={cn("w-5 h-5", modeConfig.iconColor)} />
                      <h2 className={cn("font-bold text-sm tracking-wide", modeConfig.iconColor)}>{modeConfig.title}</h2>
                  </div>
                  <p className="text-xs text-muted-foreground/80 leading-relaxed max-w-[90%]">
                      {modeConfig.desc}
                  </p>
              </div>
              
              {/* 动态进度展示 */}
              {currentMode === 'focus' && stats.highPriority > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-orange-700 dark:text-orange-400 bg-white/50 dark:bg-black/20 p-2 rounded-lg w-fit backdrop-blur-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                      </span>
                      还有 {stats.highPriority} 个攻坚任务待完成
                  </div>
              )}
          </div>
      </header>

      {/* Main List */}
      <main className="flex-1 overflow-y-auto px-5 pb-24 relative z-10">
          
          {/* 搜索 */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索任务..."
                className="w-full pl-10 pr-4 py-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-all shadow-sm"
            />
          </div>

          {/* 任务列表 */}
          <div className="space-y-3">
              {todoTasks.length > 0 ? (
                  todoTasks.map((task, index) => (
                      <div key={task.id} className="animate-in slide-in-from-bottom-2 fade-in duration-500" style={{animationDelay: `${index * 50}ms`}}>
                          <TaskCard
                            task={task}
                            onToggleComplete={handleToggleTask}
                            onClick={() => router.push(`/tasks/${task.id}`)}
                            // 在攻坚模式下，非高优先级任务半透明显示，聚焦注意力
                            className={cn(
                                currentMode === 'focus' && task.priority !== 'high' && "opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0 transition-all"
                            )}
                          />
                      </div>
                  ))
              ) : (
                  <div className="py-12 text-center">
                      <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                      <p className="text-muted-foreground text-sm">今日待办已清空</p>
                      {currentMode === 'review' && (
                          <p className="text-xs text-indigo-500 mt-2 font-medium">✨ 完美的一天，早点休息！</p>
                      )}
                  </div>
              )}
          </div>

          {/* 已完成 (折叠/沉底) */}
          {completedTasks.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border/40">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3" />
                      今日战绩 ({completedTasks.length})
                  </h3>
                  <div className="space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                      {completedTasks.map(task => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onToggleComplete={handleToggleTask}
                            onClick={() => router.push(`/tasks/${task.id}`)}
                          />
                      ))}
                  </div>
              </div>
          )}
      </main>

      <BottomNav />
    </div>
  )
}
