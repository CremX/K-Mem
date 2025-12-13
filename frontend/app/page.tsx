"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, MapPin, Clock, AlertTriangle, Bell, Calendar, ChevronRight, Zap } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
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
  const smartNotifications = useMemo(() => [
      { id: 1, type: 'birthday', text: '王志刚 (S级) 3天后生日', contactId: '1' },
      { id: 2, type: 'overdue', text: '“寄茶样”任务已逾期', taskId: '2' },
  ], [])
  
  const [currentNotiIndex, setCurrentNotiIndex] = useState(0)

  useEffect(() => {
      if (smartNotifications.length <= 1) return
      const timer = setInterval(() => {
          setCurrentNotiIndex(prev => (prev + 1) % smartNotifications.length)
      }, 5000)
      return () => clearInterval(timer)
  }, [smartNotifications.length])

  const currentNoti = smartNotifications[currentNotiIndex]
  // --------------------

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // 数据筛选逻辑
  const todaysTasks = useMemo(() => {
    return tasks.filter((t) => {
         if (t.status !== 'pending') return false;
         const dueDate = new Date(t.dueDate);
         dueDate.setHours(0,0,0,0);
         return dueDate.getTime() <= today.getTime();
    });
  }, [tasks, today]);

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

  const routineItems = useMemo(() => {
    const vipTaskIds = new Set(vipFocusItems.map(i => i.task.id));
    return todaysTasks.filter(t => !vipTaskIds.has(t.id));
  }, [todaysTasks, vipFocusItems]);

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

  // 快捷操作
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed', completedAt: new Date().toISOString() } : t)),
    )
  }

  const handleQuickEntry = (taskTitle: string) => {
      setActiveTaskTitle(taskTitle)
      setQuickEntryOpen(true)
  }

  const handleQuickGlance = (contact: Contact) => {
      setActiveContact(contact)
      setQuickGlanceOpen(true)
  }

  const handleActivate = (e: React.MouseEvent, contact: Contact) => {
      e.stopPropagation()
      setActiveContact(contact)
      setIcebreakerOpen(true)
  }

  return (
    <div className="min-h-screen bg-background pb-32 text-foreground relative overflow-hidden transition-colors duration-500">
      {/* 顶部装饰：极为克制的金色光晕 */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[180px] pointer-events-none translate-x-1/3 -translate-y-1/3 dark:opacity-30"></div>

      {/* HEADER */}
      <header className="pt-16 px-6 pb-8 relative z-10">
          <div className="flex justify-between items-start mb-10">
              <div className="flex flex-col items-start gap-3">
                  {/* 日期胶囊：使用 glass-dark 增加质感 */}
                  <div className="glass-light dark:glass-dark text-[10px] text-muted-foreground font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-border">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_5px_var(--primary)]"></span>
                    {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' }).toUpperCase()}
                  </div>
                  <h1 className="text-5xl font-serif font-bold text-foreground leading-[1.1] tracking-tight">
                      早安，<br/>
                      <span className="text-primary mt-1 block drop-shadow-sm font-serif">李董事长</span>
                  </h1>
              </div>
              
              <button
                onClick={() => setNotificationOpen(true)}
                className="relative w-12 h-12 rounded-full glass-light dark:glass-dark flex items-center justify-center shadow-soft hover:bg-muted transition-all active:scale-95 group border border-border"
              >
                  <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors stroke-[1.5px]" />
                  {smartNotifications.length > 0 && (
                      <span className="absolute top-3 right-3.5 w-1.5 h-1.5 bg-destructive rounded-full ring-2 ring-card animate-pulse shadow-[0_0_8px_rgba(176,0,32,0.4)]"></span>
                  )}
              </button>
          </div>

          {/* === 智能动态栏 (灵动岛风格) === */}
          {smartNotifications.length > 0 && (
              <div 
                onClick={() => setNotificationOpen(true)}
                className="mb-8 relative overflow-hidden group cursor-pointer rounded-2xl shadow-elevated border border-primary/20 transition-all hover:border-primary/40 hover:shadow-gold bg-card/80 backdrop-blur-md"
              >
                  <div className="relative px-6 py-5 flex items-center justify-between">
                      <div className="flex items-center gap-5 overflow-hidden">
                          <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-inner border border-border",
                              currentNoti.type === 'birthday' ? "bg-rose-500/10 text-rose-500" : "bg-primary/10 text-primary"
                          )}>
                              {currentNoti.type === 'birthday' ? <Calendar className="w-5 h-5 stroke-[1.5px]" /> : <AlertTriangle className="w-5 h-5 stroke-[1.5px]" />}
                          </div>
                          
                          <div className="flex flex-col key={currentNoti.id} animate-in fade-in slide-in-from-bottom-1 duration-500">
                              <span className="text-sm font-bold text-foreground truncate max-w-[240px] tracking-wide font-sans">
                                  {currentNoti.text}
                              </span>
                              <span className="text-[10px] text-muted-foreground mt-1 font-medium tracking-widest uppercase">
                                  {smartNotifications.length} 条重要情报待处理
                              </span>
                          </div>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0 group-hover:translate-x-0.5 duration-300 stroke-[1.5px]" />
                  </div>
              </div>
          )}
      </header>

      <main className="px-6 space-y-12 relative z-10">
        
        {/* 模块 1: 全天焦点 (VIP Focus) */}
        <section>
            <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-3">
                    <div className="w-0.5 h-6 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]"></div>
                    <h2 className="text-2xl font-serif font-bold text-foreground tracking-tight">今日焦点</h2>
                </div>
                <button 
                    onClick={() => setAgendaOpen(true)}
                    className="text-[10px] text-muted-foreground hover:text-primary font-bold transition-colors flex items-center gap-1 group tracking-[0.15em] uppercase"
                >
                    查看全部 <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform stroke-[2px]" />
                </button>
            </div>

            {vipFocusItems.length > 0 ? (
                <div className={cn(
                    "flex gap-6 pb-4 -mx-6 px-6",
                    vipFocusItems.length > 1 ? "overflow-x-auto hide-scrollbar snap-x snap-mandatory pl-6" : ""
                )}>
                    {vipFocusItems.map(({ task, contact }) => (
                        <div 
                            key={task.id} 
                            className={cn(
                                "card-executive flex-shrink-0 group", // 使用新的 card-executive 类，自动适配 Day/Night
                                vipFocusItems.length > 1 ? "min-w-[88%] snap-center" : "w-full"
                            )}
                        >
                            {/* 顶部金线光效 (加强版 - 仅 Dark Mode) */}
                            <div className="hidden dark:block absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <div className="flex gap-5 items-center mb-6">
                                <div className="relative shrink-0">
                                    <div className="w-16 h-16 rounded-full border border-primary/30 p-0.5 bg-background shadow-lg group-hover:border-primary transition-colors duration-500">
                                        <img src="/placeholder-user.jpg" alt="avatar" className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white dark:text-black text-[10px] font-bold shadow-gold border-2 border-card">
                                        {contact.level}
                                    </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-2xl font-serif font-bold text-foreground truncate tracking-tight group-hover:text-primary transition-colors duration-300">
                                        {contact.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-1.5 truncate font-medium tracking-wider uppercase">
                                        {contact.company} · {contact.title || "VIP"}
                                    </p>
                                </div>
                            </div>

                            {/* 破冰策略 - 增加对比度 */}
                            <div className="bg-muted/50 p-5 rounded-xl border border-border mb-6 relative group-hover:bg-muted/80 transition-colors">
                                <div className="flex items-start gap-3">
                                    <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0 stroke-[1.5px]" />
                                    <p className="text-sm text-foreground/90 leading-relaxed font-light font-serif italic">
                                        <span className="text-muted-foreground/50 text-[9px] uppercase tracking-widest mr-2 block mb-1 font-bold not-italic font-sans">破冰策略</span>
                                        "{task.title}"
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 mb-6 text-xs text-muted-foreground font-medium tracking-wide">
                                <span className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary/60 stroke-[1.5px]" /> {task.dueTime || "14:00"}
                                </span>
                                {contact.company && (
                                    <span className="flex items-center gap-2 flex-1 truncate">
                                        <MapPin className="w-4 h-4 shrink-0 stroke-[1.5px] text-primary/60" /> {contact.company}
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => handleQuickEntry(task.title)}
                                    className="btn-primary flex-1 text-xs py-3.5 flex items-center justify-center gap-2 shadow-gold"
                                >
                                    签到记录
                                </button>
                                <button 
                                    onClick={() => handleQuickGlance(contact)}
                                    className="flex-1 bg-transparent border border-border text-foreground/70 text-xs py-3.5 rounded-xl font-bold hover:bg-muted hover:text-foreground transition-all active:scale-95 tracking-wide uppercase"
                                >
                                    查看档案
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-10 bg-card rounded-[24px] border border-dashed border-border text-center shadow-soft">
                    <p className="text-muted-foreground text-xs mb-5 font-medium tracking-widest uppercase">今日焦点任务已清空</p>
                    <button onClick={() => router.push('/contacts')} className="text-xs text-primary font-bold hover:underline flex items-center justify-center gap-2 uppercase tracking-widest">
                        去名录挖掘机会 <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
            )}
        </section>

        {/* 模块 2: 关系预警 (Risk Radar) */}
        {riskContacts.length > 0 && (
            <section>
                <div className="flex items-center gap-3 mb-5 px-1">
                    <div className="w-0.5 h-6 bg-destructive rounded-full shadow-[0_0_8px_var(--destructive)]"></div>
                    <h2 className="text-2xl font-serif font-bold text-foreground tracking-tight">关系雷达</h2>
                </div>
                
                <div className="space-y-4">
                    {riskContacts.map(contact => {
                        const days = Math.floor((new Date().getTime() - new Date(contact.lastContactDate || contact.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                        return (
                            <div 
                                key={contact.id} 
                                className="card-executive flex items-center justify-between p-6 hover:border-destructive/30 rounded-2xl transition-all cursor-pointer group shadow-soft hover:shadow-elevated relative overflow-hidden"
                                onClick={() => router.push(`/contacts/${contact.id}`)}
                            >
                                {/* 左侧红色警示条 */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-destructive"></div>

                                <div className="flex items-center gap-5 flex-1 min-w-0">
                                    <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground font-serif font-bold text-lg group-hover:text-foreground transition-colors shrink-0">
                                        {contact.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-lg font-serif font-bold text-foreground truncate tracking-wide">{contact.name}</p>
                                        <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-3">
                                            <span className="text-destructive font-medium tracking-wide">{days} 天未联系</span>
                                            <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                                            <span className="uppercase tracking-widest text-[9px]">{contact.level} 级</span>
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={(e) => handleActivate(e, contact)}
                                    className="text-[10px] font-bold text-destructive px-5 py-2.5 rounded-lg border border-destructive/20 hover:bg-destructive/10 transition-colors shrink-0 uppercase tracking-widest"
                                >
                                    激活
                                </button>
                            </div>
                        )
                    })}
                </div>
            </section>
        )}

        {/* 模块 3: 常规事务 (Routine) */}
        <section>
            <div className="flex items-center justify-between mb-5 px-1">
                <div className="flex items-center gap-3">
                    <div className="w-0.5 h-6 bg-muted-foreground rounded-full"></div>
                    <h2 className="text-2xl font-serif font-bold text-foreground tracking-tight">常规事务</h2>
                </div>
                <button onClick={() => router.push("/tasks")} className="text-[10px] font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors tracking-[0.15em] uppercase">
                    任务池 <ArrowRight className="w-3 h-3 stroke-[2px]" />
                </button>
            </div>

            {routineItems.length > 0 ? (
                <div className="space-y-3">
                    {routineItems.map(task => (
                        <div key={task.id} className="card-executive p-5 flex items-center justify-between hover:bg-muted/30 transition-colors group shadow-sm bg-card/60">
                            <div className="flex items-center gap-4">
                                <div className={cn("w-1.5 h-1.5 rounded-full transition-all group-hover:scale-125", task.priority === 'high' ? "bg-primary shadow-[0_0_5px_var(--primary)]" : "bg-muted-foreground/30")}></div>
                                <div>
                                    <p className={cn("text-sm font-medium tracking-wide text-foreground/90", task.status === 'completed' && "line-through text-muted-foreground")}>{task.title}</p>
                                    <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-2 font-medium uppercase tracking-widest">
                                        <Clock className="w-3 h-3" /> {task.dueTime || "ALL DAY"}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleToggleTask(task.id)}
                                className={cn(
                                    "w-6 h-6 rounded-full border flex items-center justify-center transition-all active:scale-90",
                                    task.status === 'completed' 
                                        ? "bg-success border-success text-white" 
                                        : "border-border hover:border-primary hover:text-primary text-transparent"
                                )}
                            >
                                {task.status === 'completed' && <ArrowRight className="w-3 h-3" />}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-10 text-center border border-dashed border-border rounded-2xl bg-card/30">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">今日暂无杂事</p>
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

      <AgendaView 
        isOpen={agendaOpen} 
        onClose={() => setAgendaOpen(false)} 
      />

      <NotificationDrawer
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />

    </div>
  )
}
