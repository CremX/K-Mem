"use client"

import { Bell, X, Calendar, AlertCircle, MessageSquare, CheckCircle2 } from "lucide-react"
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface NotificationDrawerProps {
  isOpen: boolean
  onClose: () => void
}

// 模拟通知数据
const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        type: 'alert',
        title: '任务逾期提醒',
        content: '“给李总寄茶样” 已逾期 2 天，建议今日处理。',
        time: '10分钟前',
        read: false,
    },
    {
        id: 2,
        type: 'birthday',
        title: '生日预告',
        content: '王志刚 (S级) 将于 3 天后过生日，记得准备礼物。',
        time: '2小时前',
        read: false,
    },
    {
        id: 3,
        type: 'system',
        title: '周报生成',
        content: '您上周的人脉链接报告已生成，点击查看。',
        time: '昨天',
        read: true,
    }
]

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const handleMarkRead = (id: number) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleMarkAllRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const getIcon = (type: string) => {
      switch (type) {
          case 'alert': return <AlertCircle className="w-5 h-5 text-destructive" />
          case 'birthday': return <Calendar className="w-5 h-5 text-pink-500" />
          case 'system': return <CheckCircle2 className="w-5 h-5 text-primary" />
          default: return <MessageSquare className="w-5 h-5 text-muted-foreground" />
      }
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-background rounded-t-[32px] max-w-md mx-auto focus:outline-none h-[85vh] flex flex-col">
        <DrawerTitle className="sr-only">消息中心</DrawerTitle>
        
        {/* Header */}
        <div className="pt-6 px-6 pb-4 flex items-center justify-between border-b border-border/50 shrink-0">
            <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-foreground" />
                <h3 className="font-bold text-lg font-serif">消息中心</h3>
                <span className="bg-destructive text-white text-[10px] px-1.5 rounded-full font-mono">
                    {notifications.filter(n => !n.read).length}
                </span>
            </div>
            <div className="flex items-center gap-4">
                <button 
                    onClick={handleMarkAllRead}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                    全部已读
                </button>
                <button onClick={onClose} className="p-1 -mr-2 text-muted-foreground">
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
            {notifications.length > 0 ? (
                notifications.map(item => (
                    <div 
                        key={item.id}
                        onClick={() => handleMarkRead(item.id)}
                        className={cn(
                            "relative p-4 rounded-xl border transition-all active:scale-[0.98]",
                            item.read 
                                ? "bg-background border-border opacity-70" 
                                : "bg-card border-border shadow-sm border-l-4 border-l-primary"
                        )}
                    >
                        <div className="flex gap-3">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                item.read ? "bg-muted" : "bg-primary/5"
                            )}>
                                {getIcon(item.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={cn("text-sm font-bold", item.read ? "text-muted-foreground" : "text-foreground")}>
                                        {item.title}
                                    </h4>
                                    <span className="text-[10px] text-muted-foreground/60">{item.time}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                    {item.content}
                                </p>
                            </div>
                        </div>
                        {!item.read && (
                            <div className="absolute top-4 right-4 w-2 h-2 bg-destructive rounded-full ring-2 ring-card" />
                        )}
                    </div>
                ))
            ) : (
                <div className="text-center py-20 text-muted-foreground">
                    <p>暂无新消息</p>
                </div>
            )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

