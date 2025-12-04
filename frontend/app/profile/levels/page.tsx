"use client"

import { useState } from "react"
import { Target, Users, Edit2, X, Save } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { BottomNav } from "@/components/bottom-nav"
import { cn } from "@/lib/utils"
import { mockContacts } from "@/lib/mock-data"
import { defaultLevels, type LevelConfig } from "@/lib/level-config"

export default function LevelsPage() {
  const [levels, setLevels] = useState<LevelConfig[]>(defaultLevels)
  const [editingLevel, setEditingLevel] = useState<"S" | "A" | "B" | "C" | null>(null)
  const [editForm, setEditForm] = useState<Partial<LevelConfig>>({})

  // 统计各级别客人数量
  const levelCounts = {
    S: mockContacts.filter((c) => c.level === "S").length,
    A: mockContacts.filter((c) => c.level === "A").length,
    B: mockContacts.filter((c) => c.level === "B").length,
    C: mockContacts.filter((c) => c.level === "C").length,
  }

  const handleStartEdit = (level: LevelConfig) => {
    setEditingLevel(level.code)
    setEditForm({
      name: level.name,
      description: level.description,
      criteria: [...level.criteria],
    })
  }

  const handleCancelEdit = () => {
    setEditingLevel(null)
    setEditForm({})
  }

  const handleSaveEdit = () => {
    if (!editingLevel) return

    setLevels((prev) =>
      prev.map((level) =>
        level.code === editingLevel
          ? {
              ...level,
              name: editForm.name || level.name,
              description: editForm.description || level.description,
              criteria: editForm.criteria || level.criteria,
            }
          : level,
      ),
    )

    // TODO: 后续对接接口保存
    // await saveLevelConfig(editingLevel, editForm)

    setEditingLevel(null)
    setEditForm({})
  }

  const handleCriteriaChange = (index: number, value: string) => {
    setEditForm((prev) => {
      const newCriteria = [...(prev.criteria || [])]
      newCriteria[index] = value
      return { ...prev, criteria: newCriteria }
    })
  }

  const handleAddCriteria = () => {
    setEditForm((prev) => ({
      ...prev,
      criteria: [...(prev.criteria || []), ""],
    }))
  }

  const handleRemoveCriteria = (index: number) => {
    setEditForm((prev) => {
      const newCriteria = [...(prev.criteria || [])]
      newCriteria.splice(index, 1)
      return { ...prev, criteria: newCriteria }
    })
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="客人等级标准" showBack />

      <main className="px-4 py-4 space-y-4">
        {/* 说明卡片 */}
        <section className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">等级标准说明</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                客人等级用于区分客人的重要程度和服务频率。你可以根据业务需求自定义每个等级的标准和描述，帮助记住不同客人的服务偏好和联系频率。
              </p>
            </div>
          </div>
        </section>

        {/* 等级列表 */}
        <section className="space-y-4">
          {levels.map((level) => {
            const isEditing = editingLevel === level.code
            const count = levelCounts[level.code]

            return (
              <div
                key={level.code}
                className={cn(
                  "bg-card rounded-xl border overflow-hidden transition-colors",
                  isEditing ? "border-primary" : "border-border",
                )}
              >
                {/* 等级头部 */}
                <div className={cn("p-4", isEditing && "bg-primary/5")}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg",
                          level.bgColor,
                        )}
                      >
                        {level.code}
                      </div>
                      <div className="flex-1">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.name || level.name}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                            className="w-full text-base font-semibold bg-transparent border-b border-primary/30 focus:outline-none focus:border-primary"
                            placeholder="等级名称"
                          />
                        ) : (
                          <p className="text-base font-semibold">{level.name}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{count} 位客户</span>
                        </div>
                      </div>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(level)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>

                  {/* 描述 */}
                  {isEditing ? (
                    <textarea
                      value={editForm.description || level.description}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full mt-2 p-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      rows={2}
                      placeholder="等级描述"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">{level.description}</p>
                  )}
                </div>

                {/* 判断标准 */}
                <div className="px-4 pb-4 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-2 mt-3">判断标准</p>
                  {isEditing ? (
                    <div className="space-y-2">
                      {(editForm.criteria || level.criteria).map((criterion, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-0.5" />
                          <input
                            type="text"
                            value={criterion}
                            onChange={(e) => handleCriteriaChange(index, e.target.value)}
                            className="flex-1 text-sm bg-background border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="输入判断标准"
                          />
                          <button
                            onClick={() => handleRemoveCriteria(index)}
                            className="p-1 rounded hover:bg-muted transition-colors"
                          >
                            <X className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={handleAddCriteria}
                        className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 mt-1"
                      >
                        <span>+</span>
                        <span>添加标准</span>
                      </button>
                    </div>
                  ) : (
                    <ul className="space-y-1.5">
                      {level.criteria.map((criterion, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/80 flex-shrink-0 mt-2" />
                          <span>{criterion}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* 编辑操作按钮 */}
                  {isEditing && (
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>保存</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>取消</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </section>

        {/* 使用提示 */}
        <section className="bg-card rounded-xl border border-border p-4 text-xs text-muted-foreground space-y-1">
          <p>· 客户等级会影响客户在列表中的排序和显示优先级。</p>
          <p>· A级客户会优先显示，建议设置更高的联系频率。</p>
          <p>· 等级标准修改后，现有客户不会自动调整等级，需要手动更新。</p>
          <p>· 后续版本将支持批量调整客户等级功能。</p>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}

