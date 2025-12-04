"use client"

import { useState } from "react"
import {
  BookOpen,
  Users,
  Bell,
  BarChart3,
  HelpCircle,
  Search,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  MessageCircle,
  FileText,
  ExternalLink,
} from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { BottomNav } from "@/components/bottom-nav"
import { cn } from "@/lib/utils"

type HelpSectionId = "overview" | "contacts" | "tasks" | "statistics"

const helpSections = [
  {
    id: "overview" as HelpSectionId,
    title: "系统概览",
    icon: BookOpen,
    color: "text-blue-600",
    content: {
      description:
        "RTA · 待办客 是一个专为移动端设计的个人客户关系管理系统，帮助您高效管理客户信息、跟进待办事项、提升工作效率。",
      features: [
        "今日视图 - 首页聚合显示逾期任务、今日待办、需联系客户和生日提醒",
        "快捷统计 - 顶部卡片展示已逾期、今日待办、需联系的数量",
        "逾期任务 - 自动识别并醒目展示已过期的任务",
        "生日提醒 - 显示7天内生日的联系人",
        "快捷操作 - 一键添加客户或新建待办",
      ],
    },
  },
  {
    id: "contacts" as HelpSectionId,
    title: "联系人管理",
    icon: Users,
    color: "text-green-600",
    content: {
      description:
        "联系人管理是系统的核心功能，帮助您建立完整的客户档案，跟踪客户互动，管理客户关系。",
      features: [
        "客户档案创建 - 支持详细的客户信息录入（姓名、公司、电话、标签等）",
        "客户分类管理 - 按 A/B/C 等级筛选，支持收藏和需联系筛选",
        "搜索功能 - 支持按姓名、公司、电话、标签搜索",
        "排序功能 - 支持按级别、最近联系时间、姓名排序",
        "需联系提醒 - 根据联系频率自动计算并提醒需要跟进的客户",
      ],
    },
  },
  {
    id: "tasks" as HelpSectionId,
    title: "任务与提醒",
    icon: Bell,
    color: "text-orange-600",
    content: {
      description: "任务与提醒模块帮助您管理待办事项，包括任务管理和提醒管理两个部分。",
      features: [
        "任务分类 - 按逾期、今天、以后、已完成四类查看任务",
        "任务创建 - 设置任务标题、关联联系人、截止日期和优先级",
        "任务搜索 - 支持按任务标题或关联客户名搜索",
        "提醒管理 - 独立的提醒模块，支持跟进、生日、会议、电话等类型",
        "状态筛选 - 提醒支持按待办、已完成、全部状态筛选",
      ],
    },
  },
  {
    id: "statistics" as HelpSectionId,
    title: "数据分析",
    icon: BarChart3,
    color: "text-purple-600",
    content: {
      description: "强大的数据分析功能，帮助您了解业务趋势，优化工作策略。",
      features: [
        "时间范围切换 - 支持按本周、本月、本季度查看数据",
        "核心数据统计 - 联系人总数、常联系、沟通记录、已完成提醒",
        "标签分布 - 展示客户标签的分布情况",
        "活跃度图表 - 可视化展示一周内的跟进活跃度",
        "实时更新 - 数据实时反映当前工作状态",
      ],
    },
  },
]

