// 核心数据模型 - 商务人脉/销售管理场景
// 适用于：个人老板、顶级销售、FA、合伙人

// 联系人 (Resource/Contact)
export interface Contact {
  id: string
  name: string
  avatar?: string
  
  // 核心身份 (Identity)
  company?: string      // 公司/组织
  title?: string        // 职位/头衔 (e.g. 采购总监, 创始人)
  industry?: string     // 行业 (e.g. 医疗, 互联网, 制造)
  location?: string     // 常驻地 (e.g. 苏州, 上海)
  
  // 联系方式
  phone: string
  wechat?: string
  email?: string
  
  // 商业价值 (Value)
  level: "S" | "A" | "B" | "C" | "D" 
  // S: 核心资源/金主 (定期维护, 甚至无需业务往来也要维护)
  // A: 重点客户/高意向 (主要精力投入)
  // B: 普通客户/发展中
  // C: 潜在线索/点头之交
  // D: 无效/黑名单
  
  decisionRole?: "decision_maker" | "influencer" | "gatekeeper" | "user" 
  // 决策角色: 拍板人 | 影响者 | 把关人 | 使用者
  
  dealStatus?: "lead" | "prospecting" | "negotiation" | "closed_won" | "closed_lost" | "maintenance"
  // 阶段: 线索 | 接触中 | 谈判/报价 | 已成交 | 已丢单 | 长期维护
  
  // 深度关系抓手 (The Hook - 用于拉近关系)
  hobbies?: string[]    // 爱好 (高尔夫, 普洱茶, 钓鱼)
  familyInfo?: string   // 家庭情报 (儿子下周高考, 妻子是老师)
  taboos?: string       // 忌讳 (不喝白酒, 忌辣, 不谈政治)
  birthday?: string
  
  // 维护节奏
  lastContactDate?: string   // 上次互动时间
  nextContactDate?: string   // 计划下次联系时间
  interactionFrequency?: number // 理想维护频率(天)
  
  // 其他
  tags: string[]        // 标签 (e.g. #资金方 #校友 #老乡)
  notes?: string        // 备注
  source?: string       // 来源 (e.g. 老张介绍, 行业峰会)
  createdAt: string
  isFavorite: boolean
}

// 任务/待办 (Action Item)
export interface Task {
  id: string
  title: string
  description?: string
  
  contactId?: string
  contactName?: string
  
  dueDate: string
  dueTime?: string
  
  // 任务类型 - 商务场景
  type: "follow_up" | "meeting" | "social" | "proposal" | "close" | "care" | "todo"
  // follow_up: 普通跟进 (电话/微信)
  // meeting: 正式会议/拜访
  // social: 饭局/喝茶/打球 (重要!)
  // proposal: 发方案/报价/合同
  // close: 缔结/签约/催款
  // care: 关怀 (生日/节日/祝贺)
  // todo: 杂事 (查资料/准备礼物)
  
  priority: "high" | "medium" | "low"
  status: "pending" | "completed" | "cancelled"
  completedAt?: string
  
  createdAt: string
}

// 互动记录 (Interaction Log)
export interface InteractionRecord {
  id: string
  contactId: string
  contactName: string
  
  date: string
  type: "online" | "call" | "meeting" | "meal" | "activity"
  // online: 微信/邮件
  // call: 电话
  // meeting: 会议/拜访
  // meal: 吃饭/喝酒
  // activity: 活动/打球
  
  location?: string     // 地点 (e.g. 半岛酒店, 他的办公室)
  participants?: string // 参与人 (e.g. 带了律师, 对方副总也在)
  
  content: string       // 核心内容 (聊了什么生意, 透露了什么情报)
  outcome?: string      // 结论/下一步 (e.g. 对价格有异议, 约下周看厂)
  
  actionItems?: string[] // 产生的待办
  
  mood?: "positive" | "neutral" | "negative" | "heated" 
  // 氛围: 积极 | 平淡 | 消极 | 激烈
  
  createdAt: string
}

// 兼容旧类型名 (为了让其他文件暂时不报错，逐步替换)
export type ServiceRecord = InteractionRecord;

// ------------------------------------------------------------------
// Mock Data (模拟真实的高端商务场景)
// ------------------------------------------------------------------

