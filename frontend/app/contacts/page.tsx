"use client"

import { useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Filter, Star, Plus, AlertTriangle, Briefcase, ChevronDown, Check } from "lucide-react"
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

  const filteredAndSortedContacts = useMemo(() => {
    let result = [...mockContacts]

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.company?.toLowerCase().includes(query) ||
          c.title?.toLowerCase().includes(query) ||
          c.phone.includes(query) ||
          c.tags.some((t) => t.toLowerCase().includes(query)),
      )
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
    <div className="flex-1 bg-background pb-24 relative overflow-hidden flex flex-col">
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-[#004D40]/5 dark:from-[#D4AF37]/5 to-transparent opacity-30 pointer-events-none translate-x-1/4 -translate-y-1/4 blur-[100px]"></div>

      {/* A-Z Index Bar - 优化位置和样式，防止遮挡 */}
      <div className="fixed right-1.5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-[2px] items-center bg-white/40 dark:bg-black/40 backdrop-blur-md py-3 px-1.5 rounded-full shadow-sm border border-white/20">
        {['#', ...alphabet].filter((_, i) => i % 2 === 0).map((letter) => (
            <button 
                key={letter}
                onClick={() => scrollToLetter(letter)}
                className="w-4 h-4 text-[10px] font-bold text-muted-foreground/80 hover:text-primary hover:scale-150 transition-all flex items-center justify-center"
            >
                {letter}
            </button>
        ))}
      </div>

      <header className="pt-12 px-5 pb-2 relative z-10 shrink-0">
          <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col items-start max-w-[70%]">
                  <div className="text-[11px] text-primary dark:text-secondary font-bold tracking-[0.12em] font-serif mb-2 border border-primary/50 dark:border-secondary/50 px-2 py-0.5 rounded-sm inline-flex items-center gap-2 bg-background/50 backdrop-blur-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                    {filteredAndSortedContacts.length} 位资源 · 人脉资产
                  </div>
                  <h1 className="text-[28px] font-serif font-bold text-foreground leading-tight">
                      人脉<span className="text-primary dark:text-secondary">名录</span>
                  </h1>
              </div>
              <div className="flex gap-3 shrink-0">
                 <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border transition-all active:scale-95 shadow-soft",
                        showFilters 
                            ? "bg-primary text-primary-foreground border-primary" 
                            : "bg-card border-border text-muted-foreground hover:border-primary/50"
                    )}
                >
                    <Filter className="w-5 h-5" />
                </button>
                <button
                    onClick={() => router.push("/contacts/new")}
                    className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center shadow-gold hover:opacity-90 active:scale-95 transition-all"
                >
                    <Plus className="w-6 h-6" />
                </button>
              </div>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索姓名、公司、标签..."
                className="w-full pl-10 pr-4 py-3.5 bg-card border-none shadow-soft rounded-2xl text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
      </header>

      <main className="px-5 relative z-10 flex-1 overflow-y-auto hide-scrollbar">
        
        {/* 筛选栏 - 优化滚动体验 */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto hide-scrollbar pb-2 -mx-5 px-5 snap-x">
            <button
                onClick={() => setFilterType("all")}
                className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border snap-start",
                    filterType === "all" 
                        ? "bg-primary text-white border-primary shadow-md" 
                        : "bg-white dark:bg-card text-muted-foreground border-border hover:border-primary/30"
                )}
            >
                全部
            </button>
            
            <div className="w-[1px] h-6 bg-border/60 mx-1 shrink-0"></div>

            {[
                { type: 'S', label: 'S级', sub: '核心' },
                { type: 'A', label: 'A级', sub: '重要' },
                { type: 'B', label: 'B级', sub: '普通' },
            ].map(item => (
                <button
                    key={item.type}
                    onClick={() => setFilterType(item.type as FilterType)}
                    className={cn(
                        "pl-3 pr-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all border flex items-center gap-1.5 snap-start",
                        filterType === item.type
                            ? "bg-primary/5 border-primary text-primary" 
                            : "bg-white dark:bg-card text-muted-foreground border-border hover:border-primary/30"
                    )}
                >
                   {filterType === item.type && <Check className="w-3 h-3" />}
                   <span className={cn("font-bold", filterType === item.type ? "text-primary" : "text-foreground")}>{item.label}</span>
                   <span className="text-[10px] opacity-60 font-normal">{item.sub}</span>
                </button>
            ))}

            <div className="w-[1px] h-6 bg-border/60 mx-1 shrink-0"></div>

            {levelCounts.overdue > 0 && (
                <button
                    onClick={() => setFilterType("overdue")}
                    className={cn(
                        "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 snap-start",
                        filterType === "overdue"
                            ? "bg-destructive text-white border-destructive shadow-md"
                            : "bg-white dark:bg-card text-muted-foreground border-border hover:text-destructive hover:border-destructive/30"
                    )}
                >
                    <AlertTriangle className={cn("w-3.5 h-3.5", filterType !== 'overdue' && "text-destructive")} />
                    需维护
                    <span className={cn("ml-1 text-[10px] px-1.5 py-0.5 rounded-full", filterType === 'overdue' ? "bg-white/20 text-white" : "bg-destructive/10 text-destructive")}>
                        {levelCounts.overdue}
                    </span>
                </button>
            )}
        </div>

        {/* 高级筛选面板 - 增加动画 */}
        {showFilters && (
          <div className="mb-6 p-5 bg-card rounded-[20px] shadow-float border-t-4 border-secondary space-y-5 animate-in slide-in-from-top-2 fade-in duration-300">
            <div>
              <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">排序顺序</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "level", label: "💎 价值等级优先" },
                  { value: "recent", label: "🕒 最近联系时间" },
                  { value: "name", label: "🔤 姓名拼音" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortType(option.value as SortType)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-xs font-bold transition-colors border",
                      sortType === option.value
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-transparent text-muted-foreground border-border hover:bg-muted"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">特殊标记</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType(filterType === "favorite" ? "all" : "favorite")}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border",
                    filterType === "favorite" 
                        ? "bg-secondary/10 text-secondary border-secondary/20" 
                        : "bg-transparent text-muted-foreground border-border hover:bg-muted"
                  )}
                >
                  <Star className="w-3.5 h-3.5" />
                  星标收藏
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4 pb-10 pr-6"> {/* pr-6 留出右侧空间给索引条 */}
            {filteredAndSortedContacts.length > 0 ? (
                filteredAndSortedContacts.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
                ))
            ) : (
                <div className="py-20 text-center">
                    <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-dashed border-border">
                        <Briefcase className="w-8 h-8 text-muted-foreground/40" />
                    </div>
                    <p className="text-muted-foreground text-sm mb-6">未找到符合条件的人脉</p>
                    <button onClick={() => router.push("/contacts/new")} className="btn-primary text-xs">
                    录入新人脉
                    </button>
                </div>
            )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
