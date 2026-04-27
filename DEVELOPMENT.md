# AiVolo.studio 开发文档

> 版本：v1.0
> 日期：2026-04-27
> 状态：初稿

---

## 一、项目概述

### 1.1 项目背景

**AiVolo.studio** 是一款面向欧洲、南美、东南亚市场的 AI 图片/视频生成工具，主打短视频创作者和普通消费者。核心功能包括文生图、图生图、文生视频、图生视频，通过预制模板系统降低使用门槛。

**核心价值主张**：
- **简单**：秒懂操作，无需专业提示词知识
- **酷炫**：生成内容能上 TikTok 热门
- **便宜**：比外包制作成本低 100 倍

**目标市场优先级**：
1. 欧洲（西班牙/葡萄牙/法国/意大利/德国等）
2. 南美（巴西/墨西哥）
3. 东南亚（印尼/越南/泰国）
4. 北美（美国/加拿大）

### 1.2 项目目标

**第一阶段目标（当前）**：搭好网站骨架，让网站能上线运行，用于申请 Cream 账号。

**最终目标**：完整的产品化 AI 媒体生成平台，支持 60 个模板、4 档定价、5 个主流模型。

### 1.3 递进式开发策略

采用 **骨架先行 -> 完善功能 -> 填充细节** 的递进式开发策略：

| 阶段 | 重点 | 目标 |
|------|------|------|
| **第一阶段** | 骨架搭建 | 核心功能可运行，能上线展示 |
| **第二阶段** | 功能完善 | 丰富功能、优化体验 |
| **第三阶段** | 血肉填充 | 完整功能、细节打磨 |

---

## 二、开发阶段划分（21天 = 5+5+5+6）

### 21天开发节奏

| 阶段 | 天数 | 重点 | 目标 |
|------|------|------|------|
| **第1阶段** | 5天 | 骨架搭建 | MVP可演示，可申请Creem账号 |
| **第2阶段** | 5天 | 多模型+模板 | 5+模型接入，模板系统上线 |
| **第3阶段** | 5天 | 登录+历史记录 | 用户系统完整，历史记录可用 |
| **第4阶段** | 6天 | 订阅+支付+三件套 | 支付上线，过审合规 |

---

### 阶段一：骨架搭建（第1-5天）

**目标**：核心功能可运行，能上线展示，可申请 Creem 账号。

#### 1.1 基础设施搭建（P0）

| 任务 | 说明 | 优先级 |
|------|------|--------|
| 初始化 Next.js 项目 | 创建项目、配置 Tailwind + shadcn/ui | P0 |
| 配置 Supabase | 创建项目、配置数据库 | P0 |
| 配置 Google OAuth | 申请并配置登录 | P0 |
| 购买域名 | AiVolo.studio | P0 |
| 创建 GitHub 仓库 | 关联 Vercel | P0 |
| 搭建页面骨架 | 首页/生成页/模板页/定价页/账户页 | P0 |
| 完成 SPEC 文档 | 产品规格文档定稿 | P0 |

#### 1.2 核心页面搭建（P0）

| 页面 | URL | 说明 |
|------|-----|------|
| 首页/落地页 | `/` | 一句话定位 + 4个Tab + 快捷生成框 + 模板推荐 |
| 产品生成页 | `/create` | 核心生成功能 |
| 定价页 | `/pricing` | 4档定价展示 |
| 账户页 | `/account` | 个人信息、订阅信息 |
| 账户历史 | `/account/history` | 生成历史 |

#### 1.3 核心生成能力（P0）

| 功能 | 说明 |
|------|------|
| 文生图 | 输入提示词生成图片 |
| 图生图 | 上传参考图 + 提示词生成新图片 |
| 文生视频 | 输入提示词生成视频 |
| 图生视频 | 上传参考图 + 提示词生成视频 |

#### 1.4 模板系统（首批 5 个验证）

| 类别 | 模板数量 | 说明 |
|------|----------|------|
| 热门模板 | 5 个 | AI 猫猫图、AI 换装图、AI 梗图、AI 头像图、AI 节日图 |
| 电商素材 | 0 个 | 第二期扩展 |
| 室内设计 | 0 个 | 第二期扩展 |

#### 1.5 用户系统（P0）

| 功能 | 说明 |
|------|------|
| Google OAuth 登录 | 一键登录，降低注册门槛 |
| 邮箱登录 | 支持邮箱密码登录（备用） |
| 历史记录 | 查看生成历史，可重新下载 |

#### 1.6 积分系统（P0）

| 功能 | 说明 |
|------|------|
| 免费额度 | 新用户赠送 20 积分 |
| 积分消耗 | 根据模型扣积分 |
| 余额管理 | 显示积分余额 |

