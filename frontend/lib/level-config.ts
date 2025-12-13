// 客户等级配置 - 共享配置，用于等级标准页面和添加客户页面
// 适用于服务行业：技师、美容师、健身教练等

export interface LevelConfig {
  code: "S" | "A" | "B" | "C"
  name: string
  description: string
  criteria: string[]
  color: string
  bgColor: string
  textColor: string
  defaultFrequency: number // 默认服务频率（天）
}

export const defaultLevels: LevelConfig[] = [
  {
    code: "S",
    name: "S级客人",
    description: "每周都来的VIP客人，记得所有细节，优先服务",
    criteria: [
      "每周至少来1次，回头率极高",
      "记得所有服务偏好和禁忌",
      "关系非常熟悉，像老朋友",
      "需要提供最个性化的服务",
    ],
    color: "amber-500",
    bgColor: "bg-amber-500",
    textColor: "text-amber-600",
    defaultFrequency: 7,
  },
  {
    code: "A",
    name: "A级客人",
    description: "每月来2-3次的常客，记得主要偏好",
    criteria: [
      "每月来2-3次，回头率较高",
      "记得主要服务偏好和习惯",
      "关系较好，需要用心维护",
      "建议记住关键聊天话题",
    ],
    color: "primary",
    bgColor: "bg-primary",
    textColor: "text-primary",
    defaultFrequency: 14,
  },
  {
    code: "B",
    name: "B级客人",
    description: "偶尔来的客人，记得基本喜好",
    criteria: [
      "偶尔来，频率不固定",
      "记得基本服务偏好",
      "需要主动维护关系",
      "可以适当关怀提醒",
    ],
    color: "emerald-500",
    bgColor: "bg-emerald-500",
    textColor: "text-emerald-600",
    defaultFrequency: 30,
  },
  {
    code: "C",
    name: "C级客人",
    description: "新客人或很少来的客人，保持基础记录",
    criteria: [
      "新客人或很少来",
      "记录基本信息即可",
      "作为潜在常客培养",
      "首次服务时记录偏好",
    ],
    color: "slate-500",
    bgColor: "bg-slate-500",
    textColor: "text-slate-500",
    defaultFrequency: 60,
  },
]

// 根据等级代码获取配置
export function getLevelConfig(code: "S" | "A" | "B" | "C"): LevelConfig {
  return defaultLevels.find((level) => level.code === code) || defaultLevels[1]
}

// 获取所有等级配置
export function getAllLevelConfigs(): LevelConfig[] {
  return defaultLevels
}

