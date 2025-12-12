"use client"

import { useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Filter, Star, Plus, AlertTriangle } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { PageHeader } from "@/components/page-header"
import { ContactCard } from "@/components/contact-card"
import { mockContacts, getDaysSinceLastContact } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type SortType = "name" | "recent" | "level"
type FilterType = "all" | "S" | "A" | "B" | "C" | "needService" | "favorite"

export default function ContactsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialFilter = (searchParams.get("filter") as FilterType) || "all"

  const [searchQuery, setSearchQuery] = useState("")
  const [sortType, setSortType] = useState<SortType>("level")
  const [filterType, setFilterType] = useState<FilterType>(initialFilter)
  const [showFilters, setShowFilters] = useState(false)

  const filteredAndSortedContacts = useMemo(() => {
    let result = [...mockContacts]

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.company?.toLowerCase().includes(query) ||
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
      case "needService":
        result = result.filter((c) => {
          const lastService = c.lastService || c.lastContact
          const frequency = c.serviceFrequency || c.contactFrequency || 30
          if (!lastService) return true
          const days = getDaysSinceLastContact(lastService)
          return days > frequency
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
          const lastA = a.lastService || a.lastContact || ""
          const lastB = b.lastService || b.lastContact || ""
          return new Date(lastB || 0).getTime() - new Date(lastA || 0).getTime()
        })
        break
      case "level":
        // S > A > B > C，同级别按最近服务排序
        result.sort((a, b) => {
          const levelOrder = { S: 0, A: 1, B: 2, C: 3 }
          if (levelOrder[a.level] !== levelOrder[b.level]) {
            return levelOrder[a.level] - levelOrder[b.level]
          }
          const lastA = a.lastService || a.lastContact || ""
          const lastB = b.lastService || b.lastContact || ""
          return new Date(lastB || 0).getTime() - new Date(lastA || 0).getTime()
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
      needService: mockContacts.filter((c) => {
        const lastService = c.lastService || c.lastContact
        const frequency = c.serviceFrequency || c.contactFrequency || 30
        if (!lastService) return false
        return getDaysSinceLastContact(lastService) > frequency
      }).length,
    }),
    [],
  )

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader
        title="客人"
        rightContent={
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "p-2 rounded-full transition-colors",
                showFilters ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push("/contacts/new")}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
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
            placeholder="搜索姓名、公司、电话..."
            className="w-full pl-10 pr-4 py-3 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setFilterType("all")}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors",
              filterType === "all" ? "bg-primary text-primary-foreground" : "bg-card border border-border",
            )}
          >
            全部 ({mockContacts.length})
          </button>
          {levelCounts.S > 0 && (
            <button
              onClick={() => setFilterType("S")}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors",
                filterType === "S" ? "bg-amber-500 text-white" : "bg-card border border-border",
              )}
            >
              S级 ({levelCounts.S})
            </button>
          )}
          <button
            onClick={() => setFilterType("A")}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors",
              filterType === "A" ? "bg-primary text-primary-foreground" : "bg-card border border-border",
            )}
          >
            A级 ({levelCounts.A})
          </button>
          <button
            onClick={() => setFilterType("B")}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors",
              filterType === "B" ? "bg-emerald-500 text-white" : "bg-card border border-border",
            )}
          >
            B级 ({levelCounts.B})
          </button>
          <button
            onClick={() => setFilterType("C")}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors",
              filterType === "C" ? "bg-slate-500 text-white" : "bg-card border border-border",
            )}
          >
            C级 ({levelCounts.C})
          </button>
          {levelCounts.needService > 0 && (
            <button
              onClick={() => setFilterType("needService")}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1",
                filterType === "needService"
                  ? "bg-urgent text-urgent-foreground"
                  : "bg-urgent/10 text-urgent border border-urgent/20",
              )}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              未到店 ({levelCounts.needService})
            </button>
          )}
        </div>

        {/* 筛选面板 */}
        {showFilters && (
          <div className="mb-4 p-3 bg-card rounded-xl border border-border space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-2">排序方式</p>
              <div className="flex gap-2">
                {[
                  { value: "level", label: "按级别" },
                  { value: "recent", label: "最近联系" },
                  { value: "name", label: "按姓名" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortType(option.value as SortType)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm transition-colors",
                      sortType === option.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">其他筛选</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType(filterType === "favorite" ? "all" : "favorite")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1",
                    filterType === "favorite" ? "bg-warning text-warning-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Star className="w-3.5 h-3.5" />
                  收藏
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 客人列表 */}
        <p className="text-sm text-muted-foreground mb-3">{filteredAndSortedContacts.length} 位客人</p>

        {filteredAndSortedContacts.length > 0 ? (
          <div className="space-y-2">
            {filteredAndSortedContacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-muted-foreground mb-4">没有找到客人</p>
            <button
              onClick={() => router.push("/contacts/new")}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
            >
              添加客人
            </button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