#### 阶段一交付标准

| 功能模块 | 完成标准 |
|----------|----------|
| 文生图/图生图 | 能生成并下载图片，无水印 |
| 文生视频/图生视频 | 能生成 5 秒视频并下载 |
| 用户系统 | Google OAuth 登录、邮箱登录、历史记录 |
| 定价订阅 | 4 档定价显示、积分消耗正确 |
| 模板系统 | 5 个热门模板可用（首批验证） |

---

### 阶段二：多模型+模板（第6-10天）

**目标**：5+模型接入，模板系统上线。

#### 2.1 API接入（P0）
| 任务 | 说明 |
|------|------|
| 接入API聚合供应商 | 接入fal.ai（GPT Video/Veo 2）|
| Provider Adapter Pattern | 适配器模式，接第二个模型不改业务代码 |
| 高可用路由层 | 3家供应商自动故障转移 |
| 智能缓存层 | 复用成功案例，85%相似度命中 |

#### 2.2 模板系统扩展（P1）
| 类别 | 模板数量 |
|------|----------|
| 热门模板 | 扩展至10个 |
| 电商素材 | 首批5个 |
| 室内设计 | 首批5个 |

#### 2.3 模型广场（P1）
| 页面 | URL | 说明 |
|------|-----|------|
| 模型列表页 | `/models` | 展示所有可用模型 |
| 模型详情页 | `/model/[slug]` | 独立SEO落地页+生成入口 |

#### 2.1 API 接入（P0）

| 任务 | 说明 |
|------|------|
| 接入 API 聚合供应商 | 接入 3-5 个模型（GPT Image 2、DALL-E 3、GPT Video、Veo 2、Imagen 3） |
| 高可用路由层 | 3 家供应商自动故障转移 |
| 智能缓存层 | 复用成功案例，降低 API 成本 |

#### 2.2 模型广场（P1）

| 页面 | URL | 说明 |
|------|-----|------|
| 模型列表页 | `/models` | 展示所有可用模型/logo/简介 |
| 模型详情页 | `/model/[slug]` | 每个模型的独立 SEO 落地页 + 生成入口 |

#### 2.3 模板系统扩展（P1）

| 类别 | 模板数量 |
|------|----------|
| 热门模板 | 扩展至 10 个 |
| 电商素材 | 首批 5 个 |
| 室内设计 | 首批 5 个 |

#### 2.4 订阅功能（P0）

| 任务 | 说明 |
|------|------|
| Creem.io 申请 | 申请收款账号 |
| 订阅接入 | 4 档定价接入 |

#### 2.5 SEO 配置（P0）

| 任务 | 说明 |
|------|------|
| sitemap | 生成 sitemap.xml |
| robots.txt | 配置爬虫规则 |
| llms.txt | 让 AI 爬虫理解网站 |

#### 2.6 过审三件套（P0）

| 页面 | 说明 |
|------|------|
| 用户协议 | 页面底部链接 |
| 隐私政策 | 页面底部链接 |
| 退款政策 | 页面底部链接 |
| 联系我们 | 页面底部链接（P1） |

---

### 阶段三：登录+历史记录（第11-15天）

**目标**：用户系统完整，历史记录可用。

#### 3.1 登录功能（P0）
| 功能 | 说明 | 优先级 |
|------|------|--------|
| Google OAuth | 一键登录（推荐） | P0 |
| 邮箱登录 | 备用方案 | P1 |
| Clerk Auth | 备选（0月费，10K MAU免费） | P1 |

#### 3.2 历史记录（P0）
| 功能 | 说明 |
|------|------|
| 生成历史列表 | 查看所有生成记录 |
| 详情查看 | 查看生成参数和结果 |
| 重新下载 | 下载历史生成内容 |
| 视频生命周期 | 免费用户7天删除，付费用户长期保存 |

#### 3.1 模板系统完整版

| 类别 | 模板数量 |
|------|----------|
| 热门模板 | 10 个 |
| 电商素材 | 10 个 |
| 室内设计 | 10 个 |

#### 3.2 页面扩展

| 页面 | URL | 说明 |
|------|-----|------|
| 模板列表页（热门） | `/templates/viral` | 热门模板列表 |
| 模板列表页（电商） | `/templates/ecommerce` | 电商素材模板列表 |
| 模板列表页（室内） | `/templates/interior` | 室内设计模板列表 |
| 模板详情页 | `/template/[slug]` | 每个模板独立 URL，可做 SEO |
| 关于我们 | `/about` | 关于页面 |
| 联系我们 | `/contact` | 联系页面 |

#### 3.3 多语言支持（P1）

