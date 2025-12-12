"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, AlertTriangle, Clock, Calendar, CheckCircle2 } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { PageHeader } from "@/components/page-header"
import { TaskCard } from "@/components/task-card"
import { mockTasks, type Task } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type FilterTab = "overdue" | "today" | "upcoming" | "completed"

export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<FilterTab>("today")

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // 分类任务
  const categorizedTasks = useMemo(() => {
    const overdue: Task[] = []
    const todayTasks: Task[] = []
    const upcoming: Task[] = []
    const completed: Task[] = []

    tasks.forEach((task) => {
      // 搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!task.title.toLowerCase().includes(query) && !task.contactName?.toLowerCase().includes(query)) {
          return
        }
      }

      if (task.isCompleted) {
        completed.push(task)
        return
      }

      const dueDate = new Date(task.dueDate)
      dueDate.setHours(0, 0, 0, 0)

      if (dueDate < today) {
        overdue.push(task)
      } else if (dueDate.getTime() === today.getTime()) {
        todayTasks.push(task)
      } else {
        upcoming.push(task)
      }
    })

    // 排序
    const sortByPriority = (a: Task, b: Task) => {
      const order = { high: 0, medium: 1, low: 2 }
      return order[a.priority] - order[b.priority]
    }

    overdue.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    todayTasks.sort(sortByPriority)
    upcoming.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    completed.sort(
      (a, b) => new Date(b.completedAt || b.dueDate).getTime() - new Date(a.completedAt || a.dueDate).getTime(),
    )

    return { overdue, today: todayTasks, upcoming, completed }
  }, [tasks, searchQuery, today])

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              isCompleted: !t.isCompleted,
              completedAt: !t.isCompleted ? new Date().toISOString() : undefined,
            }
          : t,
      ),
    )
  }

  const tabs = [
    {
      key: "overdue" as FilterTab,
      label: "逾期",
      count: categorizedTasks.overdue.length,
      icon: AlertTriangle,
      color: "text-urgent",
      bgColor: "bg-urgent",
    },
    {
      key: "today" as FilterTab,
      label: "今天",
      count: categorizedTasks.today.length,
      icon: Clock,
      color: "text-primary",
      bgColor: "bg-primary",
    },
    {
      key: "upcoming" as FilterTab,
      label: "以后",
      count: categorizedTasks.upcoming.length,
      icon: Calendar,
      color: "text-muted-foreground",
      bgColor: "bg-muted-foreground",
    },
    {
      key: "completed" as FilterTab,
      label: "已完成",
      count: categorizedTasks.completed.length,
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success",
    },
  ]

  const currentTasks = categorizedTasks[activeTab]

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader
        title="待办"
        rightContent={
          <button
            onClick={() => router.push("/tasks/new")}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        }
      />

      <main className="px-4 py-4">
        {/* 搜索框 */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索待办或客户名..."
            className="w-full pl-10 pr-4 py-3 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* 分类标签 */}
        <div className="flex gap-2 mb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-colors",
                  isActive ? `${tab.bgColor} text-white` : "bg-card border border-border",
                )}
              >
                <div className="flex items-center gap-1">
                  <Icon className={cn("w-4 h-4", !isActive && tab.color)} />
                  <span className={cn("text-lg font-bold", !isActive && tab.color)}>{tab.count}</span>
                </div>
                <span className={cn("text-xs", !isActive && "text-muted-foreground")}>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* 任务列表 */}
        {currentTasks.length > 0 ? (
          <div className="space-y-2">
            {currentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleTask}
                onClick={() => router.push(`/tasks/${task.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-muted-foreground mb-4">
              {activeTab === "overdue" && "没有逾期任务"}
              {activeTab === "today" && "今天没有待办"}
              {activeTab === "upcoming" && "暂无计划任务"}
              {activeTab === "completed" && "还没有完成的任务"}
            </p>
            {activeTab !== "completed" && (
              <button
                onClick={() => router.push("/tasks/new")}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
              >
                新建待办
              </button>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
