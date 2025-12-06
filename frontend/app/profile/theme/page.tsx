"use client"

import { Sun, Moon, Monitor, Check } from "lucide-react"
import { useTheme } from "next-themes"

import { PageHeader } from "@/components/page-header"
import { BottomNav } from "@/components/bottom-nav"
import { cn } from "@/lib/utils"

const themeOptions = [
  {
    value: "system" as const,
    label: "跟随系统",
    desc: "根据系统的浅色 / 深色模式自动切换",
    icon: Monitor,
  },
  {
    value: "light" as const,
    label: "浅色模式",
    desc: "适合白天或明亮环境使用",
    icon: Sun,
  },
  {
    value: "dark" as const,
    label: "深色模式",
    desc: "适合夜间或暗光环境使用，减少眩光",
    icon: Moon,
  },
] satisfies {
  value: "system" | "light" | "dark"
  label: string
  desc: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}[]

export default function ThemeSettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const current = (theme as "system" | "light" | "dark") ?? "system"

  const currentLabel =
    current === "system" ? `跟随系统（当前：${resolvedTheme === "dark" ? "深色" : "浅色"}）` : current === "dark" ? "深色模式" : "浅色模式"

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="主题模式" showBack />

      <main className="px-4 py-4 space-y-4">
        {/* 当前模式说明 */}
        <section className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground mb-1">当前模式</p>
          <p className="text-base font-medium">{currentLabel}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            你可以在这里切换浅色 / 深色模式，或选择跟随系统设置。切换后，首页、客户、待办、统计等页面的配色会一起更新。
          </p>
        </section>

        {/* 主题选项 */}
        <section className="space-y-3">
          {themeOptions.map((option) => {
            const Icon = option.icon
            const isActive = current === option.value

            return (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-colors touch-active",
                  isActive ? "border-primary bg-primary/5" : "border-border hover:bg-muted/60",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    option.value === "light" && "bg-amber-100 text-amber-600",
                    option.value === "dark" && "bg-slate-900 text-slate-100",
                    option.value === "system" && "bg-blue-100 text-blue-600",
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{option.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{option.desc}</p>
                </div>
                {isActive && (
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            )
          })}
        </section>

        {/* 预览说明 */}
        <section className="bg-card rounded-xl border border-border p-4 text-xs text-muted-foreground space-y-1">
          <p>· 浅色模式下，背景偏明亮，适合日间长时间浏览。</p>
          <p>· 深色模式下，背景偏深色，适合夜间或 OLED 屏幕使用。</p>
          <p>· 跟随系统时，会自动根据手机系统的外观设置切换。</p>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}