| 语言 | 地区 |
|------|------|
| English (en) | 默认 |
| 简体中文 (zh-CN) | 中国用户 |
| 繁体中文 (zh-TW) | 台湾/香港 |
| Spanish (es) | 西班牙/南美 |
| Portuguese (pt) | 巴西/葡萄牙 |
| French (fr) | 法国 |
| Italian (it) | 意大利 |
| German (de) | 德国 |

#### 3.4 运营功能

| 功能 | 说明 |
|------|------|
| 数据分析 | 用户行为分析 |
| A/B 测试 | 转化优化 |
| 客服系统 | 邮件支持 |

---

## 三、时间铺排

### 3.1 每日开发时间

- **交互时间**：1-2 小时（主要开发决策、代码审查）
- **持续自主开发**：后台运行，完成任务卡片

### 3.2 21天开发计划

```
第1阶段（骨架搭建）：第1-5天
├─ 第1天：项目初始化 + Supabase 配置
├─ 第2天：页面骨架搭建
├─ 第3天：核心生成能力（文生图/图生图）
├─ 第4天：核心生成能力（文生视频/图生视频）
└─ 第5天：积分系统 + 首批模板 + 上线准备 → 可申请Creem账号

第2阶段（多模型+模板）：第6-10天
├─ 第6-7天：API接入 + Provider Adapter + 高可用路由
├─ 第8天：智能缓存层 + 设计编译器
├─ 第9天：模型广场 + 模板扩展
└─ 第10天：订阅功能 + SEO配置

第3阶段（登录+历史记录）：第11-15天
├─ 第11-12天：Google OAuth + Clerk登录
├─ 第13天：历史记录功能
├─ 第14天：视频生命周期管理
└─ 第15天：用户体验优化

第4阶段（订阅+支付+三件套）：第16-21天
├─ 第16-17天：Creem.io接入 + 订阅系统
├─ 第18-19天：过审三件套（用户协议/隐私政策/联系我们）
└─ 第20-21天：最终测试 + 正式发布
```

### 3.3 关键里程碑

| 里程碑 | 时间 | 说明 |
|--------|------|------|
| M1：骨架上线 | 第5天 | MVP可演示，可申请Creem账号 |
| M2：多模型上线 | 第10天 | 5+模型接入，模板系统上线 |
| M3：用户完整 | 第15天 | 登录+历史记录完整 |
| M4：正式发布 | 第21天 | 支付+过审三件套上线 |

### 3.4 风险提示

> 注意：上述时间为保守估计，实际进度取决于：
> - API 供应商接入进度
> - 第三方服务（Supabase、Creem.io）审批时间
> - 多语言翻译资源

---

## 四、技术架构

### 4.1 技术栈

| 层次 | 方案 | 说明 |
|------|------|------|
| 前端框架 | Next.js 15 + React | 一个框架搞定落地页 + 工作台 |
| UI 组件 | Tailwind CSS + shadcn/ui | 复制粘贴式组件库 |
| 设计系统 | brand.config.ts + tailwind.config.ts | 集中管理 design tokens |
| 多语言 | next-intl 9.x | URL 自带语言前缀 |
| Auth | Supabase Auth + Google OAuth | 免费 50K MAU |
| 数据库 | Supabase Postgres + RLS | 行级权限保护用户数据 |
| 媒体存储 | Cloudflare R2 + 临时签名链接 | 出口费用为 0 |
| 视频生成管线 | Webhook 主推 + 前端轮询兜底 | 异步 Webhooks + SSE 实时推送 |
| SEO | sitemap.ts + robots.ts + 结构化数据 | |
| GEO | llms.txt + ai.txt | 让 AI 爬虫理解网站 |
| 收款 | Creem.io + Wise | 第一期后申请 |
| 部署 | Vercel | GitHub 推送自动部署 |
| DNS/CDN | Cloudflare | 免费 |

### 4.2 核心架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户层                                    │
│   用户输入 → 选择模板 → 设置参数（数量/一致性/模型）→ 提交生成      │
└────────────────────────┬────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                     产品封装层                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Prompt工程师  │  │ 风格研究员   │  │ 场景变异引擎           │  │
│  │ Agent        │  │ Agent        │  │ BatchVariationEngine │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│         ↓                ↓                      ↓               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              设计编译器 DesignCompiler                    │  │
│  │   design_reasoning → compiled_brief → final_prompt       │  │
│  └──────────────────────────┬───────────────────────────────┘  │
│                              │                                   │
│                      ┌───────▼────────┐                        │
│                      │  智能缓存层      │                        │
│                      │  SmartCache    │                        │
│                      └───────┬────────┘                        │
└──────────────────────────────┼────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                   模型能力层                                      │
│         image2 / dall-e-3 / imagen-3 / gpt-video              │
└─────────────────────────┬────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                  高可用路由层                                     │
│                                                                 │
│    ┌─────────┐    ┌─────────┐    ┌─────────┐                   │
│    │ 供应商A  │ ←→ │ 供应商B  │ ←→ │ 供应商C  │                   │
│    │ (备用)  │    │  (主)   │    │ (备用)  │                   │
│    └─────────┘    └─────────┘    └─────────┘                   │
│                                                                 │
│    职责：路由选择、故障转移、健康检查                             │
└─────────────────────────┬────────────────────────────────────────┘
                          ↓
                    调用选定供应商的 API
