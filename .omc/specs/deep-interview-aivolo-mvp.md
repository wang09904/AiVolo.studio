# Deep Interview Spec: AiVolo.studio MVP (第一阶段)

## Metadata

- Interview ID: aivolo-mvp-phase-1
- Rounds: 11
- Final Ambiguity Score: 1.8%
- Type: greenfield
- Generated: 2026-04-28
- Threshold: 20%
- Status: PASSED

---

## Clarity Breakdown

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Goal Clarity | 0.99 | 0.40 | 0.396 |
| Constraint Clarity | 0.98 | 0.30 | 0.294 |
| Success Criteria | 0.97 | 0.30 | 0.291 |
| **Total Clarity** | | | **98.1%** |
| **Ambiguity** | | | **1.8%** |

---

## Goal

**第一阶段 MVP**：构建一个真实上线的 AI 图片生成工具网站，具备完整用户流程（登录 → 生成 → 下载 → 历史记录），满足 Creem.io 注册审核条件。

---

## Constraints

1. **技术栈**：Next.js 15 + React + Tailwind + shadcn/ui
2. **数据库**：Supabase Postgres + RLS
3. **存储**：Cloudflare R2 + 临时签名链接
4. **部署**：Vercel + GitHub 自动部署
5. **域名**：AiVolo.studio（已购买）
6. **API**：用户提供的中转网站（OpenAI 格式兼容）
7. **无移动端适配**（近期不考虑）
8. **无邮箱登录**（仅 Google OAuth）
9. **无真实支付集成**（第二阶段再做）

---

## Non-Goals

- 视频生成功能（第二阶段）
- 模板系统（第二阶段）
- 多模型支持（第二阶段）
- 移动端适配（暂不做）
- 邮箱登录降级方案（不做）
- 真实支付/Creem 集成（第二阶段）

---

## Acceptance Criteria

- [ ] 网站可访问：首页 /create /pricing /account 全部可访问
- [ ] Google OAuth 登录：完整登录流程，无降级方案
- [ ] 文生图功能：单模型（用户提供的 API），真实调用，完整流程
- [ ] 生成结果：用户可看到图片并下载
- [ ] 积分系统：新用户 20 积分，生成扣除积分，余额多端显示
- [ ] 订阅页 UI：月付/年付 Tab 切换，4 档定价，Coming Soon 按钮
- [ ] 三件套：用户协议 / 隐私政策 / 退款政策 / 联系我们（URL 可访问）
- [ ] 部署上线：Vercel 部署 + DNS 解析
- [ ] 账户页：个人信息 + 积分余额 + 生成历史（时间/提示词/缩略图）+ 下载按钮

---

## Assumptions Exposed & Resolved

| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| 需要视频功能才能过审 | 询问 Creem 实际要求 | Creem 只要求真实产品 + 可订阅，无具体功能要求 |
| 需要真实支付才能审核 | 询问审核标准 | 第一阶段只需订阅 UI，"Coming Soon" 足够 |
| 首页需要完整 7+1 屏 | 确认 MVP 范围 | 第一阶段：Hero + 生成框 + 定价 + 三件套 |
| 需要邮箱登录降级 | 确认登录方式 | 只做 Google OAuth，无降级 |
| 图片生成需要 Mock | 确认是否真实调用 | 必须真实 API 调用，完整用户流程 |
| 移动端是 MVP 必需 | 确认优先级 | 移动端暂不做，专注核心 PC 体验 |

---

## Technical Context

**技术栈**：
- 前端：Next.js 15 + React + Tailwind CSS + shadcn/ui
- 后端：Next.js API Routes
- 数据库：Supabase Postgres
- 媒体存储：Cloudflare R2
- 部署：Vercel
- DNS/CDN：Cloudflare

**API 接入**：
- 用户提供的中转 API（OpenAI 格式兼容）
- 第一阶段单模型接入
- 未来扩展：3-5 家聚合供应商

---

## Ontology (Key Entities)

| Entity | Type | Fields | Relationships |
|--------|------|--------|---------------|
| User | core domain | id, email, name, avatar, credits_balance, created_at | has many Generations, has one Subscription |
| Generation | core domain | id, user_id, prompt, model_id, image_url, status, credits_used, created_at | belongs to User |
| Credits | supporting | user_id, balance, transaction_count | tracks User's credits |
| Subscription | supporting | user_id, plan (lite/pro), status, current_period_end | belongs to User |
| Model | supporting | id, name, provider, type (image/video), api_format | used in Generation |
| Template | external (future) | id, name, category, prompt_template, aspect_ratios | not in MVP |

---

## Interview Transcript

