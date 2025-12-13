// 联系人类型
export interface Contact {
  id: string
  name: string
  avatar?: string
  phone: string
  wechat?: string
  email?: string
  company?: string
  title?: string
  address?: string // 新增
  source?: string // 新增
  
  // 业务字段
  level: "S" | "A" | "B" | "C" 
  tags: string[]
  notes?: string
  birthday?: string
  
  // 偏好相关 (新结构)
  servicePreferences?: string // 喜好 (兼容旧字段，或者用新字段 preferences)
  preferences?: string // 喜好/忌讳
  taboos?: string // 忌讳 (新增)
  familyInfo?: string // 家庭情况
  bio?: string // 个人简介
  
  // 互动数据
  lastContactDate?: string
  interactionFrequency?: number // 建议联系频率(天)
  location?: string // 常驻地 (新增)
  
  createdAt: string
  isFavorite: boolean
  
  // 兼容旧字段 (Optional)
  lastService?: string
  serviceFrequency?: number

  // 辅助显示字段 (不存储，仅用于搜索结果展示)
  matchContext?: {
    type: 'note' | 'bio' | 'tag' | 'chat'
    text: string
    highlight?: string
  }
}

// 待办/提醒类型
export interface Task {
  id: string
  title: string
  description?: string
  contactId?: string
  contactName?: string
  dueDate: string
  dueTime?: string
  type: "appointment" | "birthday" | "care" | "promise" | "custom"
  priority: "high" | "medium" | "low"
  status: "pending" | "completed" | "archived" // 统一状态管理
  isCompleted?: boolean // 兼容旧字段
  completedAt?: string
  isRepeating: boolean
  repeatPattern?: "daily" | "weekly" | "monthly" | "yearly"
  createdAt: string
}

// 服务记录类型
export interface CommunicationRecord {
  id: string
  contactId: string
  contactName: string
  type: "service" | "chat" | "wechat" | "call" | "other" | "meeting" | "visit" // 扩展类型
  content: string
  summary?: string
  date: string
  tags?: string[]
  promises?: string[] // 新增: 记录中的承诺/待办
  createdAt: string
}

// Mock 联系人数据
export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "王志刚",
    phone: "13800138001",
    company: "山河智能",
    title: "董事长",
    level: "S",
    tags: ["VIP", "老乡", "高尔夫"],
    notes: "非常重要，喜欢喝普洱",
    bio: "老乡会会长，湖南人，喜欢打高尔夫，每周五下午一般在球场。",
    location: "深圳·南山",
    birthday: "1975-03-15",
    lastContactDate: "2025-01-28",
    interactionFrequency: 7,
    servicePreferences: "喜欢安静, 手法要重",
    taboos: "腰部有旧伤",
    preferences: "❤️ 普洱茶, 🚫 海鲜",
    familyInfo: "儿子在英国留学",
    createdAt: "2024-06-15",
    isFavorite: true,
  },
  {
    id: "2",
    name: "李秀兰",
    phone: "13900139002",
    company: "锦绣资本",
    title: "合伙人",
    level: "A",
    tags: ["投资人", "红酒"],
    notes: "正在跟进A轮融资",
    bio: "上次在 GTC 大会认识的，聊了很久 AI 落地场景。",
    location: "北京·朝阳",
    lastContactDate: "2025-01-20",
    interactionFrequency: 14,
    preferences: "❤️ 红酒, 🚫 迟到",
    taboos: "不吃辣",
    createdAt: "2024-08-20",
    isFavorite: true,
  },
  {
    id: "3",
    name: "张伟",
    phone: "13700137003",
    company: "云创科技",
    title: "CTO",
    level: "B",
    tags: ["技术", "校友"],
    lastContactDate: "2024-12-10", // 逾期
    bio: "大学室友，现在在做云计算，技术大牛。",
    interactionFrequency: 30,
    createdAt: "2024-10-10",
    isFavorite: false,
  },
  {
    id: "4",
    name: "赵敏",
    phone: "13600136004",
    company: "中信证券",
    title: "客户经理",
    level: "B",
    tags: ["金融"],
    lastContactDate: "2024-11-05", // 逾期
    bio: "上次滑雪认识的，聊得很投缘。",
    interactionFrequency: 30,
    createdAt: "2024-11-05",
    isFavorite: false,
  },
  {
    id: "5",
    name: "孙强",
    phone: "13500135005",
    company: "博远物流",
    title: "总经理",
    level: "C",
    tags: ["新客"],
    lastContactDate: "2025-01-30",
    interactionFrequency: 60,
    createdAt: "2024-12-01",
    isFavorite: false,
  },
  {
    id: "6",
    name: "陈建国",
    phone: "13300133006",
    company: "建工集团",
    title: "副总",
    level: "A",
    tags: ["建筑", "老乡"],
    lastContactDate: "2025-01-25",
    interactionFrequency: 14,
    createdAt: "2024-09-01",
    isFavorite: true,
  }
]

// Mock 待办数据
export const mockTasks: Task[] = [
  {
    id: "1",
    title: "给王总送茶叶",
    description: "答应的普洱茶饼",
    contactId: "1",
    contactName: "王志刚",
    dueDate: "2025-02-04",
    dueTime: "14:00",
    type: "promise",
    priority: "high",
    status: "pending",
    isRepeating: false,
    createdAt: "2025-01-28",
  },
  {
    id: "2",
    title: "李总融资会议",
    contactId: "2",
    contactName: "李秀兰",
    dueDate: "2025-02-05",
    dueTime: "10:00",
    type: "appointment",
    priority: "high",
    status: "pending",
    isRepeating: false,
    createdAt: "2025-01-20",
  },
  {
    id: "3",
    title: "张伟生日祝福",
    contactId: "3",
    contactName: "张伟",
    dueDate: "2025-07-22",
    type: "birthday",
    priority: "medium",
    status: "pending",
    isRepeating: true,
    repeatPattern: "yearly",
    createdAt: "2025-01-01",
  },
  {
    id: "4",
    title: "赵敏长时间未联系提醒",
    contactId: "4",
    contactName: "赵敏",
    dueDate: "2025-01-25", // 逾期
    type: "care",
    priority: "low",
    status: "pending",
    isRepeating: false,
    createdAt: "2024-12-25",
  },
  {
    id: "5",
    title: "整理上周会议纪要",
    dueDate: new Date().toISOString().split("T")[0],
    type: "custom",
    priority: "medium",
    status: "completed",
    isCompleted: true,
    isRepeating: false,
    createdAt: "2025-01-29",
  }
]

// Mock 沟通记录 (补上)
export const mockRecords: CommunicationRecord[] = [
    {
        id: "1",
        contactId: "1",
        contactName: "王志刚",
        type: "service",
        content: "在公司茶室喝茶，聊到二期项目的回款问题。王总表示下个月底能解决。",
        summary: "沟通二期回款",
        date: "2025-01-28",
        createdAt: "2025-01-28",
        promises: ["下周寄合同", "送茶叶"]
    },
    {
        id: "2",
        contactId: "2",
        contactName: "李秀兰",
        type: "call",
        content: "电话沟通了融资计划书的修改意见，重点是市场规模部分。",
        summary: "融资BP修改",
        date: "2025-01-20",
        createdAt: "2025-01-20"
    }
]

// 辅助函数
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

export function getDaysSinceLastContact(lastContact?: string): number {
  if (!lastContact) return 999
  const last = new Date(lastContact)
  const today = new Date()
  const diffTime = today.getTime() - last.getTime()
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}
