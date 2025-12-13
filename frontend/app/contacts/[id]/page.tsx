"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  Phone, MessageCircle, Mail, Calendar, Star, Edit, Plus, 
  Clock, AlertCircle, Share2, Heart, Quote, ArrowLeft, 
  Briefcase, MapPin, Link as LinkIcon, History, FileText, CheckSquare,
  Activity, Zap, Copy, Gift, Sparkles
} from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { TaskCard } from "@/components/task-card"
import { QuickRecordModal } from "@/components/quick-record-modal"
import { mockContacts, mockRecords, mockTasks, getDaysSinceLastContact, getDaysUntilBirthday } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { LEVEL_CONFIG } from "@/lib/constants"
import { toast } from "sonner" // 假设已安装 sonner toast

// 定义 Tab 类型
type TabType = 'timeline' | 'info' | 'tasks'

export default function ContactDetailPage() {
  const params = useParams()
  const router = useRouter()
  const contactId = params.id as string

  // 状态管理
  const [activeTab, setActiveTab] = useState<TabType>('timeline')
  const [showRecordModal, setShowRecordModal] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false) 

  // 数据获取
  const contact = mockContacts.find((c) => c.id === contactId)
  
  if (!contact) return <div className="p-10 text-center">客户不存在</div>

  // 数据处理
  const records = mockRecords
    .filter((r) => r.contactId === contactId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
  const pendingTasks = mockTasks.filter((t) => t.contactId === contactId && !t.isCompleted)
  const lastRecord = records[0]
  
  const daysSinceContact = getDaysSinceLastContact(contact.lastContactDate || contact.createdAt)
  const needsContact = contact.interactionFrequency ? daysSinceContact > contact.interactionFrequency : false
  const levelConfig = LEVEL_CONFIG[contact.level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG.C

  // 生日计算
  const daysUntilBirthday = contact.birthday ? getDaysUntilBirthday(contact.birthday) : 999
  const isBirthdayNear = daysUntilBirthday <= 30

  // 格式化数据
  const preferences = contact.servicePreferences?.split("，").map(p => `🍵 ${p}`) || []
  const taboos = contact.taboos?.split("，").map(t => `🚫 ${t}`) || []
  const allPreferences = [...preferences, ...taboos]

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
    })
  }

  const handleQuickRecord = (data: any) => {
    console.log("Saving:", data)
  }

  // 生成销冠备注公式
  const wechatAlias = `${contact.level}-${contact.company || '公司'}-${contact.name}-${contact.tags[0] || ''}`
  
  const copyAlias = () => {
      navigator.clipboard.writeText(wechatAlias)
      // 这里可以用 toast 提示，简单起见先 alert 或 console
      alert(`已复制推荐备注：${wechatAlias}`)
  }

  // 关系能量条 (模拟数据)
  const relationshipEnergy = contact.level === 'S' ? 5 : contact.level === 'A' ? 4 : contact.level === 'B' ? 3 : 1

  return (
    <div className="flex flex-col h-screen bg-background relative overflow-hidden">
      {/* 顶部背景装饰 - 安全局风格 */}
      <div className={cn("absolute top-0 left-0 right-0 h-[300px] opacity-20 pointer-events-none bg-gradient-to-b from-primary/30 to-background/0")} />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

      {/* Header */}
      <header className="pt-12 px-5 pb-2 relative z-20 shrink-0 flex items-center justify-between">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-background/40 backdrop-blur-md border border-white/10 flex items-center justify-center active:scale-95 transition-all hover:bg-background/60">
          <ArrowLeft className="w-4 h-4 text-foreground/80" />
        </button>
        <div className="flex gap-2">
          <button onClick={() => setIsFavorite(!isFavorite)} className="w-9 h-9 rounded-full bg-background/40 backdrop-blur-md border border-white/10 flex items-center justify-center active:scale-95 transition-all hover:bg-background/60">
            <Star className={cn("w-4 h-4 transition-colors", isFavorite ? "text-yellow-500 fill-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" : "text-muted-foreground")} />
          </button>
          <button onClick={() => router.push(`/contacts/${contactId}/edit`)} className="w-9 h-9 rounded-full bg-background/40 backdrop-blur-md border border-white/10 flex items-center justify-center active:scale-95 transition-all hover:bg-background/60">
            <Edit className="w-4 h-4 text-foreground/80" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="px-5 pb-6 shrink-0 relative z-10">
        <div className="flex items-start gap-5 mb-6">
            {/* 头像 - 增加科技感边框 */}
            <div className="relative group">
              <div className={cn(
                "w-20 h-20 rounded-[24px] flex items-center justify-center text-white text-3xl font-bold font-serif shadow-2xl relative z-10 overflow-hidden",
                levelConfig.bgColor
              )}>
                {/* 内部光效 */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                {contact.name.slice(0, 1)}
              </div>
              {/* 底部光晕 */}
              <div className={cn("absolute -bottom-3 left-1/2 -translate-x-1/2 w-[80%] h-4 blur-lg opacity-50", levelConfig.color.replace('text-', 'bg-'))}></div>
              
              {/* 等级徽章 - 悬浮式 */}
              <div className="absolute -bottom-2 -right-2 z-20 bg-background/90 backdrop-blur border border-border px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm flex items-center gap-1.5">
                <span className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_6px_currentColor]", levelConfig.color)}></span>
                {contact.level}级
              </div>
            </div>

            {/* 信息区 */}
            <div className="flex-1 pt-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 overflow-hidden">
                      <h1 className="text-2xl font-bold text-foreground tracking-tight truncate">{contact.name}</h1>
                      {/* 销冠功能：复制标准备注 */}
                      <button 
                          onClick={copyAlias}
                          className="text-muted-foreground hover:text-primary transition-colors p-1"
                          title={`复制推荐备注: ${wechatAlias}`}
                      >
                          <Copy className="w-3.5 h-3.5" />
                      </button>
                  </div>
                  
                  {/* 亲密度能量条 */}
                  <div className="flex gap-[2px] shrink-0">
                      {[1,2,3,4,5].map(i => (
                          <div key={i} className={cn(
                              "w-1 h-3 rounded-[1px] transition-all",
                              i <= relationshipEnergy 
                                ? cn("bg-primary shadow-[0_0_5px_rgba(var(--primary),0.5)]", i===relationshipEnergy && "animate-pulse") 
                                : "bg-muted/30"
                          )} />
                      ))}
                  </div>
              </div>
              
              <div className="text-xs text-muted-foreground/80 space-y-1 font-medium">
                <div className="flex items-center gap-1.5 truncate">
                    <Briefcase className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    <span className="truncate">{contact.title || "职位未填"}</span>
                    <span className="opacity-30">|</span>
                    <span className="truncate">{contact.company}</span>
                </div>
                {contact.location && (
                     <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 shrink-0 opacity-70" />
                        {contact.location}
                    </div>
                )}
              </div>
            </div>
        </div>

        {/* 关键提醒 Banner Area */}
        <div className="space-y-3 mb-5">
            {/* 1. 关系预警 (Alert) */}
            {needsContact && (
                <div className="flex items-start gap-3 p-3 bg-destructive/5 border border-destructive/20 text-destructive rounded-lg text-xs animate-in fade-in slide-in-from-top-2 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-destructive/50"></div>
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                        <span className="font-bold block mb-0.5">关系预警</span>
                        <span className="opacity-80">已断联 {daysSinceContact - (contact.interactionFrequency || 0)} 天 (建议频率: {contact.interactionFrequency}天)</span>
                    </div>
                </div>
            )}

            {/* 2. 生日倒数 (Celebration) - 销冠功能 */}
            {isBirthdayNear && (
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg text-xs animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 animate-bounce" />
                        <span className="font-bold">生日临近 · 还有 {daysUntilBirthday} 天</span>
                    </div>
                    <button className="text-[10px] bg-amber-500/10 hover:bg-amber-500/20 px-2 py-1 rounded transition-colors font-medium">
                        生成祝福
                    </button>
                </div>
            )}
        </div>

        {/* Action Bar - 胶囊风格 */}
        <div className="grid grid-cols-4 gap-3">
            <ActionButton icon={<Phone className="w-4 h-4" />} label="电话" onClick={() => window.open(`tel:${contact.phone}`)} />
            <ActionButton icon={<MessageCircle className="w-4 h-4" />} label="微信" onClick={() => {}} />
            <ActionButton icon={<Plus className="w-4 h-4" />} label="记录" onClick={() => setShowRecordModal(true)} variant="primary" />
            <ActionButton icon={<Clock className="w-4 h-4" />} label="待办" onClick={() => router.push(`/tasks/new?contactId=${contactId}`)} />
        </div>
      </div>

      {/* Tabs - 悬浮吸顶风格 */}
      <div className="px-5 border-b border-border/40 shrink-0 flex gap-6 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
          <TabButton active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} label="时间轴" />
          <TabButton active={activeTab === 'info'} onClick={() => setActiveTab('info')} label="详细资料" />
          <TabButton active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} label="待办" count={pendingTasks.length} />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-muted/10 pb-24 px-5 pt-5 scroll-smooth">
        
        {/* TAB 1: 时间轴 */}
        {activeTab === 'timeline' && (
            <div className="space-y-6 pb-10">
                {/* 1. 记忆碎片 (Context Card) */}
                <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/60 p-4 shadow-sm relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                         <Quote className="w-12 h-12 text-primary" />
                     </div>
                     <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
                        <Activity className="w-3 h-3 text-primary" />
                        <span>CONTEXT MEMORY</span>
                     </div>
                     
                     {/* Tags & Preferences */}
                     <div className="flex flex-wrap gap-2 mb-4">
                        {allPreferences.length > 0 ? allPreferences.map((pref, i) => (
                             <span key={i} className={cn(
                                 "px-2 py-1 rounded-[4px] text-[11px] font-medium border transition-colors", 
                                 pref.includes("🚫") 
                                    ? "bg-red-500/5 text-red-600 border-red-500/20" 
                                    : "bg-primary/5 text-primary/80 border-primary/10 hover:border-primary/30"
                             )}>
                                {pref}
                             </span>
                        )) : <span className="text-xs text-muted-foreground italic">暂无喜好记录...</span>}
                     </div>
                     
                     {/* 销冠功能：破冰建议 (Copilot) */}
                     <div className="flex items-start gap-2 mb-3 p-2 bg-blue-500/5 border border-blue-500/10 rounded-lg text-xs text-blue-600/80">
                         <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                         <div>
                             <span className="font-bold">破冰话题：</span>
                             {contact.tags.includes('高尔夫') ? '最近球技有长进吗？周末要不要约一场？' : 
                              contact.tags.includes('老乡') ? '最近回老家了吗？听说那边变化挺大。' : 
                              '最近行业动态变动很大，想听听您的见解。'}
                         </div>
                     </div>
                     
                     {lastRecord && (
                        <div className="relative pl-3 border-l-2 border-primary/20">
                            <p className="text-sm text-foreground/90 leading-relaxed font-medium">"{lastRecord.summary || lastRecord.content}"</p>
                            <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground/60 font-mono">
                                <History className="w-3 h-3" />
                                上次沟通: {formatDate(lastRecord.date)}
                            </div>
                        </div>
                     )}
                </div>

                {/* 2. Timeline List */}
                <div className="relative pl-4 space-y-6">
                    {/* 虚线轴 */}
                    <div className="absolute left-[5px] top-2 bottom-0 w-[2px] border-l-2 border-dashed border-border/60"></div>

                    {records.map((record, index) => (
                        <div key={record.id} className="relative group animate-in slide-in-from-bottom-4 fade-in duration-500" style={{animationDelay: `${index * 100}ms`}}>
                            {/* 时间节点 (发光点) */}
                            <div className="absolute -left-[16px] top-1.5 w-3 h-3 rounded-full bg-background border-2 border-primary z-10 shadow-[0_0_8px_rgba(var(--primary),0.4)] group-hover:scale-125 transition-transform"></div>
                            
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-[10px] font-mono text-muted-foreground opacity-70">{formatDate(record.date)}</span>
                                <span className={cn(
                                    "text-[9px] px-1.5 py-[1px] rounded uppercase font-bold tracking-wider border",
                                    record.type === 'call' ? "border-blue-500/30 text-blue-500 bg-blue-500/5" :
                                    record.type === 'meeting' ? "border-amber-500/30 text-amber-500 bg-amber-500/5" :
                                    "border-emerald-500/30 text-emerald-500 bg-emerald-500/5"
                                )}>
                                    {record.type}
                                </span>
                            </div>
                            
                            {/* 记录卡片 - 玻璃态 */}
                            <div className="bg-card/80 backdrop-blur-sm border border-border/50 p-3.5 rounded-xl shadow-sm hover:border-primary/30 hover:shadow-md transition-all group-hover:translate-x-1">
                                {record.summary && <div className="text-sm font-bold mb-1 text-foreground/90">{record.summary}</div>}
                                <div className="text-sm text-muted-foreground leading-relaxed">{record.content}</div>
                                {record.promises && record.promises.length > 0 && (
                                    <div className="mt-3 pt-2 border-t border-border/40 flex gap-2">
                                        {record.promises.map((p,i) => (
                                            <span key={i} className="text-[10px] bg-yellow-500/5 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-[4px] border border-yellow-500/20 flex items-center gap-1.5 font-medium">
                                                <LinkIcon className="w-2.5 h-2.5" /> 承诺: {p}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {records.length === 0 && (
                         <div className="py-10 text-center text-muted-foreground/50 text-xs italic">
                             时间线空白... 等待第一次接触
                         </div>
                    )}
                </div>
            </div>
        )}

        {/* TAB 2: 详细资料 */}
        {activeTab === 'info' && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <InfoCard title="联系方式">
                    <InfoRow icon={<Phone className="w-4 h-4" />} label="手机" value={contact.phone} action />
                    <InfoRow icon={<MessageCircle className="w-4 h-4" />} label="微信" value={contact.wechat} action />
                    <InfoRow icon={<Mail className="w-4 h-4" />} label="邮箱" value={contact.email} />
                </InfoCard>

                <InfoCard title="基础信息">
                    <InfoRow icon={<Calendar className="w-4 h-4" />} label="生日" value={contact.birthday ? formatDate(contact.birthday) : '未设置'} />
                    <InfoRow icon={<MapPin className="w-4 h-4" />} label="地址" value={contact.location || '未设置'} />
                    <InfoRow icon={<Briefcase className="w-4 h-4" />} label="来源" value={contact.tags.includes('老乡') ? '同乡会' : '商务拓展'} />
                </InfoCard>

                <InfoCard title="备注记录">
                     <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {contact.notes || "暂无详细备注..."}
                     </p>
                </InfoCard>
            </div>
        )}

        {/* TAB 3: 待办 */}
        {activeTab === 'tasks' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center mb-2 px-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pending Tasks</span>
                    <button className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded hover:bg-primary/20 transition-colors">+ NEW TASK</button>
                </div>
                {pendingTasks.length > 0 ? pendingTasks.map(task => (
                    <TaskCard key={task.id} task={task} showContact={false} />
                )) : (
                    <div className="py-12 text-center text-muted-foreground/40 bg-card/30 rounded-xl border border-dashed border-border/60">
                        <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p className="text-xs">暂无待办事项</p>
                    </div>
                )}
            </div>
        )}

      </main>

      <BottomNav />
      <QuickRecordModal isOpen={showRecordModal} onClose={() => setShowRecordModal(false)} contactId={contactId} contactName={contact.name} onSubmit={handleQuickRecord} />
    </div>
  )
}

// --- 子组件 (Sub Components) ---

function ActionButton({ icon, label, onClick, active, variant = 'default' }: any) {
    return (
        <button 
            onClick={onClick}
            className={cn(
                "flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all active:scale-95 border",
                variant === 'primary' 
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_4px_12px_rgba(var(--primary),0.3)]" 
                    : "bg-card text-muted-foreground border-border/50 hover:bg-muted/50 hover:text-foreground hover:border-primary/30"
            )}
        >
            <div className={cn(variant === 'primary' ? "opacity-100" : "opacity-70")}>{icon}</div>
            <span className="text-[10px] font-bold tracking-wide">{label}</span>
        </button>
    )
}

function TabButton({ active, onClick, icon, label, count }: any) {
    return (
        <button 
            onClick={onClick}
            className={cn(
                "relative pb-3 pt-3 transition-all text-[13px] font-medium tracking-wide flex items-center gap-1.5",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
        >
            {label}
            {count > 0 && <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full font-bold", active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>{count}</span>}
            {active && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[3px] bg-primary rounded-t-full shadow-[0_0_8px_currentColor]"></div>
            )}
        </button>
    )
}

function InfoCard({ title, children }: any) {
    return (
        <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/60 overflow-hidden">
            <div className="px-4 py-2 border-b border-border/40 bg-muted/20 flex items-center gap-2">
                <div className="w-1 h-3 bg-primary/40 rounded-full"></div>
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{title}</h3>
            </div>
            <div className="p-4 space-y-4">
                {children}
            </div>
        </div>
    )
}

function InfoRow({ icon, label, value, action }: any) {
    return (
        <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-muted/40 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                {/* 直接渲染 icon 元素，假设传入的是 <Icon className="..." /> 或 clone 它 */}
                {/* 修正：不再用 cn() 包裹 React Element，而是通过外层 div 控制大小，或者使用 cloneElement */}
                <div className="w-4 h-4 flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
                <p className="text-sm font-medium truncate font-mono">{value || "-"}</p>
            </div>
            {action && value && (
                <button 
                    onClick={() => navigator.clipboard.writeText(value)}
                    className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-[10px] px-2 py-1 bg-primary/10 rounded hover:bg-primary/20"
                >
                    COPY
                </button>
            )}
        </div>
    )
}
