# AiVolo.studio 开发计划

> 版本：v1.0（基于 Deep Interview 调研）
> 日期：2026-04-28
> 状态：规划中，待启动开发

---

## 一、项目阶段总览

| 阶段 | 完成度 | 时间目标 | 状态 |
|------|--------|---------|------|
| **第一阶段（MVP）** | ~30% | 7天内 | 🔄 进行中 |
| **第二阶段** | 70-80% | 7-10天 | ⏳ 待开始 |
| **第三阶段** | 20-30% | 待定 | ⏳ 待开始 |
| **第四阶段** | 可选 | 待定 | ⏳ 待开始 |

---

## 二、第一阶段开发任务

### 2.1 任务清单

| # | 任务 | 模块 | 优先级 | 状态 | 完成日期 |
|---|------|------|--------|------|----------|
| 1 | Next.js 项目初始化 | 前端 | P0 | ✅ 已完成 | 2026-04-28 |
| 2 | 配置 Tailwind + shadcn/ui | 前端 | P0 | ✅ 已完成 | 2026-04-28 |
| 3 | 配置 Supabase 项目 | 后端 | P0 | ✅ 已完成 | 2026-04-28 |
| 4 | 设计数据库表结构 | 后端 | P0 | ✅ 已完成 | 2026-04-28 |
| 5 | 配置 Google OAuth | 后端 | P0 | ✅ 已完成 | 2026-04-28 |
| 6 | 购买并配置域名 | 运维 | P0 | ⬜ 待配置 | |
| 7 | 创建 GitHub 仓库 | 运维 | P0 | ✅ 已完成 | 2026-04-28 |
| 8 | 搭建页面骨架 | 前端 | P0 | ✅ 已完成 | 2026-04-28 |
| 9 | 配置 Cloudflare R2 | 运维 | P1 | ✅ 已完成 | 2026-04-28 |
| 10 | 首页开发 | 前端 | P0 | ⬜ 等你确认设计 | |
| 11 | 生成页开发 | 前端 | P0 | ⬜ 等你确认设计 | |
| 12 | 定价页开发 | 前端 | P0 | ⬜ 等你确认设计 | |
| 13 | 账户页开发 | 前端 | P0 | ⬜ 等你确认设计 | |
| 14 | 三件套页面 | 前端 | P0 | ✅ 已完成 | 2026-04-28 |
| 15 | 文生图功能 | 后端 | P0 | ✅ 已完成 | 2026-04-28 |
| 16 | 积分系统 | 后端 | P0 | ✅ 已完成 | 2026-04-28 |
| 17 | 部署上线 | 运维 | P0 | ⬜ 等你配置DNS和迁移 | |

### 2.2 任务详情

#### 任务1: Next.js 项目初始化
- **模块**: 前端
- **优先级**: P0
- **前置依赖**: 无
- **说明**: 创建 Next.js 15 项目，配置 TypeScript
- **命令**:
```bash
npm init next-app@latest . --typescript --tailwind --eslint --app --src-dir
```

#### 任务2: 配置 Tailwind + shadcn/ui
- **模块**: 前端
- **优先级**: P0
- **前置依赖**: 任务1
- **说明**: 初始化 shadcn/ui 组件库
- **命令**:
```bash
npx shadcn@latest init -y -d
npx shadcn@latest add button card input label tabs textarea dropdown-menu dialog sheet avatar tooltip
npm install @supabase/supabase-js @supabase/ssr next-intl
```

#### 任务3: 配置 Supabase 项目
- **模块**: 后端
- **优先级**: P0
- **前置依赖**: 无
- **说明**: 创建 Supabase 项目，获取 API URL 和 anon key

#### 任务4: 设计数据库表结构
- **模块**: 后端
- **优先级**: P0
- **前置依赖**: 任务3
- **说明**: 创建以下表
  - users
  - subscriptions
  - credits_transactions
  - generations
  - models
  - templates
  - webhooks_log

#### 任务5: 配置 Google OAuth
- **模块**: 后端
- **优先级**: P0
- **前置依赖**: 任务3
- **说明**: 在 Supabase 配置 Google OAuth 提供商

#### 任务6: 购买域名 AiVolo.studio
- **模块**: 运维
- **优先级**: P0
- **前置依赖**: 无
- **说明**: 确认域名已购买

