"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, User, Lock, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  })
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: typeof errors = {}
    if (!formData.username) {
      newErrors.username = "请输入用户名"
    }
    if (!formData.password) {
      newErrors.password = "请输入密码"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-primary text-primary-foreground px-6 pt-16 pb-12">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold">RTA · 待办客</span>
        </div>
        <h1 className="text-2xl font-bold mb-1">欢迎回来</h1>
        <p className="text-primary-foreground/80 text-sm">重要的人，重要的事，再也不忘记</p>
      </div>

      {/* 登录表单 */}
      <div className="flex-1 px-6 pt-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-muted-foreground">用户名</label>
            <div className="mt-1 relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, username: e.target.value }))
                  setErrors((prev) => ({ ...prev, username: undefined }))
                }}
                placeholder="请输入用户名"
                className="w-full pl-10 pr-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            {errors.username && <p className="text-xs text-destructive mt-1">{errors.username}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">密码</label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                  setErrors((prev) => ({ ...prev, password: undefined }))
                }}
                placeholder="请输入密码"
                className="w-full pl-10 pr-12 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Eye className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.remember}
                onChange={(e) => setFormData((prev) => ({ ...prev, remember: e.target.checked }))}
                className="w-4 h-4 rounded border-muted-foreground text-primary focus:ring-primary"
              />
              <span className="text-sm text-muted-foreground">记住我</span>
            </label>
            <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
              忘记密码？
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "登录中..." : "登录"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          还没有账号？{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            立即注册
          </Link>
        </p>

        <button
          onClick={() => router.push("/")}
          className="w-full mt-4 py-3 bg-muted text-muted-foreground rounded-xl font-medium hover:bg-muted/80 transition-colors"
        >
          跳过登录，体验演示
        </button>
      </div>

      <div className="px-6 py-6 text-center">
        <p className="text-xs text-muted-foreground">RTA · 待办客 v1.0.0</p>
      </div>
    </div>
  )
}
