# AiVolo.studio / Codex Root Rules

本文件是 `AiVolo.studio` 仓库的根级工作规则。除非另有说明，以下规则适用于仓库内所有子目录。

## 1. 事实源与优先级

- 产品规格以 [docs/development/SPEC_V2.md](./docs/development/SPEC_V2.md) 为准。
- 开发计划以 [docs/development/DEVELOPMENT_PLAN_V2.md](./docs/development/DEVELOPMENT_PLAN_V2.md) 为准。
- [docs/archive/SPEC.md](./docs/archive/SPEC.md) 与 [docs/archive/DEVELOPMENT_PLAN.md](./docs/archive/DEVELOPMENT_PLAN.md) 已废弃，只在用户明确要求时参考。
- 若文档、代码、口头说明冲突，以最新的 `V2` 文档和当前任务要求为准。
- 不要把未确认的推测写进文档或代码。

## 2. 项目结构

| 路径 | 用途 |
| --- | --- |
| `src/app/` | Next.js App Router 页面与 API routes |
| `src/components/` | 业务组件与 UI 组件 |
| `src/lib/` | Supabase、R2、产品配置、服务端工具函数 |
| `src/hooks/` | React hooks |
| `src/types/` | TypeScript 类型定义 |
| `docs/development/` | 当前有效的产品规格、开发计划、上线保护制度 |
| `docs/archive/` | 已废弃历史文档，只在用户明确要求时参考 |
| `docs/research/` | 调研资料 |
| `references/` | 参考实现与外部样例，不是运行时代码 |
| `design-system/` | 设计系统资料 |
| `scripts/` | 本地验证、生产保护和辅助脚本 |
| `tests/e2e/` | Playwright E2E 测试 |
| `.env.local` | 本地私密环境变量，不提交 |
| `.next/`、`node_modules/`、`test-results/`、`playwright-report/` | 生成产物或依赖目录，不手工编辑 |

## 3. 工作原则

- 先理解，再修改。
- 先确认范围，再动手。
- 只做当前任务需要的改动，不要顺手重构无关内容。
- 遇到需求、架构、数据口径不清晰时，先查仓库和文档，再判断是否需要追问。
- 对于高风险变更，优先保证可验证、可回滚、可审计。

## 4. 默认沟通方式

- 默认使用中文回复用户。
- 说明要简洁、事实化、可执行。
- 开始复杂工作前，先发一条简短进展说明。
- 长任务过程中，如有必要，持续给出简短状态更新。
- 如果任务未完成，明确说明当前状态，不要暗示已完成。

## 5. 调研与阅读

- 分析、检索、对比、统计、转换等工作，优先用 `ctx_*` 工具完成。
- 读取大文件、日志、数据文件时，优先用 `ctx_execute_file`。
- 网络内容优先用 `ctx_fetch_and_index` + `ctx_search`，不要直接把原始网页内容拉进上下文。
- 禁止用 `curl`、`wget` 或 shell 内联 HTTP 做临时抓取。
- 需要总结仓库状态时，优先基于实际文件和工具结果，不要凭记忆下结论。

## 6. 代码修改

- 所有手工编辑必须使用 `apply_patch`。
- 变更要精确、局部、可审查。
- 不要重写用户未要求的文件，不要回滚别人的改动。
- 默认不做破坏性操作，如 `git reset --hard`、强制覆盖、删除文件夹等，除非用户明确要求。
- 保持现有技术栈、命名风格、目录结构和代码习惯。
- 涉及安全、计费、积分、认证、数据库时，优先采用原子操作、显式错误处理和可追踪记录。

## 7. 验证要求

- 改完代码后，尽量运行对应的 build / lint / typecheck / test。
- 对 UI 或交互改动，必要时做截图或浏览器验证。
- 对数据库、支付、认证、退款、积分等关键路径，必须检查边界和失败路径。
- 不能因为“看起来没问题”就跳过验证。

## 8. 多 Agent 协作

- 只有在任务明确适合拆分时，才使用多 Agent。
- 可并行的任务要并行，串行依赖要严格串行。
- 每个 Agent 必须有清晰的职责边界和文件边界。
- 不同 Agent 不要修改同一写入范围，除非主控已明确协调。
- 主控 Agent 负责整合、复核和最终结论。
- Review、测试、修复、再验证必须形成闭环，不能只停留在“代码写完”。

## 9. Git 与提交

- 只在任务需要时提交或推送。
- 提交前先检查 `git diff`，确保没有无关文件、密钥、临时产物。
- 提交信息要准确反映改动内容。
- 未经用户要求，不要擅自做破坏性 git 操作或重写历史。
- 必须用中文写commit。

## 10. 生产保护与分支制度