#### 任务7: 创建 GitHub 仓库
- **模块**: 运维
- **优先级**: P0
- **前置依赖**: 无
- **说明**: 关联 Vercel

#### 任务8: 搭建页面骨架
- **模块**: 前端
- **优先级**: P0
- **前置依赖**: 任务1, 任务2
- **说明**: 创建所有页面路由
  - / (首页)
  - /create (生成页)
  - /pricing (定价页)
  - /account (账户页)
  - /terms (用户协议)
  - /privacy (隐私政策)
  - /refund (退款政策)
  - /contact (联系我们)

#### 任务9: 配置 Cloudflare R2
- **模块**: 运维
- **优先级**: P1
- **前置依赖**: 无
- **说明**: 存储用户生成结果

#### 任务10: 首页开发
- **模块**: 前端
- **优先级**: P0
- **前置依赖**: 任务8
- **说明**: 
  - Hero 大标题
  - 生成框（提示词输入 + 模型下拉 + 比例选择）
  - 定价卡片
  - 底部导航/三件套
  - 右上角积分显示（登录后）

#### 任务11: 生成页开发
- **模块**: 前端
- **优先级**: P0
- **前置依赖**: 任务8, 任务15
- **说明**:
  - 提示词输入框
  - 模型下拉框
  - 图片比例选择
  - 生成按钮
  - 结果展示 + 下载

#### 任务12: 定价页开发
- **模块**: 前端
- **优先级**: P0
- **前置依赖**: 任务8
- **说明**:
  - 月付/年付 Tab 切换
  - 4档定价展示
  - Coming Soon 按钮（置灰）

#### 任务13: 账户页开发
- **模块**: 前端
- **优先级**: P0
- **前置依赖**: 任务8
- **说明**:
  - 个人信息
  - 积分余额
  - 生成历史（时间/提示词/缩略图/下载）

#### 任务14: 三件套页面
- **模块**: 前端
- **优先级**: P0
- **前置依赖**: 任务8
- **说明**: 
  - /terms 用户协议
  - /privacy 隐私政策
  - /refund 退款政策
  - /contact 联系我们

#### 任务15: 文生图功能
- **模块**: 后端
- **优先级**: P0
- **前置依赖**: 任务4
- **说明**:
  - 用户输入提示词
  - 调用 API 中转（OpenAI 格式）
  - 返回生成结果
  - 生成前通过 RPC 原子检查余额、预扣积分并创建 pending 任务
  - 生成成功后更新任务为 completed
  - 生成失败后更新任务为 failed 并自动退还预扣积分

#### 任务16: 积分系统
- **模块**: 后端
- **优先级**: P0
- **前置依赖**: 任务4
- **说明**:
  - 新用户 20 积分
  - 生成任务启动时预扣积分
  - 生成失败时自动退还预扣积分
  - 生成扣积分
  - 余额查询
  - 余额多端显示

#### 任务17: 部署上线
- **模块**: 运维
- **优先级**: P0
- **前置依赖**: 任务1-16 完成
- **说明**:
  - Vercel 部署
  - GitHub 推送自动部署
  - DNS 解析 AiVolo.studio

---

## 三、第二阶段开发任务

### 3.1 任务清单

| # | 任务 | 模块 | 优先级 | 状态 |
|---|------|------|--------|------|
| 1 | 多模型支持（约10个） | 后端 | P0 | ⏳ |
| 2 | 图生图功能 | 后端 | P0 | ⏳ |
| 3 | 文生视频功能 | 后端 | P0 | ⏳ |
| 4 | 图生视频功能 | 后端 | P0 | ⏳ |
| 5 | 高可用路由层 | 后端 | P0 | ⏳ |
| 6 | 模板系统（40个模板） | 全栈 | P0 | ⏳ |
| 7 | 多语言（11种） | 前端 | P0 | ⏳ |
| 8 | Creem.io 支付接入 | 后端 | P0 | ⏳ |
| 9 | 模型广场 | 前端 | P1 | ⏳ |
| 10 | Bug反馈浮窗 | 前端 | P2 | ⏳ |
| 11 | API聚合供应商接入 | 后端 | P0 | ⏳ |
| 12 | 生成结果存储策略 | 后端 | P0 | ⏳ |

---

## 四、第三阶段开发任务

### 4.1 任务清单

