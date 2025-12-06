

## RTA · 待办客

RTA · 待办客 是一个基于 **Next.js App Router + TypeScript + Tailwind CSS** 的移动端优先个人客户与待办管理应用，帮助你在手机端高效管理联系人、待办、提醒与数据统计。

本文档基于当前项目代码结构（`app/` 路由、`components/` 组件、`lib/` 工具等）以及旧版文档（`README copy.md`）综合整理而成，更准确地描述了本仓库的实际功能。

---

## 技术栈概览

- **框架**：Next.js 16（App Router 模式，`app/` 目录）
- **语言**：TypeScript + React 19
- **样式**：Tailwind CSS 4（原子化样式，`app/globals.css`）
- **UI 组件**：Radix UI + 自定义业务组件（`components/`）
- **图标**：`lucide-react`
- **表单与校验**：`react-hook-form` + `zod`
- **数据与工具**：
  - `lib/mock-data.ts`：本地 mock 数据（任务、联系人等）
  - `lib/utils.ts`：工具函数（如 `cn` 样式合并）

---

## 目录结构（核心部分）

```text
app/
  auth/            # 认证相关页面（登录 / 注册）
  contacts/        # 联系人管理
    [id]/          # 联系人详情及记录
    new/           # 新建联系人
  reminders/       # 提醒 / 待办
    new/           # 新建提醒
  tasks/           # 任务管理
    new/           # 新建任务
  statistics/      # 数据统计
  profile/         # 个人中心
  layout.tsx       # 根布局（全局样式与 meta）
  page.tsx         # 首页「今日概览」
  globals.css      # Tailwind 配置与主题变量

components/
  bottom-nav.tsx   # 底部导航栏
  contact-card.tsx # 联系人卡片
  task-card.tsx    # 任务卡片
  reminder-card.tsx# 提醒卡片
  quick-*.tsx      # 快捷入口 / 弹窗组件
  ui/              # 基础 UI 组件（按钮、输入框、对话框等）

lib/
  mock-data.ts     # Mock 数据与计算工具
  utils.ts         # 通用工具函数（如 cn）
```

---

## 功能模块说明

### 1. 首页仪表盘（`/`，`app/page.tsx`）

- **今日任务概览**：
  - 逾期任务数
  - 今日待办数量
  - 需要联系的客户数量
- **逾期任务区块**：
  - 按到期时间排序
  - 支持一键勾选完成
  - 点击跳转到任务详情（`/tasks/[id]`，预留）
- **今日任务区块**：
  - 仅展示今天到期的任务
  - 支持标记完成 / 查看详情
- **需要联系的客户**：
  - 基于 `mockContacts` 及最近联系时间计算
  - 列出「长期未联系」的联系人，便于回访
- **生日提醒**：
  - 7 天内生日的联系人
  - 直接跳转至联系人详情
- **快捷操作**：
  - 「添加客户」：跳转 `/contacts/new`
  - 「新建待办」：跳转 `/tasks/new`
- **全局底部导航**：
  - 引用 `components/bottom-nav.tsx`

### 2. 用户认证（`/auth/*`）

- **登录页**：`/auth/login`
- **注册页**：`/auth/register`
- UI 采用表单 + 验证 + 按钮组件，暂使用本地提交（可后续接入真实接口）。

> 当前项目未实现完整的鉴权守卫逻辑（如路由守卫、Token 校验），但路由结构已预留，可根据业务接入。

### 3. 联系人管理（`/contacts`）

- **联系人列表**：`/contacts/page.tsx`
  - 展示联系人基础信息、标签、重要程度等
  - 支持筛选 / 排序（如 A/B/C 分类、需联系等）
  - 使用 `ContactCard` 组件渲染每一条记录
- **联系人详情**：`/contacts/[id]/page.tsx`
  - 显示完整信息（姓名、联系方式、标签、备注等）
  - 关联的任务、提醒、最近沟通记录
- **沟通记录**：`/contacts/[id]/record/page.tsx`
  - 记录与该联系人的沟通内容、时间、方式
  - 为日后回顾与分析提供依据
- **新增联系人**：`/contacts/new/page.tsx`
  - 多步骤/分组表单
  - 字段示例：姓名、手机、渠道、客户级别、备注等

### 4. 任务与提醒

- **任务列表**：`/tasks/page.tsx`
  - 展示所有任务，支持状态 / 优先级区分
  - 使用 `TaskCard` 渲染，支持勾选完成
  - 配合 `app/tasks/loading.tsx` 显示加载骨架
- **新建任务**：`/tasks/new/page.tsx`
  - 表单字段示例：标题、关联联系人、截止日期、优先级、备注等
- **提醒列表**：`/reminders/page.tsx`
  - 按状态（全部 / 待办 / 已完成）筛选
  - 使用 `ReminderCard` 展示提醒，支持状态切换
  - 对关键提醒有优先级高亮
- **新建提醒**：`/reminders/new/page.tsx`
  - 结合日期选择、优先级选择等 UI 组件
  - 对接任务 / 联系人等上下文

### 5. 数据统计（`/statistics`）

- **核心数据概览**：
  - 客户总数、完成任务数、待办数量等
- **时间维度筛选**：
  - 本周 / 本月 / 本季度等
- **图表展示**：
  - 使用 `recharts` 与内部 `chart` 组件
  - 客户来源、任务完成趋势、沟通频率等

### 6. 个人中心（`/profile`）

- 展示用户基础信息（昵称、头像等）
- 预留设置入口：通知设置、隐私安全、主题切换等
- 退出登录按钮（可与实际鉴权系统对接）

---

## 全局 UI 与交互

- **全局布局**：`app/layout.tsx`
  - 引入 `app/globals.css`
  - 配置 `Metadata` 与 `Viewport`（PWA、主题色等）
- **全局样式与主题**：`app/globals.css`
  - 使用 CSS 变量定义浅色 / 深色主题
  - 定义 `--primary`、`--urgent` 等业务语义色
  - 定义通用动画（如 `.animate-slide-up`）
  - 移动端适配（安全区、隐藏滚动条等）
- **基础 UI 组件**：`components/ui/*`
  - Button、Input、Dialog、Tabs、Toast 等
  - 基于 Radix + Tailwind 封装，保证一致的交互体验

---

## 本地开发与启动

> 当前仓库是 **Next.js 项目**，不是 Nuxt/Vue 项目，请使用 Node 18+ 环境。

- **安装依赖**

```bash
cd /Users/jiangwnchang/Desktop/app/p-crm/p-crm/p-rta
npm install
```

- **启动开发环境**

```bash
npm run dev
```

默认访问：`http://localhost:3000`

- **构建生产版本**

```bash
npm run build
```

- **启动生产环境**

```bash
npm start
```

---

## 后续可扩展方向

- 接入真实后端 API（登录、联系人、任务、统计数据等）
- 完善鉴权体系（JWT / Session、路由守卫、权限控制）
- 增加多端适配（Pad、PC 简化版）
- 增强数据分析模块（自定义报表、多维度筛选）

---

## 许可证

本项目默认为个人学习 / 内部使用，如需对外开源或商用，请根据实际情况补充 LICENSE 说明。


