# Halo Plugin Spec Kit (HPS) - Agentic Edition

<p align="center">
  <img src="https://img.shields.io/npm/v/@cysupper/halo-plugin-spec-kit" alt="npm version" />
  <img src="https://img.shields.io/badge/Halo-2.x-blue" alt="Halo 2.x" />
  <img src="https://img.shields.io/badge/AI-Agentic-purple" alt="AI Agent Ready" />
</p>

> **让 AI 真正学会开发 Halo 插件。**
> HPS 不仅仅是一个脚手架，它是一个**AI 技能包 (Agentic Skill)** 分发器。它将 Halo 2.x 的核心架构、开发规范、反模式（Anti-Patterns）打包成专家级 Skill，赋能 Opencode, Cursor, Windsurf, Trae 等 AI 代理，使其具备“全自动开发”插件的能力。

## 🎥 演示

![Demo](docs/screencast/demo.gif)

## 🌟 核心特性

- **🧠 Agentic Skill**: 内置 `halo-plugin-builder` 技能，包含 Reactive 编程、Extension 建模、Vue3 UI 等全套知识库。
- **🛡️ 严格风控**: 植入 `STRICT_RULES`，强制 AI 遵守非阻塞 I/O 原则，防止生成导致系统崩溃的代码。
- **🚀 一键初始化**: 集成官方 `pnpm create halo-plugin`，并自动为当前项目注入 AI 技能。
- **🩺 环境诊断**: `hps doctor` 自动检查 Java, Node, Docker 环境。

## 📦 安装

```bash
npm install -g @cysupper/halo-plugin-spec-kit
```

或者直接使用 `npx`：

```bash
npx @cysupper/halo-plugin-spec-kit init
```

## 🛠️ 使用指南

### 1. 初始化项目

在一个空目录下运行：

```bash
hps init <project-name>
```

- **选择 AI Agent**: 支持 Opencode, Cursor, Windsurf, Trae, Claude 等。
- **自动配置**: 工具会自动下载官方模板，并将 `halo-plugin-builder` Skill 安装到对应的规则目录（如 `.opencode/skills/` 或 `.cursor/rules/`）。

### 2. 开始 AI 编码

项目创建完成后，打开您的 AI 编辑器（Opencode / Cursor / Trae），直接用自然语言下达指令：

> **"帮我开发一个简单的留言板功能，需要定义一个 Message 模型，并提供后台管理界面。"**

AI 会自动触发 `halo-plugin-builder` 技能：
1.  **架构设计**: 引用 `architecture.md`，决定创建 `Extension` 而非 MySQL 表。
2.  **代码生成**: 引用 `backend_deep_dive.md` 生成 `Reconciler` 和 `Extension` Java 代码。
3.  **UI 开发**: 引用 `frontend_deep_dive.md` 生成 Vue 3 管理页面。
4.  **自我审查**: 检查是否违反 `strict_rules.md`（如使用了 Thread.sleep）。

### 3. 手动安装 Skill (已有项目)

如果您已经有一个 Halo 插件项目，只想安装 AI 技能：

```bash
cd my-existing-plugin
hps skill
```

## 📂 Skill 包含的知识库

安装后，您的项目下会多出 `.opencode/skills/halo-plugin-builder` (或类似目录)，包含：

- **`SKILL.md`**: 核心指令集。
- **`references/`**:
    - `backend_deep_dive.md`: Spring WebFlux & R2DBC 深度指南。
    - `frontend_deep_dive.md`: Console UI 组件库指南。
    - `strict_rules.md`: **[关键]** 开发红线。
    - `architecture.md`: Halo 2.x 架构图解。
- **`assets/templates/`**: 标准化代码模板。

## 🤖 支持的 AI 环境

| AI Agent / IDE | 支持程度 | 安装路径 |
| :--- | :--- | :--- |
| **Opencode Agent** | ⭐⭐⭐⭐⭐ | `.opencode/skills/` (原生支持) |
| **Cursor IDE** | ⭐⭐⭐⭐⭐ | `.cursor/rules/` (原生支持) |
| **Windsurf IDE** | ⭐⭐⭐⭐⭐ | `.windsurf/rules/` (原生支持) |
| **Trae IDE** | ⭐⭐⭐⭐⭐ | `.trae/rules/` (原生支持) |
| **Claude / Copilot** | ⭐⭐⭐ | `.hps/skills/` (需手动复制 Prompt) |

## 🔗 相关链接

- [Halo 官方文档](https://docs.halo.run)
- [Halo 插件开发指南](https://docs.halo.run/category/%E6%8F%92%E4%BB%B6%E5%BC%80%E5%8F%91)

---

<p align="center">Made with ❤️ by Halo Community & AI</p>
