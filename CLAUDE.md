# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**AiVolo.studio** — AI 图片/视频生成工具，面向欧洲、南美、东南亚市场。核心功能：文生图、图生图、文生视频、图生视频。

**技术栈**：Next.js 15 + React 19 + Tailwind CSS + Supabase + Cloudflare R2

---

## 常用命令

```bash
npm run dev     # 开发服务器 (localhost:3000)
npm run build   # 生产构建
npm run start   # 生产服务器
npm run lint   # ESLint 检查
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
- 文生图高级模型每次生成消耗 **3 积分**
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
