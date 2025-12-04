"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, Clock, Cake, ChevronRight, Plus, Search } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { TaskCard } from "@/components/task-card"
import { ContactCard } from "@/components/contact-card"
import { mockContacts, mockTasks, getDaysSinceLastContact, getDaysUntilBirthday } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function TodayPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState(mockTasks)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // 逾期任务
  const overdueTasks = useMemo(
    () =>
      tasks
        .filter((t) => !t.isCompleted && new Date(t.dueDate) < today)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
    [tasks, today],
  )

  // 今日预约/待办
  const todayTasks = useMemo(
    () =>
      tasks
        .filter((t) => {
          const dueDate = new Date(t.dueDate)
          dueDate.setHours(0, 0, 0, 0)
          return !t.isCompleted && dueDate.getTime() === today.getTime()
        })
        .sort((a, b) => {
          // 高优先级排前面
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        }),
    [tasks, today],
  )

  // 今日预约客户（预约类型的任务）
  const todayAppointments = useMemo(
    () => todayTasks.filter((t) => t.type === "appointment"),
    [todayTasks],
  )

  // 长时间未到店的客人
  const needServiceClients = useMemo(
    () =>
      mockContacts
        .filter((c) => {
          const lastService = c.lastService || c.lastContact
          const frequency = c.serviceFrequency || c.contactFrequency || 30
          if (!lastService) return false
          const days = getDaysSinceLastContact(lastService)
          return days > frequency
        })
        .sort((a, b) => {
          const lastA = a.lastService || a.lastContact
          const lastB = b.lastService || b.lastContact
          const freqA = a.serviceFrequency || a.contactFrequency || 30
          const freqB = b.serviceFrequency || b.contactFrequency || 30
          const daysA = getDaysSinceLastContact(lastA) - freqA
          const daysB = getDaysSinceLastContact(lastB) - freqB
          return daysB - daysA // 超期越多越靠前
        })
        .slice(0, 3),
    [],
  )

  // 近期生日（7天内）
  const upcomingBirthdays = useMemo(
    () =>
      mockContacts
        .filter((c) => {
          if (!c.birthday) return false
          const days = getDaysUntilBirthday(c.birthday)
          return days >= 0 && days <= 7
        })
        .sort((a, b) => {
          const daysA = getDaysUntilBirthday(a.birthday!)
          const daysB = getDaysUntilBirthday(b.birthday!)
          return daysA - daysB
        }),
    [],
  )

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted, completedAt: new Date().toISOString() } : t)),
    )
  }

  // 统计
  const stats = {
    overdue: overdueTasks.length,
    today: todayTasks.length,
    appointments: todayAppointments.length,
    needService: needServiceClients.length,
  }

  const hasUrgentItems = stats.overdue > 0 || stats.needService > 0

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 顶部区域 */}
      <header
        className={cn(
          "px-4 pt-12 pb-5 safe-area-top",
          hasUrgentItems ? "bg-urgent text-urgent-foreground" : "bg-primary text-primary-foreground",
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm opacity-80">
              {new Date().toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "long" })}
            </p>
            <h1 className="text-xl font-bold mt-0.5">{hasUrgentItems ? "有事要处理" : "今日行动"}</h1>
          </div>
          <button
            onClick={() => router.push("/contacts/search")}
            className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* 快捷统计 */}
        <div className="grid grid-cols-3 gap-2">
          <div className={cn("rounded-xl p-3 text-center", stats.overdue > 0 ? "bg-white/20" : "bg-white/10")}>
            <p className="text-2xl font-bold">{stats.overdue}</p>
            <p className="text-xs opacity-80">已逾期</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{stats.appointments || stats.today}</p>
            <p className="text-xs opacity-80">{stats.appointments > 0 ? "今日预约" : "今日待办"}</p>
          </div>
          <div className={cn("rounded-xl p-3 text-center", stats.needService > 0 ? "bg-white/20" : "bg-white/10")}>
            <p className="text-2xl font-bold">{stats.needService}</p>
            <p className="text-xs opacity-80">未到店</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-5">
        {/* 逾期任务 - 必须做 */}
        {overdueTasks.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-urgent" />
              <h2 className="font-semibold text-urgent">已逾期</h2>
              <span className="text-xs text-urgent bg-urgent/10 px-1.5 py-0.5 rounded">{overdueTasks.length}</span>
            </div>
            <div className="space-y-2">
              {overdueTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleTask}
                  onClick={() => router.push(`/tasks/${task.id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* 今日预约 */}
        {todayAppointments.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <h2 className="font-semibold">今日预约</h2>
                <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                  {todayAppointments.length}
                </span>
              </div>
              <button onClick={() => router.push("/tasks")} className="text-sm text-primary flex items-center">
                全部 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {todayAppointments.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleTask}
                  onClick={() => router.push(`/tasks/${task.id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* 今日待办（承诺、关怀、生日等） */}
        {(() => {
          const todayOtherTasks = todayTasks.filter(
            (t) => t.type !== "appointment" && (t.type === "promise" || t.type === "care" || t.type === "birthday"),
          )
          return (
            <section>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <h2 className="font-semibold">今天要做</h2>
                  {todayOtherTasks.length > 0 && (
                    <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      {todayOtherTasks.length}
                    </span>
                  )}
                </div>
                <button onClick={() => router.push("/tasks")} className="text-sm text-primary flex items-center">
                  全部 <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              {todayOtherTasks.length > 0 ? (
                <div className="space-y-2">
                  {todayOtherTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleTask}
                      onClick={() => router.push(`/tasks/${task.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground text-sm bg-muted/50 rounded-xl">
                  <p>今天没有待办事项</p>
                  <button
                    onClick={() => router.push("/tasks/new")}
                    className="mt-2 text-primary text-xs underline"
                  >
                    创建待办
                  </button>
                </div>
              )}
            </section>
          )
        })()}

        {/* 长时间未到店的客人 */}
        {needServiceClients.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <h2 className="font-semibold">长时间未到店</h2>
              </div>
              <button
                onClick={() => router.push("/contacts/need-service")}
                className="text-sm text-primary flex items-center"
              >
                更多 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {needServiceClients.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
            </div>
          </section>
        )}

        {/* 近期生日 */}
        {upcomingBirthdays.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Cake className="w-4 h-4 text-pink-500" />
              <h2 className="font-semibold">生日提醒</h2>
            </div>
            <div className="space-y-2">
              {upcomingBirthdays.map((contact) => {
                const days = getDaysUntilBirthday(contact.birthday!)
                return (
                  <div
                    key={contact.id}
                    onClick={() => router.push(`/contacts/${contact.id}`)}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-950/30 dark:to-orange-950/30 rounded-xl border border-pink-100 dark:border-pink-900/50 touch-active"
                  >
                    <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-medium">
                      {contact.name.slice(0, 1)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-xs text-pink-600 dark:text-pink-400">
                        {days === 0 ? "今天生日！" : `${days}天后生日`}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-pink-400" />
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* 快捷操作 */}
        <section className="pt-2">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.push("/contacts/new")}
              className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border touch-active"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <span className="font-medium">添加客人</span>
            </button>
            <button
              onClick={() => router.push("/tasks/new")}
              className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border touch-active"
            >
              <div className="w-10 h-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <span className="font-medium">新建待办</span>
            </button>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
