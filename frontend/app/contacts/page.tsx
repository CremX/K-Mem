"use client"

import { useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Filter, Star, Plus, AlertTriangle, Briefcase, ChevronDown, Check, UserPlus } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { ContactCard } from "@/components/contact-card"
import { mockContacts } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type SortType = "name" | "recent" | "level"
type FilterType = "all" | "S" | "A" | "B" | "C" | "overdue" | "favorite"

export default function ContactsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialFilter = (searchParams.get("filter") as FilterType) || "all"

  const [searchQuery, setSearchQuery] = useState("")
  const [sortType, setSortType] = useState<SortType>("level")
  const [filterType, setFilterType] = useState<FilterType>(initialFilter)
  const [showFilters, setShowFilters] = useState(false)

  // 字母索引列表
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
  const scrollToLetter = (letter: string) => {
      console.log(`Scrolling to ${letter}`)
  }

  // 核心逻辑：全字段模糊搜索 + 智能上下文提取
  const filteredAndSortedContacts = useMemo(() => {
    let result = mockContacts.map(c => ({ ...c, matchContext: undefined as any }))

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((c) => {
          // 1. 基础字段匹配
          if (c.name.toLowerCase().includes(query)) return true
          if (c.company?.toLowerCase().includes(query)) return true
          if (c.title?.toLowerCase().includes(query)) return true
          if (c.phone.includes(query)) return true
          
          // 2. 标签匹配 (Tag)
          if (c.tags.some(t => t.toLowerCase().includes(query))) {
              c.matchContext = { type: 'tag', text: c.tags.find(t => t.toLowerCase().includes(query)) || '', highlight: query }
              return true
          }

          // 3. 备注/简介匹配 (Note/Bio)
          const noteText = (c as any).notes || ""
          if (noteText.toLowerCase().includes(query)) {
              const index = noteText.toLowerCase().indexOf(query)
              const start = Math.max(0, index - 10)
              const end = Math.min(noteText.length, index + 20)
              const snippet = (start > 0 ? "..." : "") + noteText.slice(start, end) + (end < noteText.length ? "..." : "")
              
              c.matchContext = { type: 'note', text: snippet, highlight: query }
              return true
          }

          return false
      })
    }

    // 筛选
    switch (filterType) {
      case "S":
      case "A":
      case "B":
      case "C":
        result = result.filter((c) => c.level === filterType)
        break
      case "overdue":
        result = result.filter((c) => {
          const lastDateStr = c.lastContactDate || c.createdAt
          const days = Math.floor((new Date().getTime() - new Date(lastDateStr).getTime()) / (1000 * 60 * 60 * 24))
          const freq = c.interactionFrequency || 30
          return days > freq
        })
        break
      case "favorite":
        result = result.filter((c) => c.isFavorite)
        break
    }

    // 排序
    switch (sortType) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name, "zh-CN"))
        break
      case "recent":
        result.sort((a, b) => {
          const lastA = a.lastContactDate || a.createdAt
          const lastB = b.lastContactDate || b.createdAt
          return new Date(lastB).getTime() - new Date(lastA).getTime()
        })
        break
      case "level":
        // S > A > B > C，同级别按最近联系排序
        result.sort((a, b) => {
          const levelOrder = { S: 0, A: 1, B: 2, C: 3, D: 4 }
          if (levelOrder[a.level as keyof typeof levelOrder] !== levelOrder[b.level as keyof typeof levelOrder]) {
            return levelOrder[a.level as keyof typeof levelOrder] - levelOrder[b.level as keyof typeof levelOrder]
          }
          const lastA = a.lastContactDate || a.createdAt
          const lastB = b.lastContactDate || b.createdAt
          return new Date(lastB).getTime() - new Date(lastA).getTime()
        })
        break
    }

    return result
  }, [searchQuery, sortType, filterType])

  // 统计各级别数量
  const levelCounts = useMemo(
    () => ({
      S: mockContacts.filter((c) => c.level === "S").length,
      A: mockContacts.filter((c) => c.level === "A").length,
      B: mockContacts.filter((c) => c.level === "B").length,
      C: mockContacts.filter((c) => c.level === "C").length,
      overdue: mockContacts.filter((c) => {
        const lastDateStr = c.lastContactDate || c.createdAt
        const days = Math.floor((new Date().getTime() - new Date(lastDateStr).getTime()) / (1000 * 60 * 60 * 24))
        const freq = c.interactionFrequency || 30
        return days > freq
      }).length,
    }),
    [],
  )

  return (
    <div className="min-h-screen bg-background pb-24 relative overflow-hidden flex flex-col transition-colors duration-500">
      {/* 背景装饰：统一为极简光晕 */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] pointer-events-none translate-x-1/4 -translate-y-1/4 dark:opacity-30"></div>

      {/* A-Z Index Bar - 玻璃态悬浮 */}
      <div className="fixed right-1.5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-[2px] items-center glass-light dark:glass-dark py-3 px-1.5 rounded-full shadow-soft border border-border/50">
        {['#', ...alphabet].filter((_, i) => i % 2 === 0).map((letter) => (
            <button 
                key={letter}
                onClick={() => scrollToLetter(letter)}
                className="w-4 h-4 text-[10px] font-bold text-muted-foreground/80 hover:text-primary hover:scale-150 transition-all flex items-center justify-center font-serif"
            >
                {letter}
            </button>
        ))}
      </div>

      <header className="pt-16 px-6 pb-2 relative z-10 shrink-0">
          <div className="flex justify-between items-start mb-8">
              <div className="flex flex-col items-start max-w-[70%]">
                  <div className="text-[10px] text-primary dark:text-secondary font-bold tracking-[0.2em] uppercase mb-2 border border-primary/20 px-3 py-1 rounded-full inline-flex items-center gap-2 bg-background/50 backdrop-blur-sm shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_5px_var(--primary)]"></span>
                    {filteredAndSortedContacts.length} 位资产
                  </div>
                  <h1 className="text-4xl font-serif font-bold text-foreground leading-[1.1] tracking-tight mt-1">
                      人脉<span className="text-primary ml-1 drop-shadow-sm italic text-2xl font-sans font-light opacity-60">名录</span>
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
                    onClick={() => router.push("/contacts/new")}
                    className="w-11 h-11 rounded-full btn-primary flex items-center justify-center shadow-gold hover:opacity-90 active:scale-95 transition-all p-0"
                >
                    <Plus className="w-6 h-6 stroke-[2px]" />
                </button>
              </div>
          </div>

          <div className="relative mb-8 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors stroke-[1.5px]" />
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索人脉..."
                className="w-full pl-12 pr-6 py-4 glass-light dark:glass-dark border border-border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-soft group-hover:shadow-elevated font-medium tracking-wide"
            />
          </div>
      </header>

      <main className="px-6 relative z-10 flex-1 overflow-y-auto hide-scrollbar">
        
        {/* 筛选栏 - 极简文字风格 (Minimalist Text Tabs) */}
        <div className="w-full overflow-x-auto hide-scrollbar -mx-6 px-6 mb-8 snap-x">
            <div className="flex items-center gap-6 min-w-full w-max border-b border-border/40 pb-1">
                <button
                    onClick={() => setFilterType("all")}
                    className={cn(
                        "relative pb-3 text-xs font-bold whitespace-nowrap transition-all uppercase tracking-[0.15em]",
                        filterType === "all" 
                            ? "text-primary" 
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    全部
                    {filterType === "all" && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_8px_var(--primary)] rounded-t-full" />
                    )}
                </button>

                {[
                    { key: 'S', label: 'S级' }, 
                    { key: 'A', label: 'A级' }, 
                    { key: 'B', label: 'B级' }
                ].map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setFilterType(key as FilterType)}
                        className={cn(
                            "relative pb-3 text-xs font-bold whitespace-nowrap transition-all uppercase tracking-[0.15em] flex items-center gap-1.5",
                            filterType === key 
                                ? "text-primary" 
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {label}
                        {filterType === key && (
                            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_8px_var(--primary)] rounded-t-full" />
                        )}
                    </button>
                ))}

                {levelCounts.overdue > 0 && (
                    <button
                        onClick={() => setFilterType("overdue")}
                        className={cn(
                            "relative pb-3 text-xs font-bold whitespace-nowrap transition-all uppercase tracking-[0.15em] flex items-center gap-1.5 ml-auto",
                            filterType === "overdue" ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                        )}
                    >
                        需维护
                        <span className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            filterType === "overdue" ? "bg-destructive animate-pulse" : "bg-destructive/50"
                        )} />
                        {filterType === "overdue" && (
                            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-destructive shadow-[0_0_8px_var(--destructive)] rounded-t-full" />
                        )}
                    </button>
                )}
            </div>
        </div>

        {/* 高级筛选面板 */}
        {showFilters && (
          <div className="mb-8 p-6 glass-dark dark:glass-dark light:glass-light rounded-[24px] shadow-float border-t-4 border-primary space-y-6 animate-in slide-in-from-top-2 fade-in duration-300">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground mb-4 uppercase tracking-[0.2em]">排序方式</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: "level", label: "💎 价值等级" },
                  { value: "recent", label: "🕒 最近联系" },
                  { value: "name", label: "🔤 字母顺序" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortType(option.value as SortType)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-xs font-bold transition-colors border",
                      sortType === option.value
                        ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                        : "bg-transparent text-muted-foreground border-border hover:bg-muted/50"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground mb-4 uppercase tracking-[0.2em]">快捷筛选</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setFilterType(filterType === "favorite" ? "all" : "favorite")}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 border",
                    filterType === "favorite" 
                        ? "bg-secondary/10 text-secondary border-secondary/20 shadow-sm" 
                        : "bg-transparent text-muted-foreground border-border hover:bg-muted/50"
                  )}
                >
                  <Star className="w-3.5 h-3.5" />
                  星标收藏
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-5 pb-10 pr-6"> 
            {filteredAndSortedContacts.length > 0 ? (
                filteredAndSortedContacts.map((contact) => (
                <ContactCard key={contact.id} contact={contact} matchContext={contact.matchContext} />
                ))
            ) : (
                <div className="py-24 text-center flex flex-col items-center">
                    <div className="w-24 h-24 bg-card/30 rounded-full flex items-center justify-center mb-8 border border-dashed border-border group hover:border-primary/50 transition-colors">
                        <Briefcase className="w-10 h-10 text-muted-foreground/40 group-hover:text-primary/50 transition-colors stroke-[1px]" />
                    </div>
                    <h3 className="text-foreground font-serif font-bold text-lg mb-2">未找到匹配人脉</h3>
                    <p className="text-muted-foreground text-xs max-w-[200px] mb-8 tracking-wide">
                        {searchQuery ? `没有找到包含 "${searchQuery}" 的内容` : "请尝试调整筛选条件"}
                    </p>
                    
                    {searchQuery && (
                        <button
                            onClick={() => router.push(`/contacts/new?name=${encodeURIComponent(searchQuery)}`)}
                            className="btn-primary px-8 py-4 rounded-full font-bold shadow-gold hover:shadow-elevated hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 text-xs uppercase tracking-widest"
                        >
                            <UserPlus className="w-4 h-4" />
                            新建人脉: {searchQuery}
                        </button>
                    )}
                </div>
            )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
