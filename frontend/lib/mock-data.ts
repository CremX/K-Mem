// 联系人类型 - 适用于服务行业（技师、美容师、健身教练等）
export interface Contact {
  id: string
  name: string
  avatar?: string
  phone: string
  wechat?: string
  email?: string
  // 服务偏好相关
  servicePreferences?: string // 喜欢的手法/力度/服务方式
  taboos?: string // 禁忌部位/过敏情况/注意事项
  chatTopics?: string // 喜欢的聊天话题
  serviceHabits?: string // 特殊习惯（喜欢安静/喜欢聊天等）
  // 服务记录相关
  lastService?: string // 上次服务时间
  lastServiceProject?: string // 上次服务项目
  serviceFrequency: number // 服务频率（天）- 多久来一次
  // 基础信息
  level: "S" | "A" | "B" | "C" // 客户等级（S级VIP，A级常客，B级偶尔，C级新客）
  tags: string[]
  notes?: string
  birthday?: string
  preferences?: string // 个人喜好（保留兼容）
  familyInfo?: string
  createdAt: string
  isFavorite: boolean
  // 兼容旧字段
  lastContact?: string // 兼容字段，等同于 lastService
  lastContactSummary?: string // 上次服务摘要
  contactFrequency?: number // 兼容字段，等同于 serviceFrequency
}

// 待办/提醒类型 - 适用于服务行业
export interface Task {
  id: string
  title: string
  description?: string
  contactId?: string
  contactName?: string
  dueDate: string
  dueTime?: string
  type: "appointment" | "birthday" | "care" | "promise" | "custom" // appointment: 预约, care: 关怀提醒
  priority: "high" | "medium" | "low"
  isCompleted: boolean
  completedAt?: string
  isRepeating: boolean
  repeatPattern?: "daily" | "weekly" | "monthly" | "yearly"
  sourceRecordId?: string
  createdAt: string
}

// 服务记录类型 - 记录每次服务过程和聊天内容
export interface ServiceRecord {
  id: string
  contactId: string
  contactName: string
  type: "service" | "chat" | "wechat" | "call" | "other" // service: 服务记录
  content: string // 服务过程、聊天内容
  summary?: string
  date: string
  serviceProject?: string // 服务项目
  duration?: number // 服务时长（分钟）
  promises?: string[] // 承诺（送小礼物、记住特殊要求等）
  importantInfo?: string[] // 重要信息（孩子考试、工作变动等）
  healthNotes?: string // 健康关注点（腰疼、肩颈问题等）
  nextService?: {
    date: string
    action: string
  }
  createdAt: string
}

// 兼容旧类型名
export type CommunicationRecord = ServiceRecord

// Mock 联系人数据 - 服务行业场景（技师、美容师等）
export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "王总",
    phone: "13800138001",
    wechat: "wang_vip",
    level: "S",
    tags: ["VIP", "常客"],
    notes: "每周都来，非常熟悉",
    birthday: "1975-03-15",
    serviceFrequency: 7,
    lastService: "2025-01-28",
    lastServiceProject: "全身按摩",
    lastContactSummary: "上次服务很满意，聊到孩子高考成绩出来了，很理想",
    servicePreferences: "喜欢重手法，肩颈和腰部重点",
    taboos: "腰部有旧伤，不能太用力",
    chatTopics: "喜欢聊工作和孩子，不喜欢聊私事",
    serviceHabits: "喜欢安静，服务时不要过多聊天",
    preferences: "喜欢按摩精油，偏好薰衣草味",
    familyInfo: "儿子今年高考，成绩理想",
    createdAt: "2024-06-15",
    isFavorite: true,
  },
  {
    id: "2",
    name: "李姐",
    phone: "13900139002",
    wechat: "li_regular",
    level: "A",
    tags: ["常客", "转介绍"],
    notes: "每月来2-3次，人很好",
    serviceFrequency: 14,
    lastService: "2025-01-20",
    lastServiceProject: "足疗+肩颈",
    lastContactSummary: "上次聊到工作压力大，肩颈特别酸",
    servicePreferences: "中等力度，足疗和肩颈是重点",
    chatTopics: "喜欢聊生活、美食、旅游",
    preferences: "喜欢聊天，服务时可以多交流",
    createdAt: "2024-08-20",
    isFavorite: true,
  },
  {
    id: "3",
    name: "张哥",
    phone: "13700137003",
    level: "B",
    tags: ["偶尔来"],
    birthday: "1985-07-22",
    serviceFrequency: 30,
    lastService: "2025-01-10",
    lastServiceProject: "全身按摩",
    lastContactSummary: "上次来是朋友介绍，体验不错",
    servicePreferences: "喜欢轻手法，比较怕疼",
    chatTopics: "比较内向，不太爱聊天",
    serviceHabits: "喜欢安静，专注享受服务",
    createdAt: "2024-10-10",
    isFavorite: false,
  },
  {
    id: "4",
    name: "赵姐",
    phone: "13600136004",
    level: "B",
    tags: ["新客"],
    notes: "第一次来，需要记录偏好",
    serviceFrequency: 30,
    lastService: "2024-12-25",
    lastServiceProject: "首次体验",
    lastContactSummary: "初次服务，了解了基本需求",
    servicePreferences: "待观察",
    createdAt: "2024-11-05",
    isFavorite: false,
  },
  {
    id: "5",
    name: "孙总",
    phone: "13500135005",
    wechat: "sun_new",
    level: "C",
    tags: ["新客"],
    birthday: "1988-12-01",
    serviceFrequency: 60,
    lastService: "2025-01-30",
    lastServiceProject: "足疗",
    lastContactSummary: "第一次来，体验不错，可能会再来",
    servicePreferences: "喜欢足疗，力度适中",
    createdAt: "2024-12-01",
    isFavorite: false,
  },
]

