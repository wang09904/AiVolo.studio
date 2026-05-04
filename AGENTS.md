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
- 必须用中文写 commit。

## 10. Solo Balanced 生产保护与分支制度

- `main` 是生产稳定分支，推送或合并后会影响 `https://aivolo.studio`。
- 默认不在 `main` 上做常规开发；开始代码或文档任务前运行 `npm run guard:agent`，被拦截时从 `main` 创建 `feature/*`、`fix/*` 或 `hotfix/*` 分支。
- 个人开发者默认走轻量 PR 流程：开发分支验证后推送远程，开 PR 合并到 `main`；远程保留 PR required、禁止删除 `main`、禁止 non-fast-forward，审批数保持 `0`。
- 不要求另一个 reviewer；只有用户明确要求团队式评审时才启用 approval 门槛。
- 发布前验证按风险分层，而不是一律跑最重流程：
  - 文档、规则、文案小改：`git diff --check`，并检查 diff 中没有密钥、临时诊断端点或生产 mock 配置。
  - 普通 UI 或代码改动：`npm run verify:local` + `git diff --check`。
  - 高风险链路改动：`npm run verify:full` + `git diff --check`，并做必要 smoke test。高风险包括认证、积分、支付、订阅、退款、生成、下载、数据库、R2、Vercel Production 环境变量。
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