```

### 4.3 生成管线设计

#### 图片生成管线（同步）

```
用户提交请求
    ↓
后端：扣积分（原子操作）→ 创建任务记录
    ↓
Prompt工程师Agent → 设计编译器 → 缓存层匹配（final_prompt相似度计算）
    ↓
命中≥85%？→ 是：返回缓存（拟态loading 随机10～30秒）
    ↓ 否：调用模型能力层
    ↓
高可用路由层：选择可用供应商 → 调用供应商API
    ↓
返回结果给用户 → 更新任务状态为"已完成"
```

#### 视频生成管线（异步）

```
用户点生成
    ↓
后端：扣积分（原子操作）→ 创建任务记录
    ↓
Prompt工程师Agent → 设计编译器 → 缓存层匹配
    ↓
命中≥85%？→ 是：返回缓存（拟态loading 随机30～60秒）
    ↓ 否：继续
    ↓
调上游 API（带 webhook）
    ↓
上游完成 → webhook 回调 → 更新任务状态
    ↓
前端：每 2 秒轮询任务状态（兜底）/ 或 SSE 实时推送
    ↓
前端：显示结果
```

### 4.4 数据库表设计

| 表名 | 说明 |
|------|------|
| `users` | 用户信息 |
| `subscriptions` | 订阅记录 |
| `credits_transactions` | 积分变动流水（必须做对账） |
| `generations` | 生成任务（含 cost_usd 字段，做毛利分析） |
| `generations_cache` | 智能缓存表 |
| `models` | 模型配置表（新增模型 INSERT 一行不改代码） |
| `templates` | 模板配置 |
| `webhooks_log` | webhook 回调日志（event_id 唯一索引防重） |

---

## 五、MVP 阶段功能清单

### 5.1 核心生成能力

| 功能 | 类型 | 优先级 |
|------|------|--------|
| 文生图 | 图片生成 | P0 |
| 图生图 | 图片生成 | P0 |
| 文生视频 | 视频生成 | P0 |
| 图生视频 | 视频生成 | P0 |

### 5.2 接入模型（第一期）

| 模型 | 公司 | 类型 |
|------|------|------|
| GPT Image 2 | OpenAI | 图片生成 |
| DALL-E 3 | OpenAI | 图片生成 |
| GPT Video | OpenAI | 视频生成 |
| Veo 2 | Google | 视频生成 |
| Imagen 3 | Google | 图片生成 |

### 5.3 模板系统

| 类别 | 第一期数量 | 说明 |
|------|------------|------|
| 热门模板 | 5 个 | AI 猫猫图、AI 换装图、AI 梗图、AI 头像图、AI 节日图 |
| 电商素材 | 0 个 | 第二期 |
| 室内设计 | 0 个 | 第二期 |

### 5.4 用户系统

| 功能 | 优先级 |
|------|--------|
| Google OAuth 登录 | P0 |
| 邮箱登录 | P1 |
| 历史记录 | P0 |

### 5.5 积分系统

| 功能 | 说明 |
|------|------|
| 免费额度 | 新用户赠送 20 积分 |
| 积分消耗 | 根据模型/分辨率/时长/输出数量扣积分 |
| 余额管理 | 显示积分余额 |

### 5.6 支付系统

| 套餐 | 价格 | 积分/月 |
|------|------|---------|
| 免费版 | $0 | 20 |
| Lite 月付 | $15 | 300 |
| Lite 年付 | $10/月 ($120/年) | 300 |
| Pro 月付 | $29 | 800 |
| Pro 年付 | $14.5/月 ($174/年) | 800 |

### 5.7 积分定价表

| 操作类型 | 消耗积分 | 说明 |
|----------|----------|------|
| 文生图（基础模型） | 1 积分/张 | Imagen 3 |
| 文生图（高级模型） | 3 积分/张 | GPT Image 2 / DALL-E 3 |
| 图生图（基础模型） | 2 积分/张 | Imagen 3 |
| 图生图（高级模型） | 5 积分/张 | GPT Image 2 / DALL-E 3 |
| 文生视频（标准） | 10 积分/秒 | GPT Video / Veo 2 |
| 图生视频（标准） | 15 积分/秒 | GPT Video / Veo 2 |

---

## 六、详细开发任务分解

### 第一阶段：骨架搭建

#### 第 1 周：项目初始化

| 任务 | 子任务 | 优先级 |
|------|--------|--------|
| 初始化 Next.js 项目 | 创建 Next.js 15 项目 | P0 |
| | 配置 TypeScript | P0 |
| | 配置 Tailwind CSS | P0 |
| | 安装并配置 shadcn/ui | P0 |
| | 配置 next-intl 多语言 | P1 |
| 配置 Supabase | 创建 Supabase 项目 | P0 |
| | 设计数据库表结构 | P0 |
| | 配置 RLS 策略 | P0 |
| | 创建数据库迁移脚本 | P0 |
| 配置 Google OAuth | 创建 Google Cloud 项目 | P0 |
| | 配置 OAuth 凭据 | P0 |
| | 实现登录 API 路由 | P0 |
| 购买域名 | 购买 AiVolo.studio | P0 |
| 创建 GitHub 仓库 | 初始化仓库 | P0 |
| | 关联 Vercel | P0 |
| | 配置自动部署 | P0 |

#### 第 2 周：页面骨架

| 任务 | 子任务 | 优先级 |
|------|--------|--------|
| 首页/落地页 | 导航栏组件 | P0 |
| | Hero 区域 | P0 |
| | 4 个主功能 Tab | P0 |
| | 快捷生成框 | P0 |
| | 精选模板展示 | P0 |
| | 支持模型 LOGO 展示 | P0 |
| | FAQ 区域 | P1 |
| | 底部导航 | P0 |
| 产品生成页 `/create` | 生成类型切换 | P0 |
| | 提示词输入 | P0 |
| | 参考图上传 | P0 |
| | 模型选择 | P0 |
| | 参数设置 | P0 |
| | 生成按钮 | P0 |
| | 结果预览区 | P0 |
| 定价页 `/pricing` | 月付/年付切换 | P0 |
| | 4 档定价卡片 | P0 |
| | 订阅按钮 | P0 |
| 账户页 `/account` | 个人信息展示 | P0 |
| | 订阅信息展示 | P0 |
| | 积分余额展示 | P0 |
| 账户历史 `/account/history` | 生成历史列表 | P0 |
| | 重新下载功能 | P0 |

#### 第 3 周：文生图/图生图

| 任务 | 子任务 | 优先级 |
|------|--------|--------|
| 文生图功能 | Prompt 输入组件 | P0 |
| | 模型选择器 | P0 |
| | 生成参数设置（比例、分辨率） | P0 |
| | 调用后端 API | P0 |
| | 结果展示与下载 | P0 |
| 图生图功能 | 参考图上传组件 | P0 |
| | 参考图预览 | P0 |
| | 调用后端 API | P0 |
| | 结果展示与下载 | P0 |
| 后端 API | `/api/generate/image` 路由 | P0 |
| | 积分扣除逻辑 | P0 |
| | 任务创建与状态管理 | P0 |
| 模板选择器 | 模板列表组件 | P0 |
| | 模板详情预览 | P0 |
| | 模板参数填充 | P0 |

#### 第 4 周：视频生成 + 用户系统

| 任务 | 子任务 | 优先级 |
|------|--------|--------|
| 文生视频功能 | Prompt 输入组件 | P0 |
| | 视频参数设置（时长、分辨率） | P0 |
| | 调用后端 API | P0 |
| | 轮询任务状态 | P0 |
| | 结果展示与下载 | P0 |
| 图生视频功能 | 参考图上传组件 | P0 |
| | 调用后端 API | P0 |
| | 结果展示与下载 | P0 |
| 用户系统 | Google OAuth 登录按钮 | P0 |
| | 邮箱登录表单 | P1 |
| | 注册表单 | P1 |
| | 会话管理 | P0 |
| | 登录状态展示 | P0 |
| 历史记录 | 列表展示 | P0 |
| | 详情查看 | P0 |
| | 重新下载 | P0 |

#### 第 5 周：积分系统 + 上线准备

| 任务 | 子任务 | 优先级 |
|------|--------|--------|
| 积分系统 | 积分余额展示 | P0 |
| | 积分扣除逻辑 | P0 |
| | 积分不足提示 | P0 |
| | 积分充值引导 | P0 |
| 首批 5 个模板 | AI 猫猫图模板 | P0 |
| | AI 换装图模板 | P0 |
| | AI 梗图模板 | P0 |
| | AI 头像图模板 | P0 |
| | AI 节日图模板 | P0 |
| 基础 SEO | meta 标签配置 | P0 |
| | Open Graph 配置 | P0 |
| | favicon | P0 |
| 域名解析 | DNS 配置 | P0 |
| | SSL 证书 | P0 |
| Vercel 部署 | 生产环境部署 | P0 |
| | 预览部署配置 | P0 |

---

### 第二阶段：功能完善

#### 第 6-7 周：API 接入

| 任务 | 子任务 | 优先级 |
|------|--------|--------|
| API 聚合供应商接入 | 选择供应商（piapi.ai / grsai.com / pic2api.com） | P0 |
| | 供应商适配器实现 | P0 |
| | 供应商配置管理 | P0 |
| 高可用路由层 | 主备切换逻辑 | P0 |
| | 健康检查机制 | P0 |
| | 故障转移流程 | P0 |
| 智能缓存层 | 缓存匹配逻辑（85% 相似度） | P0 |
| | 缓存存储实现 | P0 |
| | 拟态加载机制（图片 30 秒，视频 60 秒） | P0 |
| 模型能力层 | 模型选择接口 | P0 |
| | 模型参数映射 | P0 |
| 设计编译器 | Prompt 工程师 Agent | P0 |
| | 风格研究员 Agent | P0 |
| | 设计编译器实现 | P0 |

#### 第 8 周：模型广场 + 模板扩展

| 任务 | 子任务 | 优先级 |
|------|--------|--------|
| 模型广场 | `/models` 列表页 | P1 |
| | `/model/[slug]` 详情页 | P1 |
| | 模型 Logo 展示 | P1 |
| | 模型简介展示 | P1 |
| | 示例作品展示 | P1 |
| | "使用此模型生成"按钮 | P1 |
| 模板扩展 | 热门模板扩展至 10 个 | P1 |
| | 电商素材首批 5 个 | P1 |
| | 室内设计首批 5 个 | P1 |

#### 第 9 周：订阅功能 + SEO

| 任务 | 子任务 | 优先级 |
|------|--------|--------|
| Creem.io 接入 | 申请账号 | P0 |
| | 配置产品 | P0 |
| | 支付回调处理 | P0 |
| | 订阅状态同步 | P0 |
| SEO 配置 | sitemap.xml 生成 | P0 |
| | robots.txt 配置 | P0 |
| | llms.txt 生成 | P0 |
| | 结构化数据 | P0 |

#### 第 10 周：过审三件套 + 优化

| 任务 | 子任务 | 优先级 |
|------|--------|--------|
| 用户协议页面 | 撰写协议内容 | P0 |
| | 页面开发 | P0 |
| 隐私政策页面 | 撰写政策内容 | P0 |
| | 页面开发 | P0 |
| 退款政策页面 | 撰写政策内容 | P0 |
| | 页面开发 | P0 |
| 联系我们页面 | 联系方式展示 | P1 |
| | 联系表单 | P1 |
| 性能优化 | 图片优化 | P0 |
| | 加载速度优化 | P0 |
| | Core Web Vitals 优化 | P0 |

---

### 第三阶段：血肉填充

#### 第 11-12 周：完整模板 + 多语言

| 任务 | 子任务 | 优先级 |
|------|--------|--------|
| 60 个模板 | 热门模板 10 个 | P1 |
| | 电商素材 10 个 | P1 |
| | 室内设计 10 个 | P1 |
| 剩余页面 | `/templates/viral` | P1 |
| | `/templates/ecommerce` | P1 |
| | `/templates/interior` | P1 |
| | `/template/[slug]` | P1 |
| | `/about` | P1 |
| | `/contact` | P1 |
| 多语言支持 | next-intl 配置 | P1 |
| | 英文翻译 | P1 |
| | 西班牙语翻译 | P1 |
| | 葡萄牙语翻译 | P1 |

#### 第 13 周：发布准备

| 任务 | 子任务 | 优先级 |
|------|--------|--------|
| 测试 | E2E 测试 | P0 |
| | 视觉回归测试 | P0 |
| | Accessibility 测试 | P0 |
| 准备上线 | 最终 SEO 检查 | P0 |
| | 性能检查 | P0 |
| | 移动端适配验证 | P0 |
| 正式发布 | 切换到生产环境 | P0 |
| | 监控告警配置 | P0 |

---

## 七、技术规范

### 7.1 项目结构

```
ai-video-tool/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (marketing)/         # 营销页面
│   │   │   ├── page.tsx         # 首页
│   │   │   ├── pricing/
│   │   │   ├── about/
│   │   │   └── contact/
│   │   ├── (app)/               # 应用页面
│   │   │   ├── create/
│   │   │   ├── models/
│   │   │   ├── templates/
│   │   │   └── account/
│   │   ├── api/                 # API 路由
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                  # shadcn/ui 组件
│   │   ├── features/            # 功能组件
│   │   ├── marketing/           # 营销组件
│   │   └── app/                # 应用组件
│   ├── lib/
│   │   ├── supabase/           # Supabase 客户端
│   │   ├── api/                # API 调用
│   │   └── utils.ts
│   ├── hooks/                  # React Hooks
│   ├── types/                  # TypeScript 类型
│   └── styles/                 # 全局样式
├── public/                     # 静态资源
├── messages/                   # 多语言文件
└── supabase/
    └── migrations/             # 数据库迁移
