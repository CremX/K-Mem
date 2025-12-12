"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Star, MapPin, Clock, AlertTriangle, Bell, Calendar, ChevronRight } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { TaskCard } from "@/components/task-card"
import { QuickGlanceCard } from "@/components/quick-glance-card"
import { QuickEntryDrawer } from "@/components/quick-entry-drawer"
import { IcebreakerModal } from "@/components/icebreaker-modal"
import { AgendaView } from "@/components/agenda-view"
import { NotificationDrawer } from "@/components/notification-drawer"
import { mockContacts, mockTasks } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import type { Contact } from "@/lib/mock-data"

export default function TodayPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState(mockTasks)
  
  // 状态控制
  const [quickGlanceOpen, setQuickGlanceOpen] = useState(false)
  const [quickEntryOpen, setQuickEntryOpen] = useState(false)
  const [icebreakerOpen, setIcebreakerOpen] = useState(false)
  const [agendaOpen, setAgendaOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false) 
  const [activeContact, setActiveContact] = useState<Contact | null>(null)
  const [activeTaskTitle, setActiveTaskTitle] = useState<string>("")

  // --- 智能动态栏逻辑 ---
  // 模拟聚合的高优先级通知
  const smartNotifications = useMemo(() => [
      { id: 1, type: 'birthday', text: '王志刚 (S级) 3天后生日', contactId: '1' },
      { id: 2, type: 'overdue', text: '“寄茶样”任务已逾期', taskId: '2' },
  ], [])
  
  const [currentNotiIndex, setCurrentNotiIndex] = useState(0)

  // 轮播逻辑
  useEffect(() => {
      if (smartNotifications.length <= 1) return
      const timer = setInterval(() => {
          setCurrentNotiIndex(prev => (prev + 1) % smartNotifications.length)
      }, 5000) // 5秒轮播
      return () => clearInterval(timer)
  }, [smartNotifications.length])

  const currentNoti = smartNotifications[currentNotiIndex]
  // --------------------

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // 1. 获取今日所有待办
  const todaysTasks = useMemo(() => {
    return tasks.filter((t) => {
         if (t.status !== 'pending') return false;
         const dueDate = new Date(t.dueDate);
         dueDate.setHours(0,0,0,0);
         return dueDate.getTime() <= today.getTime();
    });
  }, [tasks, today]);

  // 2. 提取今日重点客户 (VIP Focus)
  const vipFocusItems = useMemo(() => {
    const items = todaysTasks.filter(t => {
        if (!t.contactId) return false;
        const contact = mockContacts.find(c => c.id === t.contactId);
        return contact && (contact.level === 'S' || contact.level === 'A');
    }).map(t => {
        const contact = mockContacts.find(c => c.id === t.contactId)!;
        return { task: t, contact };
    });

    return items.sort((a, b) => {
        if (a.contact.level !== b.contact.level) return a.contact.level === 'S' ? -1 : 1;
        return 0;
    });
  }, [todaysTasks]);

  // 3. 常规行动
  const routineItems = useMemo(() => {
    const vipTaskIds = new Set(vipFocusItems.map(i => i.task.id));
    return todaysTasks.filter(t => !vipTaskIds.has(t.id));
  }, [todaysTasks, vipFocusItems]);

  // 4. 关系预警
  const riskContacts = useMemo(() => {
    return mockContacts
      .filter((c) => {
        if (c.level !== 'S' && c.level !== 'A') return false;
        const lastDateStr = c.lastContactDate || c.createdAt
        const daysSince = Math.floor((new Date().getTime() - new Date(lastDateStr).getTime()) / (1000 * 60 * 60 * 24))
        const freq = c.interactionFrequency || 30
        return daysSince > freq;
      })
      .sort((a, b) => (a.level === 'S' ? -1 : 1))
      .slice(0, 3);
  }, []);

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed', completedAt: new Date().toISOString() } : t)),
    )
  }

  // 处理“签到记录”
  const handleQuickEntry = (taskTitle: string) => {
      setActiveTaskTitle(taskTitle)
      setQuickEntryOpen(true)
  }

  // 处理“查看档案”
  const handleQuickGlance = (contact: Contact) => {
      setActiveContact(contact)
      setQuickGlanceOpen(true)
  }

  // 处理“激活”
  const handleActivate = (e: React.MouseEvent, contact: Contact) => {
      e.stopPropagation() // 防止触发卡片跳转
      setActiveContact(contact)
      setIcebreakerOpen(true)
  }

  return (
    <div className="min-h-full pb-32 text-foreground relative">
      {/* 顶部装饰 */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-[#004D40]/5 dark:from-[#D4AF37]/5 to-transparent opacity-30 pointer-events-none translate-x-1/4 -translate-y-1/4 blur-[100px]"></div>

      {/* HEADER: 优化左右布局 */}
      <header className="pt-12 px-5 pb-2 relative z-10">
          <div className="flex justify-between items-end mb-6">
              <div className="flex flex-col items-start pb-1">
                  <h1 className="text-[32px] font-serif font-bold text-foreground leading-none tracking-tight">
                      早安，<br/>
                      <span className="text-primary dark:text-secondary mt-1 block">李董事长</span>
                  </h1>
              </div>
              
              <div className="flex flex-col items-end gap-4 self-start -mt-1">
                  <div className="text-[10px] text-muted-foreground font-bold tracking-widest font-serif border-b border-border pb-0.5">
                    {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })} · 宜拜访
                  </div>
                  
                  <button
                    onClick={() => setNotificationOpen(true)}
                    className="relative w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-sm hover:bg-muted transition-colors active:scale-95"
                  >
                      <Bell className="w-5 h-5 text-foreground" />
                      {smartNotifications.length > 0 && (
                          <span className="absolute top-2 right-2.5 w-2 h-2 bg-destructive rounded-full ring-2 ring-card animate-pulse"></span>
                      )}
                  </button>
              </div>
          </div>

          {/* === 智能动态栏 (Smart Dynamic Bar) === */}
          {smartNotifications.length > 0 && (
              <div 
                onClick={() => setNotificationOpen(true)}
                className="mb-6 relative overflow-hidden group cursor-pointer"
              >
                  <div className="absolute inset-0 bg-muted/40 backdrop-blur-sm rounded-xl border border-primary/10 dark:border-white/5" />
                  
                  <div className="relative px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                          {/* 动态图标 */}
                          <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
                              currentNoti.type === 'birthday' ? "bg-pink-100 text-pink-500" : "bg-red-100 text-red-500"
                          )}>
                              {currentNoti.type === 'birthday' ? <Calendar className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                          </div>
                          
                          {/* 动态文字 (带淡入淡出动画) */}
                          <div className="flex flex-col key={currentNoti.id} animate-in fade-in slide-in-from-bottom-1 duration-500">
                              <span className="text-xs font-bold text-foreground truncate max-w-[200px]">
                                  {currentNoti.text}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                  {smartNotifications.length} 条重要提醒，点击查看
                              </span>
                          </div>
                      </div>
                      
                      <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground transition-colors shrink-0" />
                  </div>
              </div>
          )}
      </header>

      <main className="px-5 space-y-8 relative z-10">
        
        {/* 模块 1: 全天焦点 */}
        <section>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                    <h2 className="text-lg font-serif font-bold text-foreground">全天焦点</h2>
                </div>
                <button 
                    onClick={() => setAgendaOpen(true)}
                    className="text-xs text-secondary font-bold hover:opacity-80 transition-opacity flex items-center gap-0.5"
                >
                    查看全部 <ArrowRight className="w-3 h-3" />
                </button>
            </div>

            {vipFocusItems.length > 0 ? (
                <div className={cn(
                    "flex gap-4 pb-4 -mx-5 px-5",
                    vipFocusItems.length > 1 ? "overflow-x-auto hide-scrollbar snap-x snap-mandatory" : ""
                )}>
                    {vipFocusItems.map(({ task, contact }) => (
                        <div 
                            key={task.id} 
                            className={cn(
                                "card-focus flex-shrink-0",
                                vipFocusItems.length > 1 ? "min-w-[90%] snap-center" : "w-full"
                            )}
                        >
                            <div className="flex gap-3 items-center mb-4">
                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 rounded-full border-2 border-secondary p-0.5 overflow-hidden bg-card">
                                        <img src="/placeholder-user.jpg" alt="avatar" className="w-full h-full object-cover rounded-full" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary rounded-full flex items-center justify-center text-white text-[8px] font-bold shadow-gold">
                                        {contact.level}
                                    </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-[18px] font-bold text-foreground truncate">
                                        {contact.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                        {contact.company} · {contact.title || "贵宾"}
                                    </p>
                                </div>
                            </div>

                            {/* 破冰策略 */}
                            <div className="bg-gray-50 dark:bg-muted/20 p-3 rounded-lg border-l-2 border-primary dark:border-secondary mb-4">
                                <p className="text-xs text-foreground leading-relaxed">
                                    <span className="text-primary dark:text-secondary font-bold">💡 破冰策略：</span>
                                    {task.title}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {task.dueTime || "14:00 会面"}
                                </span>
                                {contact.company && (
                                    <span className="flex items-center gap-1 flex-1 truncate">
                                        <MapPin className="w-3 h-3 shrink-0" /> {contact.company}
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleQuickEntry(task.title)}
                                    className="flex-1 bg-primary dark:bg-secondary text-primary-foreground dark:text-secondary-foreground text-xs py-2.5 rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 shadow-md"
                                >
                                    签到记录
                                </button>
                                <button 
                                    onClick={() => handleQuickGlance(contact)}
                                    className="flex-1 bg-transparent border border-border text-foreground text-xs py-2.5 rounded-lg font-bold hover:bg-accent hover:text-accent-foreground transition-all active:scale-95"
                                >
                                    查看档案
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-5 bg-card rounded-[20px] border border-dashed border-border text-center">
                    <p className="text-muted-foreground text-xs mb-2">今日暂无 VIP 客户待办</p>
                    <button onClick={() => router.push('/contacts')} className="text-[10px] text-secondary font-bold hover:underline">
                        从名录中挖掘机会
                    </button>
                </div>
            )}
        </section>

        {/* 模块 2: 关系预警 */}
        {riskContacts.length > 0 && (
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <h2 className="text-lg font-serif font-bold text-foreground">关系预警</h2>
                </div>
                
                <div className="space-y-3">
                    {riskContacts.map(contact => {
                        const days = Math.floor((new Date().getTime() - new Date(contact.lastContactDate || contact.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                        return (
                            <div 
                                key={contact.id} 
                                className="flex items-center justify-between p-4 bg-card border-l-2 border-destructive rounded-2xl transition-all cursor-pointer group hover:shadow-soft"
                                onClick={() => router.push(`/contacts/${contact.id}`)}
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground font-serif font-bold group-hover:text-foreground transition-colors shrink-0">
                                        {contact.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-base font-bold text-foreground truncate">{contact.name}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            <span className="inline-flex items-center bg-destructive/10 text-destructive px-1.5 py-0.5 rounded font-medium text-[10px] mr-1">
                                                {contact.level}级
                                            </span>
                                            {days}天未联系
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={(e) => handleActivate(e, contact)}
                                    className="text-xs font-medium text-destructive px-3 py-1.5 rounded-lg border border-destructive/30 hover:bg-destructive/10 transition-colors shrink-0"
                                >
                                    激活
                                </button>
                            </div>
                        )
                    })}
                </div>
            </section>
        )}

        {/* 模块 3: 常规事务 */}
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-serif font-bold text-foreground">常规事务</h2>
                <button onClick={() => router.push("/tasks")} className="text-xs font-bold text-secondary hover:opacity-80 flex items-center gap-1 transition-opacity">
                    全部 <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>

            {routineItems.length > 0 ? (
                <div className="space-y-3">
                    {routineItems.map(task => (
                        <TaskCard 
                            key={task.id}
                            task={task} 
                            onToggleComplete={handleToggleTask}
                            onClick={() => router.push(`/tasks/${task.id}`)}
                            showContact={true}
                        />
                    ))}
                </div>
            ) : (
                <div className="py-6 text-center border border-dashed border-border rounded-2xl bg-muted/30">
                    <p className="text-muted-foreground text-sm">杂事已清，专注核心</p>
                </div>
            )}
        </section>

      </main>

      <BottomNav />

      {/* 弹窗组件集成 */}
      {activeContact && (
          <>
            <QuickGlanceCard 
                isOpen={quickGlanceOpen} 
                onClose={() => setQuickGlanceOpen(false)} 
                contact={activeContact} 
            />
            <IcebreakerModal
                isOpen={icebreakerOpen}
                onClose={() => setIcebreakerOpen(false)}
                contact={activeContact}
            />
          </>
      )}
      
      <QuickEntryDrawer 
        isOpen={quickEntryOpen} 
        onClose={() => setQuickEntryOpen(false)}
        defaultTitle={activeTaskTitle}
      />

      {/* 行程概览抽屉 */}
      <AgendaView 
        isOpen={agendaOpen} 
        onClose={() => setAgendaOpen(false)} 
      />

      {/* 通知中心抽屉 */}
      <NotificationDrawer
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />

    </div>
  )
}
