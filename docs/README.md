# AiVolo.studio 文档结构

本目录收纳项目文档。根目录只保留仓库入口和模型规则文件：[`README.md`](../README.md)、[`AGENTS.md`](../AGENTS.md)、[`CLAUDE.md`](../CLAUDE.md)。

## 目录

- [`development/`](./development/)：当前生效、直接指导开发的文档。
  - [`SPEC_V2.md`](./development/SPEC_V2.md)：产品规格事实源。
  - [`DEVELOPMENT_PLAN_V2.md`](./development/DEVELOPMENT_PLAN_V2.md)：开发计划、Agent 编排、验收和状态事实源。
- [`archive/`](./archive/)：已废弃或历史版本文档，只在需要追溯旧口径时参考。
- [`research/`](./research/)：访谈、调研和需求探索记录。
- [`../references/`](../references/)：外部参考实现、技能样例和非运行时代码。

## 放置规则

- 会直接指导开发、验收或产品口径的文档，放在 `docs/development/`。
- 废弃版本、旧计划、历史迁移材料，放在 `docs/archive/`。
- 访谈和调研材料，放在 `docs/research/`。
- 不属于 Next.js 运行时的参考实现，放在根目录 `references/`，不要放进 `src/`。
- 与具体代码模块强绑定的 `README.md` 留在对应模块目录下。
- Agent / LLM 工作规则文件保持在项目根目录，便于 Codex、Claude 和其他工具自动识别。