```

### 7.2 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | `HeroSection.tsx` |
| 页面 | kebab-case | `account-history.tsx` |
| 工具函数 | camelCase | `formatCredits.ts` |
| CSS 类 | kebab-case | `hero-section` |
| 数据库表 | snake_case | `credits_transactions` |
| API 路由 | kebab-case | `/api/generate/image` |
| 模板 ID | `{type}_{num}` | `hot_img_01` |

### 7.3 设计系统

详细设计规范见 [SPEC.md](./SPEC.md) 第五章。

| 设计元素 | 规范 |
|----------|------|
| 主色 | `#7C5CFF` (oklch 72% 0.18 270) |
| 辅色 | `#FF6B6B` (珊瑚粉) |
| 背景色 | oklch(14% 0 0) |
| 字体 | Geist (Vercel 出品) |
| 圆角 | 4px - 24px |
| 阴影 | 3 层系统 |

---

## 八、资源清单

### 8.1 第三方服务

| 服务 | 用途 | 申请方式 |
|------|------|----------|
| Supabase | 数据库 + Auth | supabase.com |
| Google OAuth | 登录 | Google Cloud Console |
| Cloudflare R2 | 媒体存储 | Cloudflare Dashboard |
| Vercel | 部署 | vercel.com |
| Creem.io | 收款 | creem.io (第一期后申请) |
| Wise | 收款 | wise.com |
| API 聚合供应商 | 模型 API | piapi.ai / grsai.com / pic2api.com |