- `main` 是生产稳定分支，推送后会影响 `https://aivolo.studio`。
- 默认不得在 `main` 上做开发性改动；开始代码或文档任务前必须运行 `npm run guard:agent`。
- 若 guard 阻止当前任务，先从 `main` 创建 `feature/*`、`fix/*` 或 `hotfix/*` 分支，再继续工作。
- 只有用户明确要求“发布生产”“合并到 main”“线上热修”时，才允许在 `main` 上进行发布相关操作。
- 开发分支只推送 Preview；Preview 验收通过后，才能合并或推送到 `main`。
- 推送 `main` 前必须运行 `npm run guard:release`、`npm run verify:full`、`git diff --check`，并再次检查密钥、临时诊断端点、mock 环境变量。
- 生产环境禁止配置 `AIVOLO_E2E_MOCKS` 和 `NEXT_PUBLIC_AIVOLO_E2E_MOCKS`。
- Supabase 生产库、R2 生产 bucket、Vercel Production 环境变量均视为生产资源；任何变更必须先说明影响范围并获得用户确认。
- 具体流程见 [docs/development/PRODUCTION_PROTECTION.md](./docs/development/PRODUCTION_PROTECTION.md)。

## 11. 项目约束

- 第一阶段目标是 7 天内完成最小 MVP 并上线。
- `21 天` 是整个学习陪跑、开发、运营和验证周期，不是第一阶段开发时长。
- 第一阶段网页文案统一使用英文。
- 第二阶段再补齐多语言。
- 第二阶段是完整网站成型阶段，包含首页、模型页、模板体系、SEO/GEO 页面和完整订阅能力。
- 模板体系没有“三类模板之上的总列表页”；左侧边栏直接提供三类模板入口。
- 订阅有效期内不允许主动降级；降级只能在当前订阅到期后重新购买低一级套餐。
- 升级订阅采用补差价规则，升级积分与原有积分分批记录。
- 退款与用户日常积分展示分开设计：用户界面只展示必要信息，后台保留完整审计字段。

## 12. 交付标准

- 任何文档更新都要保证口径一致，不能前后打架。
- 任何代码交付都要先 review，再修复，再复验。
- 任务完成的标准是“实现 + 验证 + 记录清楚”，不是“写完代码”。

<claude-mem-context>
# Memory Context

# [AiVolo.studio] recent context, 2026-05-04 12:41am GMT+8

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision 🚨security_alert 🔐security_note
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 50 obs (7,352t read) | 2,722,423t work | 100% savings

### Apr 28, 2026
S1227 **Next.js 多个 lockfile 导致工作区根目录警告** (Apr 28 at 10:52 PM)
S1228 Next.js 多 lockfile 工作区根目录警告解释与处理决策 (Apr 28 at 10:54 PM)
S1229 **AiVolo.studio CSS 样式丢失问题继续修复中** (Apr 28 at 10:55 PM)
S1230 修复 AiVolo.studio 项目 localhost:3000 CSS 样式加载异常问题 (Apr 28 at 10:56 PM)
S1234 测试 AiVolo.studio Google OAuth 登录配置 (Apr 28 at 10:56 PM)
S1237 **AiVolo.studio MVP Phase 1 任务完成情况详细审查** (Apr 28 at 11:07 PM)
1316 11:14p ✅ **AiVolo.studio MVP Phase 1 完成情况总览**
1317 11:15p ✅ **AiVolo.studio MVP Phase 1 任务完成情况详细审查**
S1239 回顾第一阶段所有任务的完成情况 (Apr 28 at 11:15 PM)
S1338 修复 AiVolo.studio 的两个认证问题：1) 未登录用户无法访问生成页；2) Google OAuth 登录报错 "No API key found" (Apr 28 at 11:15 PM)
1329 11:26p 🔄 **游客访问权限重构 - 登录触发时机调整**
1330 " ⚖️ **联系信息配置决策 - 暂不添加社交媒体**
1331 " 🔵 **退款政策文案优化 - 考虑嵌入 SPEC 定价表**
1332 " ✅ **DNS 解析配置完成待验证**
1333 " 🔵 **DNS 解析测试无响应**
1334 " 🔵 **SPEC 6.7.3 退款定价表详情已确认**
1335 " 🔵 **联系页面当前实现需重构**
1336 11:27p 🔵 **退款政策页面内容待完善**
### Apr 29, 2026
1418 12:47a 🔴 **登录拦截逻辑过严 - 生成按钮点击时才应要求登录**
1420 " 🔵 **AiVolo.studio 认证架构确认：中间件仅保护 /account**
1421 12:48a 🔵 **API 路由结构确认：认证和生成接口分离**
1422 " 🔴 **NEXT_PUBLIC_SITE_URL 缺失导致 Google OAuth 无法工作**
1424 12:49a 🔴 **添加 NEXT_PUBLIC_SITE_URL 并修正 SUPABASE_URL 格式**
1425 12:50a 🔄 **图片生成 API 重构：从回调模式改为直接生成模式**
S1400 **AiVolo.studio CLAUDE.md Read for Enhancement Preparation** (Apr 29 at 12:51 AM)
1492 2:22a 🔴 **context-mode MCP client startup failure persists after troubleshooting**
1493 " 🔴 **context-mode MCP startup fix: absolute path replaces command name**
1494 2:23a 🔵 **Codex config.toml structure and MCP server configuration**
1496 " 🔴 **Codex config.toml context-mode MCP fix applied with backup**
1497 " 🔴 **context-mode MCP server successfully starts after config fix**
1498 2:31a 🔵 **AiVolo.studio CLAUDE.md Read for Enhancement Preparation**
1499 2:34a 🔵 **AiVolo.studio 依赖栈配置解析**
1501 2:39a ✅ **AiVolo.studio 登录逻辑修复并推送**
S1403 **AiVolo.studio 登录逻辑修复并推送** (Apr 29 at 2:39 AM)
1502 2:42a 🟣 **AiVolo.studio MVP 代码评审与修复工作启动**
1504 " 🔵 **AiVolo.studio 项目文档研读完成**
1505 2:43a ✅ **启动三个并行审查 Agent 分析代码问题**
1506 " 🔴 **首页实现与 SPEC 严重不符**
1507 " 🔵 **API 路由和认证架构审查完成**
1508 " 🔵 AiVolo.studio 全面代码评审启动 - 需求一致性 + 代码质量并行审查
1509 2:44a 🔴 **数据库字段不一致：credits_balance vs credits**
1510 " 🔵 AiVolo.studio 首页实现严重不符合 SPEC.md 定义
1512 " 🔴 **中间件 Cookie 同步 bug：request.coocies 拼写错误**
1511 " 🔵 代码架构确认：Root Layout 包含 Header/Footer，但首页覆盖渲染
1513 " 🔵 **代码质量审查并行启动：需求一致性与最佳实践双轨检查**
1514 2:45a 🔵 **完整代码审查完成 - 问题汇总**
1515 " 🔵 **三件套页面审查 - terms/privacy/refund 完整**
1516 2:46a 🔴 **联系我们页面联系邮箱错误**
1517 " ✅ **代码修复计划已启动**
1518 " 🟣 **创建产品常量统一管理文件**
1519 2:47a 🔵 **AiVolo.studio 代码质量审查：数据库列名不一致**
1520 " 🔵 **首页和模型页 MVP 实现严重不完整**
1521 " 🔵 **中间件认证逻辑与 API 路由认证不一致**
1522 " 🔵 **积分扣减原子操作签名不匹配**
1523 " 🔄 **重构 PricingCards 组件 - 删除旧文件准备重写**
**1524** " 🔵 ****Next.js 构建成功，静态生成 20 个页面****
构建验证通过。尽管多个页面内容为空（/models、/templates 等），Next.js 仍将其成功预渲染为静态页面。这意味着访问这些 URL 会返回空内容而非 404，首页元信息不足也影响 SEO。
~84t 🔍 32,686

