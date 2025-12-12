"use client"

import { X, Calendar, Clock, MapPin, Star, ChevronRight } from "lucide-react"
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer" 
import { cn } from "@/lib/utils"
import { mockTasks, mockContacts } from "@/lib/mock-data"
import { useRouter } from "next/navigation" // 引入 useRouter

interface AgendaViewProps {
  isOpen: boolean
  onClose: () => void
}

// 模拟未来几天的 VIP 行程数据
const generateAgenda = () => {
  const today = new Date()
  const dates = []

  for (let i = 0; i < 3; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    const tasks = mockTasks.filter(t => {
        return t.priority === 'high' 
    }).slice(0, i === 0 ? 3 : 2) 

    dates.push({
      date: date,
      isToday: i === 0,
      label: i === 0 ? "今天" : (i === 1 ? "明天" : "后天"),
      tasks: tasks.map(t => {
          const contact = mockContacts.find(c => c.id === t.contactId)
          return { ...t, contact }
      })
    })
  }
  return dates
}

export function AgendaView({ isOpen, onClose }: AgendaViewProps) {
  const router = useRouter() // 初始化 router
  const agenda = generateAgenda()

  const handleViewMore = () => {
      onClose() // 关闭当前抽屉
      router.push('/tasks?view=calendar') // 跳转到任务页的日历视图
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* 全屏或高高度抽屉 */}
      <DrawerContent className="h-[90vh] bg-background rounded-t-[32px] max-w-md mx-auto flex flex-col">
        <DrawerTitle className="sr-only">未来行程概览</DrawerTitle>
        
        {/* Header */}
        <div className="relative px-6 pt-8 pb-4 border-b border-border/50 shrink-0">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
            
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-serif font-bold text-foreground flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-primary" />
                        行程概览
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        未来 3 天的 <span className="text-primary font-bold">关键战役</span>
                    </p>
                </div>
                <button 
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* Timeline Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 hide-scrollbar">
            <div className="relative border-l-2 border-border/60 ml-3 space-y-10 pb-10">
                {agenda.map((day, dayIndex) => (
                    <div key={dayIndex} className="relative pl-8">
                        {/* 日期节点 */}
                        <div className={cn(
                            "absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-background z-10",
                            day.isToday ? "border-primary bg-primary" : "border-muted-foreground/30"
                        )} />
                        
                        {/* 日期标题 */}
                        <div className="flex items-baseline gap-2 mb-4">
                            <h4 className={cn(
                                "text-lg font-bold",
                                day.isToday ? "text-primary" : "text-foreground"
                            )}>
                                {day.label}
                            </h4>
                            <span className="text-xs text-muted-foreground font-medium">
                                {day.date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
                            </span>
                        </div>

                        {/* 任务列表 */}
                        <div className="space-y-3">
                            {day.tasks.length > 0 ? (
                                day.tasks.map((item, i) => (
                                    <div 
                                        key={i}
                                        className="group relative bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
                                    >
                                        {/* 时间 & 类型 */}
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-secondary">
                                                <Clock className="w-3.5 h-3.5" />
                                                {item.dueTime || "全天"}
                                            </div>
                                            {item.contact && (
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/50">
                                                    {item.contact.level}级 · {item.contact.name}
                                                </span>
                                            )}
                                        </div>

                                        {/* 标题 */}
                                        <h5 className="font-bold text-foreground text-sm mb-1.5 leading-snug">
                                            {item.title}
                                        </h5>

                                        {/* 地点/备注 */}
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <MapPin className="w-3 h-3 shrink-0" />
                                            <span className="truncate">{item.contact?.company || "公司会议室"}</span>
                                        </div>

                                        {/* 装饰性右箭头 */}
                                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/20 group-hover:text-primary/50 transition-colors" />
                                    </div>
                                ))
                            ) : (
                                <div className="text-xs text-muted-foreground italic pl-1">
                                    今日暂无重点行程，宜修身养性。
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* 底部提示 - 绑定点击事件 */}
            <div className="text-center mt-4 pb-8">
                <button 
                    onClick={handleViewMore}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1 mx-auto px-4 py-2 rounded-full hover:bg-muted"
                >
                    查看更多日程 <ChevronRight className="w-3 h-3" />
                </button>
            </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
