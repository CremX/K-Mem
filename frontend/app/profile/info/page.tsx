"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Phone, MessageCircle, Building2, FileText, Camera } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { BottomNav } from "@/components/bottom-nav"
import { cn } from "@/lib/utils"

interface UserInfo {
  name: string
  phone: string
  wechat?: string
  workplace?: string
  bio?: string
  avatar?: string
}

const defaultUserInfo: UserInfo = {
  name: "待办客用户",
  phone: "",
  wechat: "",
  workplace: "",
  bio: "",
}

export default function ProfileInfoPage() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<UserInfo>(defaultUserInfo)
  const [errors, setErrors] = useState<Partial<Record<keyof UserInfo, string>>>({})

  const handleChange = (field: keyof UserInfo, value: string) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = () => {
    const newErrors: Partial<Record<keyof UserInfo, string>> = {}
    if (!userInfo.name.trim()) {
      newErrors.name = "请输入姓名"
    }
    // 手机号选填，但如果填写了需要验证格式
    if (userInfo.phone.trim() && !/^1[3-9]\d{9}$/.test(userInfo.phone)) {
      newErrors.phone = "请输入正确的手机号"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validate()) {
      // TODO: 后续对接接口保存
      // await saveUserInfo(userInfo)
      console.log("保存个人信息:", userInfo)
      router.back()
    }
  }

  const getInitial = (name: string) => {
    return name.slice(0, 1).toUpperCase()
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader
        title="个人信息"
        showBack
        rightContent={
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground"
          >
            保存
          </button>
        }
      />

      <main className="px-4 py-4 space-y-4">
        {/* 头像 */}
        <section className="flex flex-col items-center py-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-medium">
              {getInitial(userInfo.name || "R")}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary border-2 border-background flex items-center justify-center">
              <Camera className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">点击更换头像</p>
        </section>

        {/* 基本信息 */}
        <section className="space-y-3">
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            <div className="p-4">
              <label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                姓名 <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="请输入姓名或昵称"
                className={cn(
                  "w-full bg-transparent text-foreground focus:outline-none",
                  errors.name && "text-destructive",
                )}
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            <div className="p-4">
              <label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4" />
                手机号
              </label>
              <input
                type="tel"
                value={userInfo.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="方便联系（选填）"
                className={cn(
                  "w-full bg-transparent text-foreground focus:outline-none",
                  errors.phone && "text-destructive",
                )}
              />
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
            </div>

            <div className="p-4">
              <label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4" />
                微信号
              </label>
              <input
                type="text"
                value={userInfo.wechat || ""}
                onChange={(e) => handleChange("wechat", e.target.value)}
                placeholder="方便联系（选填）"
                className="w-full bg-transparent text-foreground focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* 工作信息 */}
        <section className="space-y-3">
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            <div className="p-4">
              <label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4" />
                工作单位
              </label>
              <input
                type="text"
                value={userInfo.workplace || ""}
                onChange={(e) => handleChange("workplace", e.target.value)}
                placeholder="如：XX洗浴中心、XX美容院（选填）"
                className="w-full bg-transparent text-foreground focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* 个人简介 */}
        <section className="space-y-3">
          <div className="bg-card rounded-xl border border-border p-4">
            <label className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4" />
              个人简介
            </label>
            <textarea
              value={userInfo.bio || ""}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="介绍一下自己（选填）"
              rows={4}
              className="w-full bg-transparent text-foreground focus:outline-none resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">个人简介会在你的个人资料中显示</p>
          </div>
        </section>

        {/* 提示信息 */}
        <section className="bg-card rounded-xl border border-border p-4 text-xs text-muted-foreground space-y-1">
          <p>· 姓名为必填项，用于账号识别。</p>
          <p>· 手机号、微信号和工作单位为选填，方便联系和其他功能使用。</p>
          <p>· 个人信息仅用于本应用，不会泄露给第三方。</p>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}

