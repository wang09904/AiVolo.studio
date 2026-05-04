# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**AiVolo.studio** — AI 图片/视频生成工具，面向欧洲、南美、东南亚市场。核心功能：文生图、图生图、文生视频、图生视频。

**技术栈**：Next.js 15 + React 19 + Tailwind CSS + Supabase + Cloudflare R2

## 项目结构

| 路径 | 用途 |
| --- | --- |
| `src/app/` | Next.js App Router 页面与 API routes |
| `src/components/` | 业务组件与 UI 组件 |
| `src/lib/` | Supabase、R2、产品配置、服务端工具函数 |
| `src/hooks/` | React hooks |
| `src/types/` | TypeScript 类型定义 |
| `docs/development/` | 当前有效的产品规格、开发计划、上线保护制度 |
| `docs/archive/` | 已废弃历史文档，只在明确要求时参考 |
| `docs/research/` | 调研资料 |
| `references/` | 参考实现与外部样例，不是运行时代码 |
| `design-system/` | 设计系统资料 |
| `scripts/` | 本地验证、生产保护和辅助脚本 |
| `tests/e2e/` | Playwright E2E 测试 |
| `.env.local` | 本地私密环境变量，不提交 |
| `.next/`、`node_modules/`、`test-results/`、`playwright-report/` | 生成产物或依赖目录，不手工编辑 |

---

## 常用命令

```bash
npm run guard:agent    # 开工前检查，默认阻止在 main 上直接开发
npm run guard:release  # 推送 main 前的发布检查
npm run dev     # 开发服务器 (localhost:3000)
npm run build   # 生产构建
npm run start   # 生产服务器
npm run lint   # ESLint 检查
npm run verify:local   # lint + typecheck + build
npm run verify:full    # lint + typecheck + build + E2E
```

**环境配置**：`.env.local` 包含所有必需变量（SUPABASE_URL、OPENAI_API_KEY、R2配置）

---

## 架构设计

### 数据流
```
用户 → Next.js API Routes → Supabase RPC (原子操作) → 积分扣减
                    ↓
              OpenAI 中转API → 图片生成
                    ↓
              R2 存储 → 返回签名URL
```

### 认证流程
- 仅支持 **Google OAuth**（Supabase Auth）
- 中间件仅保护 `/account` 路径
- 其他页面（`/`、`/create`、`/pricing`）游客可自由访问
- 登录触发时机：**点击生成按钮时**才检查登录

### 积分系统
- 第一阶段文生图模型每次生成消耗 **1 积分**，以 `src/lib/product.ts` 为准
- 通过 `create_generation_pending_atomic` RPC 原子预扣积分并创建 pending 任务（防止超扣）
- 生成成功后调用 `complete_generation_atomic` 写入结果；生成失败后调用 `fail_generation_refund_atomic` 退还预扣积分
- `credits_transactions` 表记录流水用于对账

---

## API 路由

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/auth/google` | GET | Google OAuth 登录入口 |
| `/api/auth/callback` | GET | OAuth 回调处理 |
| `/api/auth/logout` | GET | 登出 |
| `/api/generate/image` | POST | 图片生成（需登录） |

**图片生成请求体**：
```json
{
  "prompt": "描述词",
  "model_id": "gpt-image-2",
  "aspect_ratio": "1:1"
}
```

---

## Supabase 配置

- **URL**: `https://kjrchuzrpfhxnjqhefze.supabase.co`
- **ANON_KEY**: 用于客户端
- **RPC**: `create_generation_pending_atomic` / `complete_generation_atomic` / `fail_generation_refund_atomic` — 生成任务预扣、完成与失败退款

**关键表**：
- `users` — 用户信息（Google OAuth）
- `credits` — 积分余额
- `credits_transactions` — 积分流水
- `generations` — 生成任务记录

---

## 生产保护与分支制度

- `main` 是生产稳定分支，推送后会影响 `https://aivolo.studio`。
- 默认不在 `main` 上做常规开发；开始代码或文档任务前运行 `npm run guard:agent`。
- 若 guard 阻止当前任务，先从 `main` 创建 `feature/*`、`fix/*` 或 `hotfix/*` 分支，再继续工作。
- 个人开发者默认走轻量 PR 流程：开发分支验证后推送远程，开 PR 合并到 `main`；远程保留 PR required、禁止删除 `main`、禁止 non-fast-forward，审批数保持 `0`。
- 不要求另一个 reviewer；只有用户明确要求团队式评审时才启用 approval 门槛。
- 发布前验证按风险分层：文档/规则/文案小改跑 `git diff --check` 并检查密钥、临时诊断端点和生产 mock 配置；普通 UI 或代码改动跑 `npm run verify:local` + `git diff --check`；认证、积分、支付、订阅、退款、生成、下载、数据库、R2、Vercel Production 环境变量等高风险链路跑 `npm run verify:full` + `git diff --check` 并做必要 smoke test。
- 生产环境禁止配置 `AIVOLO_E2E_MOCKS` 和 `NEXT_PUBLIC_AIVOLO_E2E_MOCKS`。
- Supabase 生产库、R2 生产 bucket、Vercel Production 环境变量均视为生产资源；任何变更必须先说明影响范围并获得用户确认。
- 具体流程见 `docs/development/PRODUCTION_PROTECTION.md`。

---

## 环境变量

```env
NEXT_PUBLIC_SUPABASE_URL=https://kjrchuzrpfhxnjqhefze.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
OPENAI_API_URL=https://sg.uiuiapi.com/v1/images/generations
OPENAI_API_KEY=<key>
R2_ACCOUNT_ID=<id>
R2_ACCESS_KEY_ID=<key>
R2_SECRET_ACCESS_KEY=<key>
R2_BUCKET_NAME=aivolo-media
```

---

## 开发注意

1. **认证中间件**：`src/middleware.ts` 只保护 `/account`
2. **登录触发**：生成页 `/create` 在点击"生成"按钮时才检查登录并弹出登录弹窗
3. **API Key 安全**：所有 API Key 存储在 `.env.local`，不提交到 Git
