# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AiVolo.studio** - AI 图片/视频生成工具，面向欧洲、南美、东南亚市场。核心功能：文生图、图生图、文生视频、图生视频，通过模板系统降低使用门槛。

## Project Status

**Next.js 项目尚未初始化** — 当前仅有文档和参考文件，无 `package.json`。需要先运行初始化命令。

## Architecture

### 核心技术架构（详见 SPEC.md 6.0 节）

```
用户层 → 产品封装层 → 模型能力层 → 高可用路由层 → 供应商API
                ↑
        Prompt工程师Agent / 风格研究员Agent / 场景变异引擎 / 设计编译器 / 智能缓存层
```

**关键设计决策**：
- 模型能力层与供应商正交：用户选模型（如 GPT image2），高可用路由层选择供应商
- 同一时刻只有一家供应商服务，故障时自动切换
- 缓存匹配使用 `final_prompt`（加工后的提示词），非用户原始输入

## Development Commands

项目初始化后：

```bash
npm install && npm run dev   # 启动开发服务器
```

## Reference Materials

`src/reference/multi-agent-image/` 目录包含从 Kangarooking/multi-agent-image 复制的参考文件：
- `design_compiler.py` — 设计编译器三层结构（design_reasoning → compiled_brief → final_prompt）
- `orchestrator_v2.py` — Agent 工作流编排器
- `batch_generator_v2.py` — 批量生成逻辑
- `series_generator.py` — 系列生成（保持视觉一致性）

这些是参考实现，后续开发需结合产品需求（智能缓存、多模型支持）进行适配。

## Technical Stack

- 前端：Next.js 15 + React + Tailwind CSS + shadcn/ui
- 数据库：Supabase Postgres + RLS
- 媒体存储：Cloudflare R2
- 部署：Vercel

## Key Files

| 文件 | 说明 |
|------|------|
| `SPEC.md` | 产品规格文档（40KB）- 60个模板、4档定价、模型接入 |
| `DEVELOPMENT.md` | 开发文档（35KB）- 21天开发计划、技术架构 |

## Important Notes

- 缓存命中阈值 85%，图片拟态加载 30 秒，视频拟态加载 60 秒
- 积分定价表使用第一期实际模型（GPT/DALL-E/Veo/Imagen），非 Stable Diffusion/Kling/Luma
- 域名已购买：AiVolo.studio
- API 聚合供应商推荐：piapi.ai / grsai.com / pic2api.com