### 8.2 参考资料

| 资源 | 说明 |
|------|------|
| SPEC.md | 产品规格文档 |
| `src/reference/multi-agent-image/` | 参考实现（设计编译器、编排器等） |
| Pollo.ai | 主要竞品参考 |
| Next.js 15 Docs | 框架文档 |
| Supabase Docs | 数据库文档 |
| shadcn/ui | 组件库文档 |

---

## 九、注意事项

### 9.1 重要设计决策

1. **模型能力层与供应商正交**：用户选模型（如 GPT image2），高可用路由层选择供应商
2. **同一时刻只有一家供应商服务**：故障时自动切换
3. **缓存匹配使用 final_prompt**：而非用户原始输入
4. **拟态加载机制**：缓存命中时，模拟真实生成流程（图片 30 秒，视频 60 秒）

### 9.2 MVP 完成标准

详见 [SPEC.md](./SPEC.md) 2.8 节。

### 9.3 缓存策略

- 保存时间：3 个月
- 命中阈值：相似度 >= 85%
- 用户无感知：缓存命中/未命中体验相同
- 拟态加载：防止用户感知"瞬间完成"

---

## 十、Provider Adapter Pattern 实现

### 10.1 核心接口
```typescript
// src/lib/providers/base.ts
interface ProviderAdapter {
  readonly name: string;
  readonly supportedModels: string[];

  generateImage(params: ImageGenerationParams): Promise<GenerationResult>;
  generateVideo(params: VideoGenerationParams): Promise<GenerationResult>;
  getTaskStatus(taskId: string): Promise<TaskStatus>;
  healthCheck(): Promise<boolean>;
}
```

