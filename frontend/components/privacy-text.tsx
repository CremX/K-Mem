// components/privacy-text.tsx
"use client"

import { cn } from "@/lib/utils"

interface PrivacyTextProps {
  text: string
  isPrivacy: boolean
  type?: "name" | "blur" | "phone" // 支持不同类型的脱敏
  className?: string
}

export function PrivacyText({ text, isPrivacy, type = "name", className }: PrivacyTextProps) {
  if (!isPrivacy) {
    return <span className={className}>{text}</span>
  }

  // 1. 姓名脱敏：保留第一个字，后面变星号
  if (type === "name") {
    if (!text) return null
    const firstChar = text.charAt(0)
    return <span className={cn("font-sans", className)}>{firstChar}**</span>
  }

  // 2. 电话脱敏：保留后四位
  if (type === "phone") {
    return <span className={cn("font-mono", className)}>***-****-{text.slice(-4)}</span>
  }

  // 3. 模糊模式（适用于备注、详情）：直接模糊掉，且不可选中复制
  // select-none 防止用户虽然看不见但复制走了文字
  return (
    <span 
      className={cn(
        "filter blur-[6px] select-none opacity-60 transition-all duration-300", 
        className
      )}
      aria-hidden="true" // 辅助阅读器忽略
    >
      {text}
    </span>
  )
}