const faqs = [
  {
    question: "如何添加新客户？",
    answer: "在首页「快捷操作」区域点击「添加客户」，或在联系人页面点击右上角「+」按钮，填写客户基本信息（姓名、公司、联系方式、客户等级、标签等），保存后即可开始跟进。",
  },
  {
    question: "如何创建待办任务？",
    answer: "在首页「快捷操作」区域点击「新建待办」，或在任务页面点击右上角「+」按钮，填写任务标题、选择关联联系人、设置截止日期和优先级，保存后任务会出现在相应的分类中。",
  },
  {
    question: "如何查看需要联系的客户？",
    answer: "系统会根据客户设置的「联系频率」和最近联系时间自动计算，在首页「该联系了」区块和联系人页面的「需联系」筛选项中展示。",
  },
  {
    question: "任务如何分类显示？",
    answer: "任务页面支持按「逾期」、「今天」、「以后」、「已完成」四类查看。系统会根据任务的截止日期自动分类，逾期和今天的任务也会在首页显示。",
  },
  {
    question: "如何查看工作数据统计？",
    answer: "点击底部导航的「统计」按钮，可以查看联系人总数、沟通记录、提醒完成情况等核心数据，支持按本周、本月、本季度切换时间范围。",
  },
  {
    question: "如何搜索客户或任务？",
    answer: "在联系人页面，搜索框支持按姓名、公司、电话、标签搜索；在任务页面，搜索框支持按任务标题或关联客户名搜索。",
  },
  {
    question: "忘记密码怎么办？",
    answer: "当前版本支持「跳过登录体验演示」，可以直接使用。后续接入账号体系后，可在登录页面点击「忘记密码」，通过手机号或邮箱验证后重置密码。",
  },
  {
    question: "数据安全如何保障？",
    answer: "当前版本数据保存在本地浏览器中，主要用于功能演示。后续接入账号体系后将采用 SSL 加密传输，数据存储在安全的云端服务器，定期备份，确保您的数据安全。",
  },
]

const contactInfo = [
  {
    icon: Phone,
    title: "客服热线",
    value: "400-123-4567",
    description: "工作日 9:00-18:00",
  },
  {
    icon: Mail,
    title: "邮箱支持",
    value: "support@rta.com",
    description: "24小时内回复",
  },
  {
    icon: MessageCircle,
    title: "在线客服",
    value: "点击咨询",
    description: "实时在线支持",
  },
]

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState<HelpSectionId>("overview")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="帮助中心" showBack />

      <main className="px-4 py-4 space-y-6">
        {/* 搜索框 */}
        <section className="bg-card rounded-xl border border-border p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="搜索帮助内容..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
        </section>

        {/* 快速导航 */}
        <section className="bg-card rounded-xl border border-border p-4">
          <h2 className="text-lg font-semibold mb-4">快速导航</h2>
          <div className="grid grid-cols-2 gap-3">
            {helpSections.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-colors",
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={cn("w-5 h-5", section.color)} />
                    <span className="text-sm font-medium">{section.title}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* 内容区域 */}
        <section className="bg-card rounded-xl border border-border p-6">
          {helpSections.map((section) => {
            const Icon = section.icon
            if (activeSection !== section.id) return null

            return (
              <div key={section.id}>
                <div className="flex items-center gap-3 mb-4">
                  <Icon className={cn("w-6 h-6", section.color)} />
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                </div>

                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">{section.content.description}</p>

                  <div>
                    <h3 className="text-lg font-medium mb-3">主要功能</h3>
                    <ul className="space-y-2">
                      {section.content.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </section>

        {/* 常见问题 */}
        <section className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            常见问题
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = expandedFaq === index
              return (
                <div key={index} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : index)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium">{faq.question}</span>
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-3">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* 联系我们 */}
        <section className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl font-semibold mb-4">联系我们</h2>
          <p className="text-muted-foreground mb-4">
            如果您在使用过程中遇到问题，可以通过以下方式联系我们：
          </p>

          <div className="space-y-4">
            {contactInfo.map((contact, index) => {
              const Icon = contact.icon
              return (
                <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{contact.title}</h3>
                    <p className="text-primary font-medium">{contact.value}</p>
                    <p className="text-sm text-muted-foreground">{contact.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 使用手册下载 */}
        <section className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold text-primary">使用手册</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            下载完整的使用手册，包含详细的功能说明和操作指南。
          </p>
          <div className="space-y-2">
            <button className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm">RTA · 待办客 用户手册 (PDF)</span>
            </button>
            <button className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm">快速入门指南 (PDF)</span>
            </button>
            <button className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm">视频教程</span>
            </button>
          </div>
        </section>

        {/* 版本信息 */}
        <div className="text-center text-sm text-muted-foreground space-y-1 pb-2">
          <p>RTA · 待办客 v1.0.0</p>
          <p className="mt-1">© 2024 RTA. All rights reserved.</p>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}


