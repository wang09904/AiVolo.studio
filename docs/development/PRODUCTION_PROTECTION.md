# 生产保护制度

本文档定义 AiVolo.studio 上线后的开发制度。目标是保护 `https://aivolo.studio` 的稳定版本，避免开发中的半成品误部署给真实用户。

## 1. 分支角色

| 分支/环境 | 用途 | 是否影响正式网站 |
| --- | --- | --- |
| `main` | 生产稳定分支 | 是，推送后会触发 Production 部署 |
| `feature/*` | 功能开发分支 | 否，只生成 Vercel Preview |
| `fix/*` | 非紧急修复分支 | 否，只生成 Vercel Preview |
| `hotfix/*` | 紧急线上修复分支 | 合并到 `main` 后才影响正式网站 |

默认不在 `main` 上直接开发。

## 2. Agent 开工流程

每次代码或文档任务开始前，先执行：

```bash
npm run guard:agent
```

如果当前在 `main`，该命令会阻止继续工作。正确做法：

```bash
git checkout main
git pull origin main
git checkout -b feature/<short-name>
npm run guard:agent
```

只有用户明确要求“发布生产”“直接修线上热修”“合并到 main”时，才允许在 `main` 上执行发布相关操作。

## 3. 提交和推送规则

开发分支可以提交和推送：

```bash
git push origin feature/<short-name>
```

推送开发分支只会生成 Vercel Preview，不应影响 `https://aivolo.studio`。

推送 `main` 前必须满足：

```bash
npm run guard:release
npm run verify:full
git diff --check
```

并确认没有密钥、临时诊断端点、测试 mock 环境变量进入生产。

## 4. 环境变量规则

Vercel 环境变量分三类：

| 范围 | 用途 |
| --- | --- |
| Production | 正式网站 |
| Preview | 预览部署 |
| Development | 本地开发 |

生产环境必须使用：

```text
NEXT_PUBLIC_SITE_URL=https://aivolo.studio
```

生产环境禁止配置：

```text
AIVOLO_E2E_MOCKS
NEXT_PUBLIC_AIVOLO_E2E_MOCKS
```

`.env.local` 只用于本地，不提交。

## 5. 数据库和存储规则

Supabase 生产库属于生产环境。任何影响表结构、RLS、RPC、积分、订阅、退款、认证的数据变更，都必须满足：

- 先写入 migration 文件。
- 说明影响范围和回滚方式。
- 用户确认后再在 Supabase SQL Editor 执行。
- 执行后做生产 smoke test。

R2 生产 bucket 属于生产环境。不要用测试脚本批量删除或覆盖生产对象。

## 6. Preview 验收规则

功能开发完成后，先推送开发分支，使用 Vercel Preview URL 验收：

- 登录。
- 核心功能路径。
- 账户页数据。
- 生成和下载。
- 法律页面。
- 移动端基础可用性。

Preview 通过后，才能合并到 `main`。

## 7. 生产发布清单

合并或推送 `main` 前检查：

```bash
npm run guard:release
npm run verify:full
git status --short --branch
git diff --check
```

Vercel Production 部署成功后检查：

- `https://aivolo.studio` 可访问。
- Google 登录可用。
- 生成图片可用。
- 下载真实落地。
- `/account` 跨浏览器显示同账号历史。
- `/pricing` 为 Coming Soon。
- `/terms`、`/privacy`、`/refund`、`/contact` 可访问。

## 8. 紧急热修例外

只有线上不可用、认证/支付/积分/数据完整性受影响、或用户无法完成核心生成下载链路时，才走 hotfix。

hotfix 流程：

```bash
git checkout main
git pull origin main
git checkout -b hotfix/<short-name>
```

修复后仍必须跑验证，再合并到 `main`。