**1525** " 🔄 ****重写 PricingCards 组件使用产品常量****
主会话重写了 src/components/ui/PricingCards.tsx 组件，使用新创建的 product.ts 常量替代硬编码。新版设计采用 OKLCH 色彩系统定义紫色主调（72% 0.18 270），2x2 网格布局（md:grid-cols-2 xl:grid-cols-4）展示 4 个定价档。每个卡片包含层级标题、badge 标签、价格、积分说明、功能列表和禁用状态的"Coming Soon"按钮。这修复了之前定价展示不符合 SPEC 的问题。
~178t 🛠️ 112,172

**1526** " 🔄 ****删除旧首页准备重新实现****
主会话删除了旧的 src/app/page.tsx，这个页面之前只有 Google 登录按钮，严重不符合 SPEC 3.3 定义的"第一阶段首页简化结构"。现在正准备实现符合 SPEC 要求的新版首页，包含完整的 Hero 区域、生成框、定价卡片展示等核心功能。
~65t 🛠️ 114,667

**1527** 2:48a 🟣 ****完全重写首页符合 SPEC 3.3 要求****
主会话完全重写了 src/app/page.tsx，这是本次代码修正的核心工作。新版首页严格按照 SPEC 3.3 定义的"第一阶段首页简化结构"实现，包含：1) Hero 区域（大标题 + 描述 + CTA 按钮 + 输出预览网格）；2) 生成表单（#generate，提示词 + 模型 + 比例选择，点击继续跳转到 /create 完整工作区）；3) 定价预览（嵌入 PricingCards 组件）。配色采用 OKLCH 色彩系统，全页面使用一致的紫色主调（72% 0.18 270）。这修复了之前首页只有登录按钮、完全没有生成功能的严重问题。
~177t 🛠️ 118,773

**1528** " 🔄 ****删除旧生成页准备重写****
主会话删除了旧的 src/app/create/page.tsx，准备用新的设计系统重新实现。新版生成页将继承首页的设计语言，使用 product.ts 中的常量（TEXT_TO_IMAGE_MODEL、ASPECT_RATIOS）替代硬编码，并采用一致的 OKLCH 色彩系统。
~68t 🛠️ 123,412


Access 2722k tokens of past work via get_observations([IDs]) or mem-search skill.
</claude-mem-context>