### 10.2 路由策略
```typescript
// src/lib/providers/router.ts
class ProviderRouter {
  private providers: ProviderAdapter[];
  private currentIndex: number;

  async route<T>(
    operation: 'image' | 'video',
    params: T
  ): Promise<GenerationResult> {
    // 按顺序尝试 providers，故障自动切换
    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[(this.currentIndex + i) % this.providers.length];
      if (await provider.healthCheck()) {
        try {
          const result = operation === 'image'
            ? await provider.generateImage(params)
            : await provider.generateVideo(params);
          this.currentIndex = (this.currentIndex + i) % this.providers.length;
          return result;
        } catch (error) {
          console.error(`Provider ${provider.name} failed:`, error);
          continue;
        }
      }
    }
    throw new Error('All providers unavailable');
  }
}
```

### 10.3 新增模型流程
1. 在 `providers/` 目录创建新适配器（如 `fal-ai-adapter.ts`）
2. 实现 `ProviderAdapter` 接口
3. 在 `providers/index.ts` 注册
4. 在 `models` 表 INSERT 一行配置
5. **无需修改业务代码**

---

## 十一、视频生成管线（Webhook + 轮询）

### 11.1 异步管线流程
```
用户提交 → 扣积分(原子) → 创建任务 → 返回task_id
                ↓
前端：立即开始轮询 /api/task/{task_id}（每2秒）
                ↓
同时：调用供应商API（带webhook_url）
                ↓
供应商处理完成 → POST webhook → 后端更新状态
                ↓
前端轮询到状态变更 → 显示结果
```

