"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface SealCheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
  className?: string
}

export function SealCheckbox({
  checked,
  onCheckedChange,
  label,
  className,
}: SealCheckboxProps) {
  const [showSeal, setShowSeal] = useState(false)

  // 监听 checked 状态，控制印章动画
  useEffect(() => {
    if (checked) {
      // 延迟一点点显示印章，营造“盖下去”的感觉
      const timer = setTimeout(() => setShowSeal(true), 100)
      return () => clearTimeout(timer)
    } else {
      setShowSeal(false)
    }
  }, [checked])

  return (
    <div 
      className={cn(
        "relative flex items-center gap-3 cursor-pointer group select-none", 
        className
      )}
      onClick={() => onCheckedChange(!checked)}
    >
      {/* 自定义复选框容器 */}
      <div className={cn(
        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
        checked 
          ? "border-primary/20 bg-primary/5" 
          : "border-muted-foreground/30 group-hover:border-primary/50"
      )}>
        {/* 这里不再显示普通的勾选图标，而是留空，或者显示一个极淡的点 */}
        {!checked && (
          <div className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-primary/20 transition-colors" />
        )}
      </div>

      {/* 文本内容 */}
      <div className={cn(
        "text-sm transition-all duration-500",
        checked ? "text-muted-foreground line-through opacity-50" : "text-foreground"
      )}>
        {label}
      </div>

      {/* 核心：朱砂印章动效 */}
      <AnimatePresence>
        {showSeal && (
          <motion.div
            initial={{ scale: 2, opacity: 0, rotate: 15 }}
            animate={{ scale: 1, opacity: 1, rotate: -5 }}
            exit={{ scale: 1.5, opacity: 0, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 15,
              mass: 0.5 
            }}
            className="absolute left-[-8px] top-[-8px] pointer-events-none z-10"
          >
            {/* 印章图形 (SVG) */}
            <div className="relative w-10 h-10">
              {/* 印泥质感滤镜效果 */}
              <svg 
                viewBox="0 0 100 100" 
                className="w-full h-full text-[#D43F33] drop-shadow-md" // 朱砂红
                style={{ filter: "url(#ink-texture)" }}
              >
                <defs>
                  <filter id="ink-texture">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                  </filter>
                </defs>
                
                {/* 外框：圆角方印 */}
                <rect x="5" y="5" width="90" height="90" rx="15" fill="none" stroke="currentColor" strokeWidth="3" />
                <rect x="12" y="12" width="76" height="76" rx="10" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" opacity="0.6"/>
                
                {/* 内容：'已阅' 或者 '完成' 的篆体风格变体 (简化为图形以确保兼容性) */}
                <path d="M30 35 L70 35 M50 35 L50 75 M30 75 L70 75" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                <circle cx="70" cy="30" r="4" fill="currentColor" />
              </svg>
              
              {/* 印章文字 (可选) - 这里用伪元素或绝对定位文字可能更好控制，为了演示简化用 SVG */}
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#D43F33] font-serif transform -rotate-12 opacity-90 tracking-widest">
                已阅
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

