# CLAUDE.md

本文件为 Claude Code（claude.ai/code）在本代码仓库中工作时提供指导。

---

## 项目概述

**AiVolo.studio** — AI 图片/视频生成工具，面向欧洲、南美、东南亚市场。核心功能：文生图、图生图、文生视频、图生视频，通过模板系统降低使用门槛。

**核心价值主张**：简单（秒懂操作）、酷炫（TikTok热门）、便宜（外包成本1/100）

**目标市场优先级**：欧洲 > 南美 > 东南亚 > 北美

---

## 项目状态

**当前阶段**：第一阶段（MVP）— 需求调研已完成，开发计划已制定

**状态说明**：
- ✅ 四阶段功能规划已完成（基于 Deep Interview）
- ✅ 开发计划文档已生成：`DEVELOPMENT_PLAN.md`
- ⏳ 等待 UI 设计风格确认后开始 UI 开发
- ⏳ 等待功能需求验证结果后开始功能开发

**可立即执行的任务**：
- Next.js 项目初始化
- Supabase 配置 + 数据库设计
- Google OAuth 配置
- GitHub 仓库创建
- 页面骨架搭建

---

## 技术栈

| 层次 | 方案 | 说明 |
|------|------|------|
| 前端框架 | Next.js 15 + React + Tailwind CSS + shadcn/ui | |
| 数据库 | Supabase Postgres + RLS | |
| 媒体存储 | Cloudflare R2 + 临时签名链接 | 免费 10GB/月 |
| 部署 | Vercel + GitHub 自动部署 | |
| DNS/CDN | Cloudflare | |
| 收款 | Creem.io + Wise | |
| 多语言 | next-intl 9.x | |
| Auth | Supabase Auth + Google OAuth | 仅此一种，无邮箱登录 |

**API 配置**：
- 第一阶段：用户提供的中转 API（OpenAI 格式兼容）
- 第二阶段：API 聚合供应商（约 10 个模型）

---

## 项目结构

```
AiVolo.studio/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # 首页
│   │   ├── create/             # 生成页
│   │   ├── pricing/            # 定价页
│   │   ├── account/            # 账户页
│   │   ├── models/             # 模型广场
│   │   ├── templates/          # 模板列表
│   │   ├── terms/              # 用户协议
│   │   ├── privacy/            # 隐私政策
│   │   ├── refund/             # 退款政策
│   │   └── contact/            # 联系我们
│   ├── components/             # UI 组件
│   ├── lib/                    # 工具函数
│   ├── hooks/                  # 自定义 Hooks
│   └── styles/                 # 全局样式
├── .omc/                       # OMC 工作目录
│   ├── specs/                  # Deep Interview 规格文档
│   └── plans/                  # 开发计划
├── src/reference/              # 参考代码
│   └── multi-agent-image/       # multi-agent-image 参考实现
├── SPEC.md                     # 产品规格文档
├── DEVELOPMENT_PLAN.md          # 开发计划（当前活动文档）
└── CLAUDE.md                   # 本文件
```

---

## 开发阶段（四阶段）

| 阶段 | 完成度 | 时间目标 | 核心功能 |
|------|--------|---------|---------|
| **第一阶段（MVP）** | ~30% | 7 天 | 登录 + 文生图 + 订阅 UI + 三件套 + 部署 |
| **第二阶段** | 70-80% | 7-10 天 | 多模型 + 模板 + 多语言(11种) + Creem 支付 + 模型广场 |
| **第三阶段** | 20-30% | 待定 | 电商模板(20个) + 智能缓存层 |
| **第四阶段** | 可选 | 待定 | 数据分析 |

---

## 首页结构（简化版，非 7+1 屏）

第一阶段 MVP 首页包含：

| 区域 | 内容 | 状态 |
|------|------|------|
| **Hero** | 大标题 + 产品定位语 | 待实现 |
| **生成框** | 提示词输入 + 模型下拉 + 比例选择 + 生成按钮 | 待实现 |
| **定价卡片** | 4 档定价（月付/年付切换） | 待实现 |
| **底部** | 导航 + 三件套链接 | 待实现 |
| **右上角** | 用户头像 + 积分余额（登录后显示） | 待实现 |

**不在第一阶段**：模型墙、模板推荐区、FAQ 独立屏、移动端适配

---

## 页面结构

| 页面 | URL | 说明 |
|------|-----|------|
| 首页 | `/` | Hero + 生成框 + 定价卡片 + 底部三件套 |
| 生成页 | `/create` | 提示词输入 + 模型选择 + 比例选择 + 生成按钮 + 结果展示 |
| 定价页 | `/pricing` | 月付/年付 Tab + 4 档定价 + Coming Soon 按钮 |
| 账户页 | `/account` | 个人信息 + 积分余额 + 生成历史（时间/提示词/缩略图）+ 下载 |
| 模型广场 | `/models` | 模型列表页 |
| 模型详情页 | `/model/[slug]` | SEO 内容 + 内嵌生成框（预设当前模型） |
| 模板列表 | `/templates/[category]` | 热门/电商/室内设计 |
| 模板详情 | `/template/[slug]` | 示例展示 + 使用按钮 |
| Bug 反馈浮窗 | 全局右下角 | 所有页面显示 |