| # | 任务 | 模块 | 优先级 | 状态 |
|---|------|------|--------|------|
| 1 | 电商模板（20个） | 全栈 | P0 | ⏳ |
| 2 | 智能缓存层 | 后端 | P0 | ⏳ |

---

## 五、第四阶段（可选）

### 5.1 任务清单

| # | 任务 | 模块 | 优先级 | 状态 |
|---|------|------|--------|------|
| 1 | 数据分析 | 后端 | P2 | ⏳ |

---

## 六、技术栈

| 层次 | 方案 |
|------|------|
| 前端框架 | Next.js 15 + React + Tailwind CSS + shadcn/ui |
| 数据库 | Supabase Postgres + RLS |
| 媒体存储 | Cloudflare R2 + 临时签名链接 |
| 部署 | Vercel + GitHub 自动部署 |
| DNS/CDN | Cloudflare |
| 收款 | Creem.io + Wise |
| 多语言 | next-intl 9.x |
| Auth | Supabase Auth + Google OAuth |

---

## 七、数据库表结构

### 7.1 users
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| email | text | 邮箱 |
| name | text | 名称 |
| avatar | text | 头像URL |
| credits_balance | integer | 积分余额 |
| created_at | timestamp | 创建时间 |

### 7.2 subscriptions
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| user_id | uuid | 用户ID |
| plan | text | lite/pro |
| status | text | active/cancelled |
| current_period_end | timestamp | 当前周期结束 |

### 7.3 credits_transactions
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| user_id | uuid | 用户ID |
| amount | integer | 变动数量 |
| type | text | credit/debit |
| created_at | timestamp | 创建时间 |

### 7.4 generations
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| user_id | uuid | 用户ID |
| prompt | text | 提示词 |
| model_id | text | 模型ID |
| image_url | text | 结果URL |
| status | text | pending/completed/failed |
| credits_used | integer | 消耗积分 |
| created_at | timestamp | 创建时间 |

### 7.5 models
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| name | text | 模型名称 |
| provider | text | 提供商 |
| type | text | image/video |
| api_format | text | openai/custom |

### 7.6 templates
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| name | text | 模板名称 |
| category | text | hot/ecommerce/interior |
| prompt_template | text | 预制提示词 |
| aspect_ratios | text | 推荐比例 |

### 7.7 webhooks_log
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| event_id | text | 事件ID（唯一索引） |
| event_type | text | 事件类型 |
| payload | jsonb | 负载 |
| created_at | timestamp | 创建时间 |

---

## 八、API 接口设计

### 8.1 认证
- `POST /api/auth/google` - Google OAuth 登录

### 8.2 生成
- `POST /api/generate/image` - 文生图
- `POST /api/generate/image-to-image` - 图生图
- `POST /api/generate/video` - 文生视频
- `POST /api/generate/video-from-image` - 图生视频
- `GET /api/generations` - 获取生成历史
- `GET /api/generations/:id` - 获取单个生成详情

### 8.3 订阅
- `GET /api/subscriptions` - 获取订阅信息
- `POST /api/subscriptions` - 创建订阅（Creem）

### 8.4 积分
- `GET /api/credits` - 获取积分余额
- `GET /api/credits/transactions` - 获取积分流水
- `create_generation_pending_atomic` - 原子检查余额、预扣积分、创建 pending 任务
- `complete_generation_atomic` - 生成成功后写入结果并完成任务
- `fail_generation_refund_atomic` - 生成失败后标记失败并退还预扣积分

### 8.5 模型
- `GET /api/models` - 获取模型列表

### 8.6 模板
- `GET /api/templates` - 获取模板列表
- `GET /api/templates/:id` - 获取模板详情

---

## 九、执行模式

### 当前可执行任务（不依赖UI设计）
以下任务可以立即开始执行：

1. **任务1-2**: Next.js 初始化 + shadcn 配置
2. **任务3-4**: Supabase 配置 + 数据库设计
3. **任务5**: Google OAuth 配置
4. **任务7**: GitHub 仓库创建
5. **任务8**: 页面骨架搭建（基础路由）

### 需等待的任务
- 任务10-14（UI页面开发）：等待UI设计风格确定
- 任务15-16（功能开发）：等待功能验证结果

---

*最后更新：2026-04-28*
*状态：规划中，待启动开发*