export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "王建国",
    title: "董事长",
    company: "华兴重工集团",
    industry: "制造业",
    location: "苏州",
    phone: "13800138001",
    level: "S",
    decisionRole: "decision_maker",
    dealStatus: "negotiation",
    hobbies: ["高尔夫", "普洱茶", "书法"],
    familyInfo: "儿子在美国读高中，喜欢聊教育话题",
    taboos: "痛风，不喝啤酒海鲜",
    birthday: "1970-03-15",
    tags: ["#大客户", "#资金充足", "#转型期"],
    notes: "集团正如火如荼搞数字化转型，预算充足，但决策流程长。",
    lastContactDate: "2025-01-28",
    nextContactDate: "2025-02-05",
    interactionFrequency: 14,
    createdAt: "2024-06-15",
    isFavorite: true,
  },
  {
    id: "2",
    name: "李薇",
    title: "合伙人",
    company: "云创资本",
    industry: "金融/VC",
    location: "上海",
    phone: "13900139002",
    level: "A",
    decisionRole: "influencer",
    dealStatus: "maintenance",
    hobbies: ["红酒", "滑雪"],
    familyInfo: "单身，养了两只猫",
    tags: ["#资金方", "#校友", "#资源丰富"],
    notes: "手里有很多TMT项目资源，可以互相推案子。",
    lastContactDate: "2025-01-20",
    interactionFrequency: 30,
    createdAt: "2024-08-20",
    isFavorite: true,
  },
  {
    id: "3",
    name: "陈刚",
    title: "采购总监",
    company: "贝克科技",
    industry: "互联网",
    phone: "13700137003",
    level: "B",
    decisionRole: "gatekeeper",
    dealStatus: "prospecting",
    hobbies: ["钓鱼"],
    tags: ["#关键人", "#难搞"],
    notes: "比较看重回扣和关系，需要私下攻克。",
    lastContactDate: "2025-01-10",
    createdAt: "2024-10-10",
    isFavorite: false,
  },
  {
    id: "4",
    name: "张总",
    title: "总经理",
    company: "未填",
    phone: "13600136004",
    level: "C",
    dealStatus: "lead",
    tags: ["#饭局认识", "#需回访"],
    notes: "上周饭局加的，好像是做物流的，待确认。",
    lastContactDate: "2024-12-25",
    createdAt: "2024-11-05",
    isFavorite: false,
  }
];

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "给王董送陈年普洱",
    description: "上次提过他喜欢喝老茶，正好搞到一饼，顺便聊聊合同细节",
    contactId: "1",
    contactName: "王建国",
    dueDate: "2025-02-05",
    type: "social",
    priority: "high",
    status: "pending",
    createdAt: "2025-01-28",
  },
  {
    id: "2",
    title: "李薇生日礼物准备",
    description: "记得买那种小众的红酒",
    contactId: "2",
    contactName: "李薇",
    dueDate: "2025-02-04",
    type: "care",
    priority: "medium",
    status: "pending",
    createdAt: "2025-01-20",
  },
  {
    id: "3",
    title: "跟进贝克科技采购进度",
    description: "陈刚说这周内部开会讨论",
    contactId: "3",
    contactName: "陈刚",
    dueDate: "2025-02-02",
    type: "follow_up",
    priority: "high",
    status: "pending",
    createdAt: "2025-01-28",
  }
];

export const mockRecords: InteractionRecord[] = [
  {
    id: "1",
    contactId: "1",
    contactName: "王建国",
    date: "2025-01-28",
    type: "meal",
    location: "江南灶",
    participants: "王董、李副总",
    content: "请王董吃饭，他透露了集团明年要上这套系统，预算大概在500万左右。但是李副总似乎倾向于竞品，需要留意。",
    outcome: "整体氛围不错，答应下周看我们的详细方案。",
    mood: "positive",
    createdAt: "2025-01-28",
  },
  {
    id: "2",
    contactId: "3",
    contactName: "陈刚",
    date: "2025-01-10",
    type: "call",
    content: "电话沟通了初步意向，态度比较冷淡，说还在对比几家。",
    outcome: "需要找机会见面聊。",
    mood: "neutral",
    createdAt: "2025-01-10",
  }
];

// 兼容导出
export const mockReminders = mockTasks;
export const mockCommunications = mockRecords;

export interface Tag {
    id: string
    name: string
    count: number
}

// 模拟标签统计 (实际应从 contacts 聚合)
export const mockTags: Tag[] = [
    { id: "1", name: "#资金方", count: 12 },
    { id: "2", name: "#大客户", count: 8 },
    { id: "3", name: "#政府关系", count: 5 },
    { id: "4", name: "#校友", count: 4 },
    { id: "5", name: "#高尔夫", count: 3 },
]

// 辅助函数：计算距离生日还有几天
export function getDaysUntilBirthday(birthday: string): number {
  if (!birthday) return 999;
  const today = new Date()
  const birth = new Date(birthday)
  const thisYearBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())

  if (thisYearBirthday < today) {
    thisYearBirthday.setFullYear(today.getFullYear() + 1)
  }

  const diffTime = thisYearBirthday.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// 辅助函数：计算距离上次联系的天数
export function getDaysSinceLastContact(dateStr?: string): number {
    if (!dateStr) return 999;
    const last = new Date(dateStr)
    const today = new Date()
    const diffTime = today.getTime() - last.getTime()
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}
