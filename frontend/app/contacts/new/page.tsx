"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Calendar, Users, Briefcase, Building, Info, Heart, AlertTriangle } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { cn } from "@/lib/utils"
import { LEVEL_CONFIG } from "@/lib/constants"
import type { ContactLevel } from "@/lib/constants"

interface FormData {
  name: string
  phone: string
  wechat: string
  
  // 核心身份
  company: string
  title: string
  
  // 价值
  level: ContactLevel
  decisionRole: "decision_maker" | "influencer" | "gatekeeper" | "user" | ""
  
  // 维护
  interactionFrequency: number
  
  // 破冰/情报
  hobbies: string
  familyInfo: string
  taboos: string
  birthday: string
  
  tags: string[]
  notes: string
}

const defaultTags = ["#资金方", "#政府关系", "#老乡", "#校友", "#球友", "#饭局认识"]

const decisionRoles = [
  { value: "decision_maker", label: "决策人(拍板)", desc: "有预算权/最终决定权" },
  { value: "influencer", label: "影响者(吹风)", desc: "能影响决策走向" },
  { value: "gatekeeper", label: "把关人(门神)", desc: "采购/秘书/助理" },
]

export default function NewContactPage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    wechat: "",
    company: "",
    title: "",
    level: "B",
    decisionRole: "",
    interactionFrequency: 60,
    hobbies: "",
    familyInfo: "",
    taboos: "",
    birthday: "",
    tags: [],
    notes: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }

  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (!formData.name.trim()) {
      newErrors.name = "请输入姓名"
    }
    // 允许电话为空，如果只是先记个名字
    if (formData.phone && !/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "请输入正确的手机号"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      console.log("提交商务数据:", formData)
      // TODO: Call API
      router.back()
    }
  }

  const handleLevelChange = (level: ContactLevel) => {
    const config = LEVEL_CONFIG[level]
    setFormData((prev) => ({
      ...prev,
      level,
      interactionFrequency: config.frequency,
    }))
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <PageHeader
        title="录入人脉"
        showBack
        rightContent={
          <button
            onClick={handleSubmit}
            className="px-4 py-1.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground shadow-sm active:scale-95 transition-transform"
          >
            保存
          </button>
        }
      />

      <main className="px-4 py-4 space-y-5">
        
        {/* 1. 核心身份 (Identity) */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            核心身份
          </h3>
          <div className="bg-card rounded-xl border border-border divide-y divide-border shadow-sm">
            <div className="p-4">
              <label className="text-sm text-muted-foreground">姓名 <span className="text-destructive">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="如：王总、张处"
                className={cn(
                  "w-full mt-1 bg-transparent text-foreground focus:outline-none text-lg font-medium",
                  errors.name && "text-destructive placeholder:text-destructive/50",
                )}
              />
            </div>
            <div className="p-4 flex gap-4">
               <div className="flex-1">
                 <label className="text-sm text-muted-foreground flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" />
                    公司/单位
                 </label>
                 <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="如：华兴资本"
                    className="w-full mt-1 bg-transparent text-foreground focus:outline-none"
                 />
               </div>
               <div className="w-px bg-border my-1" />
               <div className="flex-1">
                 <label className="text-sm text-muted-foreground flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    职位
                 </label>
                 <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="如：采购总监"
                    className="w-full mt-1 bg-transparent text-foreground focus:outline-none"
                 />
               </div>
            </div>
            <div className="p-4">
              <label className="text-sm text-muted-foreground">联系方式</label>
              <div className="grid grid-cols-2 gap-4 mt-1">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="手机号"
                    className="bg-transparent focus:outline-none"
                  />
                  <input
                    type="text"
                    name="wechat"
                    value={formData.wechat}
                    onChange={handleChange}
                    placeholder="微信号 (选填)"
                    className="bg-transparent focus:outline-none border-l border-border pl-4"
                  />
              </div>
            </div>
          </div>
        </section>

        {/* 2. 价值评估 (Value Assessment) */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                价值评估
            </h3>
          </div>
          
          {/* 等级选择 */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {(Object.keys(LEVEL_CONFIG) as ContactLevel[]).filter(k => k !== 'D').map((key) => {
              const config = LEVEL_CONFIG[key]
              const isSelected = formData.level === key
              return (
                <button
                  key={key}
                  onClick={() => handleLevelChange(key)}
                  className={cn(
                    "p-2 rounded-xl text-center transition-all border-2 relative overflow-hidden",
                    isSelected
                      ? `${config.bgColor} text-white border-transparent shadow-md`
                      : "bg-card border-border hover:bg-muted/50",
                  )}
                >
                  <p className="text-lg font-bold">{key}级</p>
                  <p className={cn("text-[10px] mt-0.5", isSelected ? "text-white/80" : "text-muted-foreground")}>
                    {config.label.split("/")[0]}
                  </p>
                </button>
              )
            })}
          </div>

          {/* 决策角色 */}
          <div className="bg-card rounded-xl border border-border p-4">
              <label className="text-sm text-muted-foreground block mb-2">决策角色</label>
              <div className="flex flex-wrap gap-2">
                  {decisionRoles.map(role => (
                      <button
                        key={role.value}
                        onClick={() => setFormData(prev => ({...prev, decisionRole: role.value as any}))}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                            formData.decisionRole === role.value 
                                ? "bg-primary/10 text-primary border-primary" 
                                : "bg-muted/30 text-muted-foreground border-transparent"
                        )}
                      >
                          {role.label}
                      </button>
                  ))}
              </div>
          </div>
        </section>

        {/* 3. 攻克抓手 (Strategy Hooks) */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            攻克抓手 (情报)
          </h3>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            <div className="p-4">
              <label className="text-sm text-muted-foreground">爱好/话题</label>
              <input
                type="text"
                name="hobbies"
                value={formData.hobbies}
                onChange={handleChange}
                placeholder="如：高尔夫, 普洱茶, 钓鱼"
                className="w-full mt-1 bg-transparent text-foreground focus:outline-none"
              />
              <p className="text-xs text-muted-foreground mt-1">送礼或约局的关键参考</p>
            </div>
            <div className="p-4">
              <label className="text-sm text-muted-foreground">家庭/私事</label>
              <input
                type="text"
                name="familyInfo"
                value={formData.familyInfo}
                onChange={handleChange}
                placeholder="如：儿子下周高考, 妻子是老师"
                className="w-full mt-1 bg-transparent text-foreground focus:outline-none"
              />
              <p className="text-xs text-muted-foreground mt-1">拉近关系的核武器</p>
            </div>
            <div className="p-4 bg-red-50/10">
              <label className="text-sm text-red-600/80 flex items-center gap-1">
                 <AlertTriangle className="w-3.5 h-3.5" />
                 禁忌/雷区
              </label>
              <input
                type="text"
                name="taboos"
                value={formData.taboos}
                onChange={handleChange}
                placeholder="如：不喝白酒, 忌辣"
                className="w-full mt-1 bg-transparent text-foreground focus:outline-none placeholder:text-red-300"
              />
            </div>
          </div>
        </section>
        
        {/* 4. 标签 */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">常用标签</h3>
          <div className="flex flex-wrap gap-2">
            {defaultTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs transition-colors",
                  formData.tags.includes(tag) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {tag}
              </button>
            ))}
            <button className="px-3 py-1.5 rounded-full text-xs bg-muted text-muted-foreground flex items-center gap-1">
              <Plus className="w-3 h-3" />
              自定义
            </button>
          </div>
        </section>

        {/* 5. 备注 */}
        <section>
          <div className="bg-card rounded-xl border border-border p-4">
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="其他需要记住的信息..."
              rows={3}
              className="w-full bg-transparent text-foreground focus:outline-none resize-none"
            />
          </div>
        </section>
      </main>
    </div>
  )
}