<details>
<summary>Full Q&A (11 rounds)</summary>

### Round 1
**Q:** 完成 MVP 后，怎么判断网站"可以提交 payment account 申请"？
**A:** 带基础的谷歌登录 + 基本图片视频生成（先具备图片生成能力即可）+ 订阅页面（纯 UI，点击购买弹出 Coming Soon），成功部署上线，这一个完整流程是省不了的。第一阶段目的就是做到一个真实上线、具备基本功能的网站，可以是任何工具（如 AI word 排版工具），只要能拿出这个网站来，Creem 注册审核就能通过。

### Round 2
**Q:** 订阅页 4 档定价的具体展示方式？
**A:** 四个产品全部显示月均价格，年付产品标注"按年计费"。不展示全年总金额。月付/年付 Tab 切换都要做。月付直接列月度价格，年付列月均价格 + "按年计费"提示。购买按钮直接置灰写"Coming Soon"。

### Round 3
**Q:** 图片生成需要真实调用 API 还是 Mock 数据？
**A:** 必须具备一个基本的图片生成功能，做一个最基本的"文生图"功能。用户会提供一个临时的 API 中转网站，设置一个简单的图片生成模型，先把整个产品流程跑通。生成的结果要给用户体现出来，允许用户生成和下载。

### Round 4
**Q:** API 中转网站的接口格式？
**A:** 支持 OpenAI 的格式。

### Round 5
**Q:** Creem 审核对三件套的具体要求？
**A:** 要求真实产品 + 用户可订阅 + 三件套（退款政策、联系我们、其他必要套件）。对产品内容没有具体要求。

### Round 6
**Q:** 三件套的具体内容清单？
**A:** 用户协议、隐私政策、退款政策、联系我们，这四个必须有。Cookie 政策如果简单也可以做。内容去找通用条款和模板，参考竞品视频网站，搬过来后针对产品名称和功能描述进行适应性修改。

### Round 7
**Q:** 生成页 UI 需要哪些元素？
**A:** 模型下拉框要做（以后往里加选项方便），图片比例参数要做（第一阶段先只加这一个），图片质量默认 1080P 不在前台显示。模板功能完全不做。提示词输入框 + 模型参数 + 图片比例参数 + 生成按钮。

### Round 8
**Q:** 积分系统在第一阶段要做什么？
**A:** 新注册用户直接给 20 个积分，生成一张图片按定价扣除相应积分，账户处显示剩余可用积分。余额显示在首页右上角用户头像旁边 + 账户页。其他积分功能放第二阶段。

### Round 9
**Q:** 首页 MVP 实现哪些屏？
**A:** 首屏 Hero（必须）+ 生成框（必须）+ 定价卡片（必须）+ 底部导航/三件套（必须）。模型墙不做，模板区不做，+1 屏移动端固定按钮不做（暂时不考虑移动端）。

### Round 10
**Q:** 部署目标和账户页内容？
**A:** Vercel + GitHub 推送自动部署。账户页显示：基础个人信息 + 积分余额 + 生成历史记录（时间/提示词/缩略图），下载按钮必须有。订阅状态暂不做（放第二阶段）。

### Round 11
**Q:** 生成历史记录字段？
**A:** 最简版本：时间 + 提示词 + 生成图片缩略图 + 下载按钮。

</details>

---

## Phase 2 & 3 Scope (From SPEC.md)

### 第二阶段（21天冲刺第6-15天）

**核心功能**：
1. **多模型支持**：接入 3-5 个图片/视频模型（GPT Image 2、DALL-E 3、Veo 2、Imagen 3 等）
2. **图生图功能**：上传参考图 + 提示词生成新图片
3. **文生视频功能**：输入提示词生成视频
4. **图生视频功能**：上传参考图 + 提示词生成视频
5. **模板系统**：首批 20 个模板（热门/电商/室内设计）
6. **智能缓存层**：85% 相似度命中，复用成功案例
7. **高可用路由层**：3 家供应商自动故障转移

### 第三阶段（21天冲刺第16-21天）

**完善功能**：
1. **模板扩展**：从 20 个扩展至 60 个
2. **订阅支付完整接入**：Creem.io 真实支付 + Wise 提现
3. **多语言支持**：6 种语言（en/zh-CN/zh-TW/es/pt/fr）
4. **移动端适配**：320/375/768/1024 响应式
5. **模型广场**：/models 列表页 + /model/[slug] 详情页（SEO 流量）
6. **历史记录完善**：增加模型、积分消耗等字段
7. **API 聚合供应商**：接入 piapi.ai / grsai.com / pic2api.com

---

*Generated by Deep Interview — 2026-04-28*