"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Calendar, Clock, Heart, Users, Info } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { cn } from "@/lib/utils"
import { getAllLevelConfigs, getLevelConfig } from "@/lib/level-config"

interface FormData {
  name: string
  phone: string
  wechat: string
  email: string
  company: string
  position: string
  level: "S" | "A" | "B" | "C"
  serviceFrequency: number
  birthday: string
  // 服务偏好相关
  servicePreferences: string // 喜欢的手法/力度/服务方式
  taboos: string // 禁忌部位/过敏情况
  chatTopics: string // 喜欢的聊天话题
  serviceHabits: string // 特殊习惯
  // 其他
  preferences: string // 个人喜好（兼容）
  familyInfo: string
  tags: string[]
  notes: string
}

const defaultTags = ["VIP", "常客", "转介绍", "新客", "喜欢聊天", "喜欢安静", "有禁忌"]

const frequencyOptions = [
  { value: 7, label: "每周" },
  { value: 14, label: "每两周" },
  { value: 21, label: "每三周" },
  { value: 30, label: "每月" },
]

export default function NewContactPage() {
  const router = useRouter()
  const levelConfigs = getAllLevelConfigs()
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    wechat: "",
    email: "",
    company: "",
    position: "",
    level: "B",
    serviceFrequency: getLevelConfig("B").defaultFrequency,
    birthday: "",
    servicePreferences: "",
    taboos: "",
    chatTopics: "",
    serviceHabits: "",
    preferences: "",
    familyInfo: "",
    tags: [],
    notes: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    if (!formData.phone.trim()) {
      newErrors.phone = "请输入电话"
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "请输入正确的手机号"
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "请输入正确的邮箱"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      console.log("提交数据:", formData)
      router.back()
    }
  }

  // 根据等级自动设置服务频率（使用等级配置中的默认频率）
  const handleLevelChange = (level: "S" | "A" | "B" | "C") => {
    const config = getLevelConfig(level)
    setFormData((prev) => ({
      ...prev,
      level,
      serviceFrequency: config.defaultFrequency,
    }))
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <PageHeader
        title="添加客人"
        showBack
        rightContent={
          <button
            onClick={handleSubmit}
            className="px-4 py-1.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground"
          >
            保存
          </button>
        }
      />

      <main className="px-4 py-4 space-y-5">
        {/* 基本信息 */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">基本信息</h3>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            <div className="p-4">
              <label className="text-sm text-muted-foreground">
                姓名 <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="如：张总、李经理"
                className={cn(
                  "w-full mt-1 bg-transparent text-foreground focus:outline-none",
                  errors.name && "text-destructive",
                )}
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>
            <div className="p-4">
              <label className="text-sm text-muted-foreground">
                电话 <span className="text-destructive">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="请输入手机号"
                className={cn(
                  "w-full mt-1 bg-transparent text-foreground focus:outline-none",
                  errors.phone && "text-destructive",
                )}
              />
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
            </div>
            <div className="p-4">
              <label className="text-sm text-muted-foreground">微信号</label>
              <input
                type="text"
                name="wechat"
                value={formData.wechat}
                onChange={handleChange}
                placeholder="方便微信联系"
                className="w-full mt-1 bg-transparent text-foreground focus:outline-none"
              />
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-foreground">客人等级</h3>
            <button
              onClick={() => router.push("/profile/levels")}
              className="text-xs text-primary flex items-center gap-1"
            >
              <Info className="w-3.5 h-3.5" />
              <span>查看标准</span>
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {levelConfigs.map((config) => {
              const isSelected = formData.level === config.code
              // 简短描述
              const shortDesc =
                config.code === "S"
                  ? "每周都来"
                  : config.code === "A"
                    ? "每月2-3次"
                    : config.code === "B"
                      ? "偶尔来"
                      : "新客/很少来"

              return (
                <button
                  key={config.code}
                  onClick={() => handleLevelChange(config.code)}
                  className={cn(
                    "p-3 rounded-xl text-center transition-all border-2",
                    isSelected
                      ? `${config.bgColor} text-white border-transparent`
                      : "bg-card border-border",
                  )}
                >
                  <p className="text-lg font-bold">{config.code}级</p>
                  <p
                    className={cn(
                      "text-xs mt-0.5",
                      isSelected ? "text-white/80" : "text-muted-foreground",
                    )}
                  >
                    {shortDesc}
                  </p>
                </button>
              )
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            选择等级后，系统会根据等级标准自动设置建议服务频率
          </p>
        </section>

        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            建议服务频率
          </h3>
          <div className="flex gap-2">
            {frequencyOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFormData((prev) => ({ ...prev, serviceFrequency: option.value }))}
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
                  formData.serviceFrequency === option.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">超过此时间未到店会收到提醒</p>
        </section>

        {/* 服务偏好 */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            服务偏好（服务前速览）
          </h3>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            <div className="p-4">
              <label className="text-sm text-muted-foreground">服务偏好</label>
              <input
                type="text"
                name="servicePreferences"
                value={formData.servicePreferences}
                onChange={handleChange}
                placeholder="如：喜欢重手法，肩颈和腰部重点"
                className="w-full mt-1 bg-transparent text-foreground focus:outline-none"
              />
              <p className="text-xs text-muted-foreground mt-1">喜欢的手法/力度/服务方式</p>
            </div>
            <div className="p-4">
              <label className="text-sm text-muted-foreground">禁忌/注意事项</label>
              <input
                type="text"
                name="taboos"
                value={formData.taboos}
                onChange={handleChange}
                placeholder="如：腰部有旧伤，不能太用力；对某些精油过敏"
                className="w-full mt-1 bg-transparent text-foreground focus:outline-none"
              />
              <p className="text-xs text-muted-foreground mt-1">禁忌部位/过敏情况（重要！）</p>
            </div>
            <div className="p-4">
              <label className="text-sm text-muted-foreground">聊天话题</label>
              <input
                type="text"
                name="chatTopics"
                value={formData.chatTopics}
                onChange={handleChange}
                placeholder="如：喜欢聊工作和孩子，不喜欢聊私事"
                className="w-full mt-1 bg-transparent text-foreground focus:outline-none"
              />
              <p className="text-xs text-muted-foreground mt-1">喜欢的聊天话题或话题禁忌</p>
            </div>
            <div className="p-4">
              <label className="text-sm text-muted-foreground">特殊习惯</label>
              <input
                type="text"
                name="serviceHabits"
                value={formData.serviceHabits}
                onChange={handleChange}
                placeholder="如：喜欢安静，服务时不要过多聊天"
                className="w-full mt-1 bg-transparent text-foreground focus:outline-none"
              />
              <p className="text-xs text-muted-foreground mt-1">服务时的特殊习惯或要求</p>
            </div>
          </div>
        </section>

        {/* 个人信息 */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">个人信息</h3>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            <div className="p-4">
              <label className="text-sm text-muted-foreground">个人喜好</label>
              <input
                type="text"
                name="preferences"
                value={formData.preferences}
                onChange={handleChange}
                placeholder="如：喜欢按摩精油，偏好薰衣草味"
                className="w-full mt-1 bg-transparent text-foreground focus:outline-none"
              />
            </div>
            <div className="p-4">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                家庭信息
              </label>
              <input
                type="text"
                name="familyInfo"
                value={formData.familyInfo}
                onChange={handleChange}
                placeholder="如：儿子今年高考，成绩理想"
                className="w-full mt-1 bg-transparent text-foreground focus:outline-none"
              />
            </div>
            <div className="p-4">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                生日
              </label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="w-full mt-1 bg-transparent text-foreground focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* 标签 */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">标签</h3>
          <div className="flex flex-wrap gap-2">
            {defaultTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm transition-colors",
                  formData.tags.includes(tag) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {tag}
              </button>
            ))}
            <button className="px-3 py-1.5 rounded-full text-sm bg-muted text-muted-foreground flex items-center gap-1">
              <Plus className="w-4 h-4" />
              自定义
            </button>
          </div>
        </section>

        {/* 备注 */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">备注</h3>
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
