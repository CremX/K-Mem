// 客户等级定义 (Value Levels) - 高端版
export const LEVEL_CONFIG = {
  S: {
    label: "S级 · 核心",
    description: "核心资源、金主、战略合作伙伴",
    // 视觉升级：黑金/钻石质感
    color: "text-[#FFD700]", // 纯金
    textColor: "text-[#FFD700]",
    bgColor: "bg-gradient-to-br from-[#FFD700] to-[#B8860B]", // 金色渐变
    bgLight: "bg-[#FFD700]/10",
    border: "border-[#FFD700]/30",
    icon: "Gem", // 钻石图标
    frequency: 14, 
  },
  A: {
    label: "A级 · 重点",
    description: "高意向客户、关键决策人",
    // 视觉升级：银色/铂金
    color: "text-[#E0E0E0]", // 银白
    textColor: "text-[#E0E0E0]",
    bgColor: "bg-gradient-to-br from-[#E0E0E0] to-[#A0A0A0]", // 银色渐变
    bgLight: "bg-[#E0E0E0]/10",
    border: "border-[#E0E0E0]/30",
    icon: "Shield", // 盾牌
    frequency: 30, 
  },
  B: {
    label: "B级 · 普通",
    description: "正常跟进、发展中客户",
    // 视觉升级：青铜/深铜
    color: "text-[#CD7F32]", // 铜色
    textColor: "text-[#CD7F32]",
    bgColor: "bg-gradient-to-br from-[#CD7F32] to-[#8B4513]", // 铜色渐变
    bgLight: "bg-[#CD7F32]/10",
    border: "border-[#CD7F32]/30",
    icon: "User",
    frequency: 60, 
  },
  C: {
    label: "C级 · 线索",
    description: "潜在客户、一面之缘",
    // 视觉升级：深灰/低调
    color: "text-slate-400",
    textColor: "text-slate-400",
    bgColor: "bg-slate-700",
    bgLight: "bg-slate-700/30",
    border: "border-slate-700/50",
    icon: "User",
    frequency: 90, 
  },
  D: {
    label: "D级 · 无效",
    description: "暂无价值、已流失",
    color: "text-slate-600",
    textColor: "text-slate-600",
    bgColor: "bg-slate-800",
    bgLight: "bg-slate-800/30",
    border: "border-slate-800/50",
    icon: "XCircle",
    frequency: 180,
  }
} as const;

export type ContactLevel = keyof typeof LEVEL_CONFIG;

// 商务场景标签 (Quick Tags for Business)
export const BUSINESS_TAGS = [
  { id: "hot", label: "高意向", color: "red" },
  { id: "warm", label: "跟进中", color: "blue" },
  { id: "decision_maker", label: "决策人", color: "purple" },
  { id: "gatekeeper", label: "把关人", color: "orange" },
  { id: "money", label: "资金方", color: "green" },
  { id: "resource", label: "渠道资源", color: "cyan" },
];

// 任务类型配置 - 图标映射需在组件中处理
export const TASK_TYPES = {
  social: { label: "应酬/饭局", icon: "Utensils", color: "text-orange-400" },
  meeting: { label: "会议/拜访", icon: "Briefcase", color: "text-blue-400" },
  follow_up: { label: "跟进", icon: "Phone", color: "text-green-400" },
  proposal: { label: "方案/合同", icon: "FileText", color: "text-purple-400" },
  close: { label: "缔结/收款", icon: "DollarSign", color: "text-red-400" },
  care: { label: "关怀", icon: "Gift", color: "text-pink-400" },
  todo: { label: "待办", icon: "CheckSquare", color: "text-slate-400" },
} as const;