// Mock 待办数据 - 服务行业场景
export const mockTasks: Task[] = [
  {
    id: "1",
    title: "给王总送按摩精油",
    description: "答应下次送薰衣草味的按摩精油",
    contactId: "1",
    contactName: "王总",
    dueDate: "2025-02-01",
    dueTime: "18:00",
    type: "promise",
    priority: "high",
    isCompleted: false,
    isRepeating: false,
    sourceRecordId: "1",
    createdAt: "2025-01-28",
  },
  {
    id: "2",
    title: "今日预约：李姐 14:00",
    description: "足疗+肩颈，记得她最近肩颈特别酸",
    contactId: "2",
    contactName: "李姐",
    dueDate: "2025-02-04",
    dueTime: "14:00",
    type: "appointment",
    priority: "high",
    isCompleted: false,
    isRepeating: false,
    createdAt: "2025-01-20",
  },
  {
    id: "3",
    title: "张哥生日祝福",
    contactId: "3",
    contactName: "张哥",
    dueDate: "2025-07-22",
    type: "birthday",
    priority: "medium",
    isCompleted: false,
    isRepeating: true,
    repeatPattern: "yearly",
    createdAt: "2025-01-01",
  },
  {
    id: "4",
    title: "关怀：询问李姐肩颈情况",
    description: "上次她说肩颈特别酸，这次可以主动询问",
    contactId: "2",
    contactName: "李姐",
    dueDate: "2025-02-04",
    type: "care",
    priority: "medium",
    isCompleted: false,
    isRepeating: false,
    createdAt: "2025-01-20",
  },
  {
    id: "5",
    title: "赵姐长时间未到店提醒",
    description: "已经30天没来了，可以适当关怀",
    contactId: "4",
    contactName: "赵姐",
    dueDate: "2025-01-25",
    type: "care",
    priority: "low",
    isCompleted: false,
    isRepeating: false,
    createdAt: "2024-12-25",
  },
  {
    id: "6",
    title: "给李姐准备肩颈舒缓精油",
    description: "上次服务时答应今天带给她",
    contactId: "2",
    contactName: "李姐",
    dueDate: new Date().toISOString().split("T")[0], // 今天
    dueTime: "14:00",
    type: "promise",
    priority: "high",
    isCompleted: false,
    isRepeating: false,
    createdAt: "2025-12-01",
  },
  {
    id: "7",
    title: "关怀：询问王总腰部情况",
    description: "上次他说腰部不舒服，今天可以主动询问",
    contactId: "1",
    contactName: "王总",
    dueDate: new Date().toISOString().split("T")[0], // 今天
    type: "care",
    priority: "medium",
    isCompleted: false,
    isRepeating: false,
    createdAt: "2025-12-01",
  },
]

