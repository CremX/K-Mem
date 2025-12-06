"use client"

import { useState } from "react"
import { Bell, Clock, Cake, Heart, AlertCircle, Check, ChevronRight } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { BottomNav } from "@/components/bottom-nav"
import { cn } from "@/lib/utils"

interface NotificationSettings {
  // 服务频率提醒
  serviceFrequencyReminder: boolean
  serviceFrequencyDays: number // 超过多少天未到店提醒
  // 生日提醒
  birthdayReminder: boolean
  birthdayReminderDays: number // 提前几天提醒
  // 关怀提醒
  careReminder: boolean
  healthCareReminder: boolean // 健康关怀提醒
  // 承诺提醒
  promiseReminder: boolean
}

const defaultSettings: NotificationSettings = {
  serviceFrequencyReminder: true,
  serviceFrequencyDays: 7, // 超过服务频率7天未到店提醒
  birthdayReminder: true,
  birthdayReminderDays: 1, // 提前1天提醒
  careReminder: true,
  healthCareReminder: true,
  promiseReminder: true,
}

const reminderDaysOptions = [
  { value: 0, label: "当天" },
  { value: 1, label: "提前1天" },
  { value: 3, label: "提前3天" },
  { value: 7, label: "提前7天" },
]

const serviceFrequencyDaysOptions = [
  { value: 3, label: "3天" },
  { value: 7, label: "7天" },
  { value: 14, label: "14天" },
  { value: 30, label: "30天" },
]

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings)

  const updateSetting = <K extends keyof NotificationSettings>(key: K, value: NotificationSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    // TODO: 后续对接接口保存设置
    // await saveNotificationSettings({ [key]: value })
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="提醒设置" showBack />

      <main className="px-4 py-4 space-y-4">
        {/* 说明卡片 */}
        <section className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">提醒设置说明</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                开启提醒后，系统会在首页和通知中提醒你重要的客户信息和待办事项，帮助你不错过任何重要细节。
              </p>
            </div>
          </div>
        </section>

        {/* 服务频率提醒 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold">服务频率提醒</h3>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium">长时间未到店提醒</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  当客人超过服务频率一定天数未到店时提醒
                </p>
              </div>
              <button
                onClick={() => updateSetting("serviceFrequencyReminder", !settings.serviceFrequencyReminder)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  settings.serviceFrequencyReminder ? "bg-primary" : "bg-muted",
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                    settings.serviceFrequencyReminder && "translate-x-5",
                  )}
                />
              </button>
            </div>
            {settings.serviceFrequencyReminder && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">超过服务频率多少天提醒：</p>
                <div className="flex gap-2">
                  {serviceFrequencyDaysOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateSetting("serviceFrequencyDays", option.value)}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
                        settings.serviceFrequencyDays === option.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 生日提醒 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Cake className="w-4 h-4 text-pink-500" />
            <h3 className="text-sm font-semibold">生日提醒</h3>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium">生日提醒</p>
                <p className="text-xs text-muted-foreground mt-0.5">客人生日时提醒，可发送祝福</p>
              </div>
              <button
                onClick={() => updateSetting("birthdayReminder", !settings.birthdayReminder)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  settings.birthdayReminder ? "bg-primary" : "bg-muted",
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                    settings.birthdayReminder && "translate-x-5",
                  )}
                />
              </button>
            </div>
            {settings.birthdayReminder && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">提前提醒时间：</p>
                <div className="flex gap-2">
                  {reminderDaysOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateSetting("birthdayReminderDays", option.value)}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
                        settings.birthdayReminderDays === option.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 关怀提醒 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-semibold">关怀提醒</h3>
          </div>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium">关怀提醒</p>
                <p className="text-xs text-muted-foreground mt-0.5">主动关怀长时间未到店的客人</p>
              </div>
              <button
                onClick={() => updateSetting("careReminder", !settings.careReminder)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  settings.careReminder ? "bg-primary" : "bg-muted",
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                    settings.careReminder && "translate-x-5",
                  )}
                />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium">健康关怀提醒</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  当客人提到健康问题时，下次服务时提醒主动询问
                </p>
              </div>
              <button
                onClick={() => updateSetting("healthCareReminder", !settings.healthCareReminder)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  settings.healthCareReminder ? "bg-primary" : "bg-muted",
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                    settings.healthCareReminder && "translate-x-5",
                  )}
                />
              </button>
            </div>
          </div>
        </section>

        {/* 承诺提醒 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-warning" />
            <h3 className="text-sm font-semibold">承诺提醒</h3>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium">承诺待办提醒</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  答应客人的事到期时提醒，确保及时兑现承诺
                </p>
              </div>
              <button
                onClick={() => updateSetting("promiseReminder", !settings.promiseReminder)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  settings.promiseReminder ? "bg-primary" : "bg-muted",
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                    settings.promiseReminder && "translate-x-5",
                  )}
                />
              </button>
            </div>
          </div>
        </section>

        {/* 使用提示 */}
        <section className="bg-card rounded-xl border border-border p-4 text-xs text-muted-foreground space-y-1">
          <p>· 提醒会在首页和通知中显示，帮助你不错过重要信息。</p>
          <p>· 服务频率提醒会根据每个客人的等级自动计算提醒时间。</p>
          <p>· 生日提醒可以提前设置，方便提前准备祝福。</p>
          <p>· 承诺提醒确保你及时兑现对客人的承诺，提升客户满意度。</p>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}