**过审三件套**：`/terms` `/privacy` `/refund` `/contact`

---

## 核心架构

### 数据流架构

```
用户层 → 产品封装层 → 模型能力层 → 高可用路由层 → 供应商API
            ↑
    Prompt工程师Agent / 风格研究员Agent / 场景变异引擎 / 设计编译器 / 智能缓存层
```

**三层封装**：
1. **产品封装层**：Prompt工程师Agent → 设计编译器 → SmartCache
2. **模型能力层**：用户选模型（GPT image2 / DALL-E 3 等），与供应商正交
3. **高可用路由层**：3家供应商自动故障转移，同一时刻只有一家服务

### 高可用路由层（第二阶段）

- **健康检查**：主动（几小时一次）+ 被动（失败即检测）
- **切换逻辑**：一次失败即切换，不让用户等待
- **用户感知**：用户无感知，始终只看到 loading 状态
- **日志记录**：记录所有切换用于成本分析

### 智能缓存层（第三阶段）

- **缓存匹配**：使用 `final_prompt`（加工后提示词）计算相似度，阈值 85%
- **拟态加载**：缓存命中时模拟真实生成（图片 30 秒，视频 60 秒）
- **存储**：`generations_cache` 表，Postgres 主存储 + Redis 热点缓存

### 积分扣除（关键安全设计）

**必须用 Postgres RPC 原子操作**：`create_generation_atomic` RPC
- 扣积分 + 创建任务记录在同一个事务中
- 防止超扣风险

### 生成管线

- **图片**：同步，实时返回
- **视频**：异步，Webhook 主推 + 前端每 2 秒轮询兜底

---

## 数据库表设计

| 表名 | 说明 |
|------|------|
| `users` | 用户信息（Google OAuth） |
| `subscriptions` | 订阅记录 |
| `credits_transactions` | 积分流水（必须做对账） |
| `generations` | 生成任务（含 cost_usd 字段做毛利分析） |
| `generations_cache` | 智能缓存表（第三阶段） |
| `models` | 模型配置（新增模型 INSERT 一行不改代码） |
| `templates` | 模板配置 |
| `webhooks_log` | Webhook 日志（event_id 唯一索引防重） |

### 生成结果存储策略

| 会员等级 | 存储时长 | 说明 |
|---------|---------|------|
| 免费用户 | 7 天 | 试用后清理 |
| Lite | 30 天 | 月度会员权益 |
| Pro | 1 年 | 年度会员权益 |

**参考图**：用完即删，不存储（节省 R2 空间）

---

## 关键设计决策

1. **模型能力层与供应商正交**：用户选模型，高可用路由层选供应商
2. **缓存匹配用 final_prompt**：加工后的提示词更标准化
3. **积分扣除必须用 Postgres RPC 原子操作**：防超扣
4. **拟态加载机制**：缓存命中时模拟真实生成流程，确保体验一致
5. **仅 Google OAuth**：不做邮箱登录降级
6. **内容风控**：不做法令内容审查（海外市场尺度较大）

---

## OMC Agent Teams 工作流（强制要求）

**本项目必须遵循 OMC Agent Teams 工作流程。所有专业工作必须委托给专业 Agent，主窗口不允许直接执行多文件修改、代码重构、调试、评审、规划、研究、验证等工作。**

### 工作分配原则

| 工作类型 | 处理方式 |
|---------|---------|
| 多文件修改、代码重构、调试、评审、规划、研究、验证 | **必须委派给专业 Agent** |
| 简单操作、问题澄清、单个命令执行 | 主窗口直接处理 |
| 复杂工作（架构设计、深度分析） | 委派给 `executor`（model=opus） |

### 模块划分与 Agent 分配

| 模块 | 主要 Agent | 并行任务 |
|------|-----------|---------|
| 前端 | `designer` | 首页/生成页/定价页/账户页 可并行 |
| 后端 | `executor` | API/积分系统/数据库 可并行 |
| 运维 | `git-master` | 部署/R2配置/域名解析 |
| 评审 | `code-reviewer` | 代码质量审查 |

### 可用 Agent（通过 /oh-my-claudecode:<name> 调用）

