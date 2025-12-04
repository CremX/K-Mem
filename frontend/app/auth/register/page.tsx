"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Lock, Phone, Mail, ChevronLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.username.trim()) {
      newErrors.username = "请输入用户名"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "请输入手机号"
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "请输入正确的手机号"
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "请输入正确的邮箱"
    }
    if (!formData.password) {
      newErrors.password = "请输入密码"
    } else if (formData.password.length < 6) {
      newErrors.password = "密码至少6位"
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "两次密码不一致"
    }
    if (!formData.agreed) {
      newErrors.agreed = "请同意服务条款"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center h-14 px-4 border-b border-border">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold pr-9">注册</h1>
      </header>

      <div className="flex-1 px-6 py-6 overflow-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              用户名 <span className="text-destructive">*</span>
            </label>
            <div className="mt-1 relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                placeholder="请输入用户名"
                className="w-full pl-10 pr-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            {errors.username && <p className="text-xs text-destructive mt-1">{errors.username}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              手机号 <span className="text-destructive">*</span>
            </label>
            <div className="mt-1 relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="请输入手机号"
                className="w-full pl-10 pr-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">邮箱（选填）</label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="请输入邮箱"
                className="w-full pl-10 pr-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              密码 <span className="text-destructive">*</span>
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="请输入密码（至少6位）"
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

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              确认密码 <span className="text-destructive">*</span>
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="请再次输入密码"
                className="w-full pl-10 pr-12 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Eye className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreed}
                onChange={(e) => setFormData((prev) => ({ ...prev, agreed: e.target.checked }))}
                className="w-4 h-4 mt-0.5 rounded border-muted-foreground text-primary focus:ring-primary"
              />
              <span className="text-sm text-muted-foreground">
                我已阅读并同意{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  服务条款
                </Link>{" "}
                和{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  隐私政策
                </Link>
              </span>
            </label>
            {errors.agreed && <p className="text-xs text-destructive mt-1">{errors.agreed}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-6"
          >
            {isLoading ? "注册中..." : "注册"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          已有账号？{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            立即登录
          </Link>
        </p>
      </div>
    </div>
  )
}