### 11.2 Webhook 处理
```typescript
// src/app/api/webhook/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  const { event_id, status, result_url } = body;

  // event_id 唯一索引防重
  await supabase.from('webhooks_log').upsert({
    event_id,
    status,
    result_url,
    processed_at: new Date().toISOString()
  }, { onConflict: 'event_id' });

  if (status === 'completed') {
    await supabase
      .from('generations')
      .update({ status: 'completed', result_url, completed_at: new Date().toISOString() })
      .eq('provider_task_id', event_id);
  }

  return NextResponse.json({ received: true });
}
```

### 11.3 前端轮询（兜底）
```typescript
// src/hooks/useTaskStatus.ts
export function useTaskStatus(taskId: string) {
  const [status, setStatus] = useState<TaskStatus>('pending');

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/task/${taskId}`);
      const data = await res.json();
      setStatus(data.status);
      if (data.status === 'completed' || data.status === 'failed') {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [taskId]);

  return status;
}
```

---

## 十二、Auth 方案（Clerk 备选）

### 12.1 推荐方案：Google OAuth
- Supabase Auth 内置 Google OAuth
- 免费 50K MAU
- 一键登录，用户门槛低

### 12.2 备选方案：Clerk
如果 Supabase Auth 有限制，可切换到 Clerk：
- 0 月费，10K MAU 免费
- 更好的嵌入式组件
- 切换成本低（仅改 auth 层）

```typescript
// src/middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

---

## 十三、视频生命周期管理

### 13.1 存储策略
| 用户类型 | 保存期限 | 说明 |
|----------|----------|------|
| 免费用户 | 7天后自动删除 | 节省存储成本 |
| 付费用户 | 长期保存 | 订阅有效期内 |
| 退订用户 | 退订后30天删除 | 过渡期 |

### 13.2 定时清理任务
```sql
-- 每天凌晨3点执行
CREATE OR REPLACE FUNCTION cleanup_expired_videos()
RETURNS void AS $$
BEGIN
  -- 免费用户7天前生成且未订阅的视频
  DELETE FROM generations
  WHERE created_at < NOW() - INTERVAL '7 days'
    AND user_id NOT IN (
      SELECT user_id FROM subscriptions
      WHERE status = 'active'
    );

  -- 退订用户30天前的内容
  DELETE FROM generations
  WHERE user_id IN (
    SELECT user_id FROM subscriptions
    WHERE status = 'canceled'
      AND canceled_at < NOW() - INTERVAL '30 days'
  );
END;
$$ LANGUAGE plpgsql;
```

---

## 十四、容量规划（4档用户量）

### 14.1 容量档位
| 阶段 | DAU | 日生成量 | 技术方案 |
|------|-----|----------|----------|
| MVP | <50 | <100 | 单实例，基础缓存 |
| 早期 | 50-500 | 100-1000 | Redis缓存，CDN加速 |
| 成长 | 500-5000 | 1000-10000 | 自动扩缩容，数据库读写分离 |
| 规模 | >5000 | >10000 | 多区域部署，边缘计算 |

### 14.2 扩容策略
- **数据库**：Supabase 500MB免费，超出按量付费
- **R2存储**：10GB免费，需监控使用量
- **fal.ai**：$20起，按使用量付费
- **Vercel**： Hobby免费，Pro $20/月

---

## 十五、21天检查清单

### 上线前必须确认的10个问题

| # | 问题 | 检查点 |
|---|------|--------|
| 1 | 核心生成功能 | 文生图/图生图/文生视频/图生视频都能生成并下载 |
| 2 | 积分系统 | 扣积分原子操作，无超扣风险 |
| 3 | 登录功能 | Google OAuth一键登录正常 |
| 4 | 历史记录 | 生成记录可查看、可重新下载 |
| 5 | 订阅支付 | Creem.io接入，支付流程完整 |
| 6 | 视频生命周期 | 免费用户7天删除逻辑生效 |
| 7 | Provider路由 | 故障自动切换，不影响用户 |
| 8 | 缓存命中 | 85%相似度命中，3个月保存 |
| 9 | 过审三件套 | 用户协议/隐私政策/联系我们页面存在 |
| 10 | 移动端适配 | 主流分辨率（320/375/768/1024）可正常访问 |

---

*文档状态：初稿，待补充细节。核心功能和设计方向已确定，可进入开发阶段。*