| Agent | 职责 | 模型 |
|-------|------|------|
| `explore` | 快速代码搜索、技术调研 | haiku |
| `analyst` | 需求 gap 分析 | opus |
| `planner` | 制定实施计划、任务分解 | opus |
| `architect` | 架构设计、调试分析 | opus |
| `debugger` | 根因分析、编译错误修复 | sonnet |
| `executor` | 精确实现代码，最小化改动 | sonnet |
| `designer` | UI 实现、组件开发 | sonnet |
| `test-engineer` | 测试编写与执行 | sonnet |
| `verifier` | 验证策略、证据收集 | sonnet |
| `tracer` | 因果追溯、证据追踪 | sonnet |
| `code-reviewer` | 代码质量审查 | opus |
| `code-simplifier` | 代码简化、重构 | opus |
| `security-reviewer` | 安全审计（OWASP） | sonnet |
| `document-specialist` | 文档、API 研究 | sonnet |
| `git-master` | Git 操作、安全合并 | sonnet |
| `qa-tester` | CLI 测试、集成验证 | sonnet |
| `scientist` | 数据分析、研究执行 | sonnet |
| `writer` | 文档编写 | haiku |
| `critic` | 计划/代码评审、质量门禁 | opus |

### 触发关键词

- `"autopilot"` → 启动自动驾驶模式
- `"ralph"` → 启动团队 pipeline
- `"ulw"` → ultrawork 模式
- `"deep interview"` → 深度访谈模式
- `"tdd"` → TDD 开发模式

### 验证规则

完成前必须验证。按任务规模选择：small→haiku、standard→sonnet、large/security→opus。验证失败时持续迭代。

---

## 验收标准（按阶段）

### 第一阶段（MVP）验收标准

- [ ] 网站可访问：首页 /create /pricing /account 全部可访问
- [ ] Google OAuth 登录：完整登录流程
- [ ] 文生图功能：单模型，真实 API 调用，完整流程
- [ ] 生成结果：用户可看到图片并下载
- [ ] 积分系统：新用户 20 积分，生成扣除积分，余额多端显示
- [ ] 订阅页 UI：月付/年付 Tab 切换，4 档定价，Coming Soon 按钮
- [ ] 三件套：用户协议 / 隐私政策 / 退款政策 / 联系我们（URL 可访问）
- [ ] 部署上线：Vercel 部署 + DNS 解析 AiVolo.studio

### 第二阶段验收标准

- [ ] 多模型支持（约 10 个）
- [ ] 图生图 + 文生视频 + 图生视频（单图）
- [ ] 高可用路由层（故障转移）
- [ ] 模板系统（40 个模板，2 类）
- [ ] 多语言（11 种）
- [ ] Creem.io 真实支付 + 退款
- [ ] 模型广场（10 个详情页）
- [ ] Bug 反馈浮窗
- [ ] 生成结果存储策略

---

## 依赖关系

```
第一阶段（7天）
    ↓
任务 1-2（Next.js 初始化） ──┐
任务 3-4（Supabase 配置）  ──┼── 并行
任务 5（Google OAuth）     ──┤
任务 7（GitHub 仓库）     ──┘
    ↓
任务 8（页面骨架）
    ↓
任务 10-17（UI + 功能实现）
    ↓
部署上线

第二阶段（7-10天）
    ↓
多模型接入 + 高可用路由层 ──┐
模板系统                 ──┼── 可并行
多语言 + Creem 支付       ──┤
模型广场 + Bug浮窗         ──┘

第三阶段
    ↓
电商模板 + 智能缓存层

第四阶段（可选）
    ↓
数据分析
```

---

## 风险清单

| 风险 | 影响 | 应对措施 |
|------|------|---------|
| UI 设计风格未确定 | UI 开发无法开始 | 先做架构和数据库工作 |
| 功能需求待验证 | 可能需要调整 | 先做基础功能，验证后再扩展 |
| API 中转稳定性 | 生成功能受影响 | 第二阶段做高可用路由层 |
| R2 存储空间耗尽 | 生成结果无法保存 | 实施存储策略，定期清理 |

---

## 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | `HeroSection.tsx` |
| 页面 | kebab-case | `account-history.tsx` |
| 工具函数 | camelCase | `formatCredits.ts` |
| 数据库表 | snake_case | `credits_transactions` |
| API 路由 | kebab-case | `/api/generate/image` |
| 模板 ID | `{type}_{num}` | `hot_img_01` |
| 模型 Slug | kebab-case | `gpt-image-2` |

---

## 上下文加载

- `.omc/specs/deep-interview-aivolo-mvp.md` — Deep Interview MVP 规格
- `.omc/specs/deep-interview-*.md` — 其他阶段规格
- `DEVELOPMENT_PLAN.md` — 当前开发计划
- `SPEC.md` — 产品规格文档（核心功能定义）

---

*最后更新：2026-04-28*
*状态：规划完成，待 UI 风格和功能验证确认后开始开发*
