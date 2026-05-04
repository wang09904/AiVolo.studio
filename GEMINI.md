# AiVolo.studio / Gemini 根规则

本文件是 Gemini CLI 在 **AiVolo.studio** 工作空间中交互的基础准则。此处的指令具有绝对优先级，覆盖任何通用默认设置。

## 1. 项目概述

**AiVolo.studio** 是一个面向全球市场（欧洲、南美、东南亚、北美）的 AI 图片和视频娱乐创作平台。

- **技术栈**：Next.js 15, React 19, Tailwind CSS, Supabase, Cloudflare R2。
- **设计系统**：高阶 SaaS / 极简编辑风格 (High-End SaaS / Editorial Minimalist)，使用 "Zinc + Electric Blue" 配色方案。

## 2. 事实源与优先级

1. **产品规格**: [docs/development/SPEC_V2.md](./docs/development/SPEC_V2.md)
2. **开发计划**: [docs/development/DEVELOPMENT_PLAN_V2.md](./docs/development/DEVELOPMENT_PLAN_V2.md)
3. **设计系统**: [design-system/MASTER.md](./design-system/MASTER.md)
4. **当前状态**: [README.md](./README.md)
   *注：文档、代码或口头指示之间的任何冲突，均以最新的 `V2` 文档为准。*

## 3. 项目结构

| 路径                                                               | 用途                            |
| ---------------------------------------------------------------- | ----------------------------- |
| `src/app/`                                                       | Next.js App Router 页面和 API 路由 |
| `src/components/`                                                | 产品和 UI 组件                     |
| `src/lib/`                                                       | Supabase, R2, 产品配置和服务器端工具函数   |
| `src/hooks/`                                                     | React hooks                   |
| `src/types/`                                                     | TypeScript 类型定义               |
| `docs/development/`                                              | 当前产品规格、开发计划和生产环境保护文档          |
| `docs/archive/`                                                  | 废弃的历史文档；仅在明确要求时使用             |
| `docs/research/`                                                 | 调研资料                          |
| `references/`                                                    | 参考实现和示例，非运行时代码                |
| `design-system/`                                                 | 设计系统文档                        |
| `scripts/`                                                       | 本地验证、生产环境保护和辅助脚本              |
| `tests/e2e/`                                                     | Playwright E2E 测试             |
| `.env.local`                                                     | 本地私有环境变量；切勿提交                 |
| `.next/`, `node_modules/`, `test-results/`, `playwright-report/` | 生成的产物或依赖项；请勿手动编辑              |

## 4. 沟通与文档

- **语言**：所有回复、解释和内部文档必须使用 **中文**（面向用户的 UI 文案除外）。
- **风格**：简洁、事实化、可执行。避免寒暄废话。
- **进度更新**：在开始复杂工作前提供简短的进展摘要，并在耗时任务期间保持更新。
- **诚信**：如果任务未完成或失败，必须明确说明。不要暗示已完成。

## 5. 工作流原则

- **先分析**：在进行任何修改前，先理解代码并确认影响范围。
- **精准修改 (Surgical Changes)**：只修改当前任务必需的内容。未经明确指示，禁止重构无关代码或重写整个文件。
- **禁止推测**：不要将未经确认的推测写入代码或文档。
- **安全与完整性**：对于认证、积分和数据库操作，优先考虑原子操作、显式的错误处理和可追踪的记录。

## 6. 工程与代码质量

- **构建与运行**：
  - Agent 守护：`npm run guard:agent`
  - Release 守护：`npm run guard:release`
  - 开发：`npm run dev`
  - 构建：`npm run build`
  - Lint 检查：`npm run lint`
  - 类型检查：`npx tsc --noEmit`
  - 本地验证：`npm run verify:local`
  - 全量验证：`npm run verify:full`
- **验证**：每次代码更改**必须**通过 `npm run lint` 和 `npx tsc --noEmit` 验证。UI 更改需要进行视觉确认。
- **技术习惯**：维护现有的技术栈、命名规范和目录结构。使用 `tailwind.config.ts` 中定义的语义化品牌类名。
- **UI 文案**：第一阶段，面向用户的文本（按钮、标签、消息）必须保持为 **英文**。

## 7. 工具与 Git

- **工具偏好**：使用 search 和 grep 工具进行分析。只读取完成任务所需的最小内容。
- 提交前先检查 `git diff`，确保没有无关文件、密钥、临时产物。
- **安全性**：除非明确要求，否则不执行破坏性操作（如 reset、删除文件夹、强制覆盖）。
- 提交信息要准确反映改动内容。
- 未经用户要求，不要擅自做破坏性 git 操作或重写历史。
- 必须用中文写commit。

## 8. 生产保护与分支策略

- `main` 是生产环境的稳定分支。向其推送代码会直接影响 `https://aivolo.studio`。
- 不要直接在 `main` 分支上进行常规开发工作；在开始代码或文档工作之前运行 `npm run guard:agent`。
- 如果守护脚本拦截了任务，请从 `main` 创建一个 `feature/*`、`fix/*` 或 `hotfix/*` 分支。
- 只有用户明确请求的 release、merge-to-main 或 hotfix 任务才允许在 `main` 上操作。
- 开发分支应仅用于推送 Vercel Preview。只有在 Preview 验收通过后，才能合并或推送到 `main`。
- 在推送 `main` 之前，运行 `npm run guard:release`、`npm run verify:full` 和 `git diff --check`，然后检查是否包含敏感信息、临时诊断代码或模拟环境变量。
- 生产环境绝不能配置 `AIVOLO_E2E_MOCKS` 或 `NEXT_PUBLIC_AIVOLO_E2E_MOCKS`。
- Supabase 生产数据库、R2 生产存储桶和 Vercel 生产环境变量属于生产核心资源；在更改它们之前，必须解释影响并获得用户确认。
- 详情参见：[docs/development/PRODUCTION_PROTECTION.md](./docs/development/PRODUCTION_PROTECTION.md)。

## 9. 当前项目阶段

- **MVP 阶段**：完善文生图闭环和账户历史。
- **核心焦点**：解决图片下载失败问题，确保生成历史的持久化。