# 生产保护制度（Solo Balanced）

本制度适用于当前个人开发者阶段。目标是保留能防止生产事故的关键保护，同时去掉团队协作才需要的审批摩擦。

## 1. 分支角色

| 分支 | 用途 | 是否影响生产 |
| --- | --- | --- |
| `main` | 生产稳定分支 | 是，合并后触发 Vercel Production |
| `feature/*` | 功能开发 | 否，只生成 Vercel Preview |
| `fix/*` | 非紧急修复 | 否，只生成 Vercel Preview |
| `hotfix/*` | 紧急线上修复 | 合并到 `main` 后才影响正式网站 |

默认不在 `main` 上直接开发。开发、文档、规则变更优先从 `main` 创建短分支。

## 2. 本地守护

开始任务前运行：

```bash
npm run guard:agent
```

如果当前在 `main`，该命令会阻止常规开发。正确做法：

```bash
git checkout main
git pull origin main
git checkout -b feature/<short-name>
npm run guard:agent
```

发布前或合并 PR 前运行：

```bash
npm run guard:release
```

`guard:release` 只检查当前分支和工作区是否适合发布前验证；它不替代 lint、build、E2E 或人工判断。

## 3. 远程保护

GitHub `main` ruleset 建议保持：

- Require pull request before merging: 开启。
- Required approvals: `0`。
- Prevent deletions: 开启。
- Prevent non-fast-forward updates: 开启。
- Required status checks: 暂不启用，等 CI 稳定后再加。

个人开发者阶段不要求另一个 reviewer。只有用户明确要求团队式评审或引入协作者时，才把 Required approvals 调高。

## 4. 验证分层

不要所有改动一律跑最重流程。按风险选择：

### 文档、规则、文案小改

```bash
git diff --check
```

同时检查 diff 中没有密钥、临时诊断端点、生产 mock 配置或无关文件。

### 普通 UI 或代码改动

```bash
npm run verify:local
git diff --check
```

`verify:local` 包含 lint、TypeScript 和生产 build。

### 高风险链路改动

```bash
npm run verify:full
git diff --check
```

高风险链路包括：

- 登录、认证、中间件。
- 积分、支付、订阅、退款。
- 图片生成、下载、历史记录。
- Supabase schema、RLS、RPC、数据迁移。
- R2 bucket、对象删除、对象覆盖。
- Vercel Production 环境变量。

高风险变更合并后还要做必要的线上 smoke test。

## 5. 发布流程

1. 在 `feature/*`、`fix/*` 或 `hotfix/*` 分支完成改动。
2. 按风险级别运行验证。
3. 确认 `git diff` 范围、无密钥、无临时诊断端点、无生产 mock 配置。
4. 推送当前分支到远程。
5. 创建 PR 到 `main`。
6. 自己合并 PR；不需要另一个 reviewer。
7. 查看 Vercel Production 状态。
8. 访问 `https://aivolo.studio` 做必要 smoke test。

## 6. 生产环境变量

Production 必须使用：

```env
NEXT_PUBLIC_SITE_URL=https://aivolo.studio
```

Production 禁止配置：

```env
AIVOLO_E2E_MOCKS
NEXT_PUBLIC_AIVOLO_E2E_MOCKS
```

E2E mock 只允许用于本地测试和 Preview 验证。

## 7. 生产资源

Supabase 生产库、R2 生产 bucket、Vercel Production 环境变量都属于生产资源。

任何影响表结构、RLS、RPC、积分、订阅、退款、认证、对象存储或生产环境变量的变更，都必须先说明影响范围并获得用户确认。

## 8. 发布后 smoke test

按改动风险选择检查项：

- 首页 `/` 返回 200，首屏可见。
- `/create` 可打开。
- 高风险生成链路改动后，测试文生图、下载、账户历史。
- `/account` 未登录时正常跳转或提示登录。
- `/pricing` 状态与当前阶段一致。
- `/terms`、`/privacy`、`/refund`、`/contact` 可访问。

## 9. 紧急回滚

如果线上异常：

1. 先暂停继续发布。
2. 确认异常对应的 commit / PR。
3. 优先用新 PR 做 revert 或 hotfix。
4. 避免 `git reset --hard`、force push 或直接改生产资源，除非用户明确确认。
