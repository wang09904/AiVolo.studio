# Supabase 配置

本目录包含 Supabase 客户端配置。

## 文件结构

```
supabase/
├── migrations/
│   └── 001_initial_schema.sql  # 数据库初始化迁移
├── client.ts                   # 浏览器端客户端
├── server.ts                   # 服务端客户端
└── README.md                   # 本文件
```

## 环境变量

需要在 `.env.local` 中配置以下变量：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 使用方式

### 客户端组件

```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
// 使用 supabase 进行客户端操作
```

### 服务端组件 / API 路由

```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
// 使用 supabase 进行服务端操作
```

## 数据库表

| 表名 | 说明 |
|------|------|
| users | 用户信息 |
| subscriptions | 订阅记录 |
| credits_transactions | 积分流水 |
| generations | 生成记录 |
| models | 模型配置 |
| templates | 模板配置 |
| generations_cache | 智能缓存 |
| webhooks_log | Webhook 日志 |

## RLS 策略

- users: 用户只能读写自己的数据
- subscriptions: 用户只能操作自己的订阅
- credits_transactions: 用户只能查看自己的积分流水
- generations: 用户只能操作自己的生成记录
- models: 所有用户可查看已激活模型
- templates: 所有用户可查看已激活模板
- generations_cache: 所有用户可读取缓存数据
- webhooks_log: 仅服务端可写入

## 原子操作 RPC

### create_generation_atomic

创建生成任务并原子性地扣除积分：

```sql
SELECT create_generation_atomic(
  p_user_id UUID,
  p_prompt TEXT,
  p_model_id TEXT,
  p_generation_type TEXT,
  p_credits_to_deduct INTEGER
) RETURNS UUID
```

该函数在同一个事务中完成：
1. 检查积分余额
2. 扣减积分
3. 记录积分流水
4. 创建生成记录