// Mock 服务记录 - 服务行业场景
export const mockRecords: ServiceRecord[] = [
  {
    id: "1",
    contactId: "1",
    contactName: "王总",
    type: "service",
    content:
      "今天给王总做了全身按摩，重点按了肩颈和腰部。服务过程中聊到孩子高考成绩出来了，很理想，他很开心。他说最近工作压力大，腰部有点不舒服，我帮他重点按了腰部，他感觉很舒服。",
    summary: "全身按摩，聊到孩子高考成绩理想",
    date: "2025-01-28",
    serviceProject: "全身按摩",
    duration: 90,
    promises: ["下次送薰衣草味的按摩精油"],
    importantInfo: ["孩子高考成绩出来了，很理想"],
    healthNotes: "腰部有旧伤，最近工作压力大，腰部不舒服",
    nextService: {
      date: "2025-02-04",
      action: "记得带按摩精油，询问腰部情况",
    },
    createdAt: "2025-01-28",
  },
  {
    id: "2",
    contactId: "2",
    contactName: "李姐",
    type: "service",
    content:
      "今天给李姐做了足疗和肩颈按摩。她最近工作压力特别大，肩颈特别酸，我帮她重点按了肩颈，她感觉很舒服。聊到最近工作忙，没时间好好休息，我建议她可以多来放松一下。",
    summary: "足疗+肩颈，肩颈特别酸",
    date: "2025-01-20",
    serviceProject: "足疗+肩颈",
    duration: 60,
    healthNotes: "最近工作压力大，肩颈特别酸",
    nextService: {
      date: "2025-02-04",
      action: "主动询问肩颈情况，可以推荐一些缓解方法",
    },
    createdAt: "2025-01-20",
  },
  {
    id: "3",
    contactId: "3",
    contactName: "张哥",
    type: "service",
    content:
      "今天给张哥做了全身按摩，他比较内向，不太爱聊天，我就专注服务。他喜欢轻手法，比较怕疼，我调整了力度，他感觉很舒服。服务结束后他说下次还会来。",
    summary: "全身按摩，喜欢轻手法",
    date: "2025-01-10",
    serviceProject: "全身按摩",
    duration: 60,
    createdAt: "2025-01-10",
  },
]

// 为了向后兼容，创建别名导出
export const mockReminders = mockTasks
export const mockCommunications = mockRecords

// 标签类型
export interface Tag {
  id: string
  name: string
  color: string
  count: number
}

// Mock 标签数据 - 服务行业标签
export const mockTags: Tag[] = [
  { id: "1", name: "VIP", color: "bg-amber-100 text-amber-700", count: 1 },
  { id: "2", name: "常客", color: "bg-blue-100 text-blue-700", count: 2 },
  { id: "3", name: "转介绍", color: "bg-green-100 text-green-700", count: 1 },
  { id: "4", name: "新客", color: "bg-purple-100 text-purple-700", count: 2 },
  { id: "5", name: "偶尔来", color: "bg-slate-100 text-slate-700", count: 1 },
  { id: "6", name: "喜欢聊天", color: "bg-pink-100 text-pink-700", count: 1 },
  { id: "7", name: "喜欢安静", color: "bg-teal-100 text-teal-700", count: 2 },
  { id: "8", name: "有禁忌", color: "bg-red-100 text-red-700", count: 1 },
]

// 旧版Reminder类型兼容
export type Reminder = Task

// 辅助函数：计算距离下次服务还有几天（兼容旧字段）
export function getDaysUntilNextContact(contact: Contact): number {
  const lastService = contact.lastService || contact.lastContact
  const frequency = contact.serviceFrequency || contact.contactFrequency || 30
  if (!lastService) return 0
  const lastDate = new Date(lastService)
  const nextDate = new Date(lastDate)
  nextDate.setDate(nextDate.getDate() + frequency)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffTime = nextDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// 辅助函数：计算距离生日还有几天
export function getDaysUntilBirthday(birthday: string): number {
  const today = new Date()
  const birth = new Date(birthday)
  const thisYearBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())

  if (thisYearBirthday < today) {
    thisYearBirthday.setFullYear(today.getFullYear() + 1)
  }

  const diffTime = thisYearBirthday.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// 辅助函数：计算已经多少天没服务（兼容旧字段）
export function getDaysSinceLastContact(lastContact?: string): number {
  if (!lastContact) return 999
  const last = new Date(lastContact)
  const today = new Date()
  const diffTime = today.getTime() - last.getTime()
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}
