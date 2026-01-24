# Halo Plugin Spec Kit (HPS) - Agentic Edition

<p align="center">
  <img src="https://img.shields.io/npm/v/@cysupper/halo-plugin-spec-kit" alt="npm version" />
  <img src="https://img.shields.io/badge/Halo-2.x-blue" alt="Halo 2.x" />
  <img src="https://img.shields.io/badge/AI-Agentic-purple" alt="AI Agent Ready" />
</p>

> **Empowering AI to build Halo plugins natively.**
> HPS is not just a CLI scaffold; it is a **Skill Distributor**. It packages Halo 2.x architecture, development standards, and anti-patterns into expert-level Agentic Skills, enabling AI agents (Opencode, Cursor, Windsurf, Trae) to perform "fully automated development".

[🇨🇳 中文文档](README_zh.md)

## 🎥 Demo

![Demo](docs/screencast/demo.gif)

## 🌟 Core Features

- **🧠 Agentic Skill**: Built-in `halo-plugin-builder` skill with full knowledge base of Reactive programming, Extension modeling, and Vue3 UI.
- **🛡️ Strict Safety**: Injects `STRICT_RULES` to force AI to adhere to non-blocking I/O principles, preventing crash-prone code.
- **🚀 One-Click Init**: Integrates official `pnpm create halo-plugin` and automatically injects AI skills into your project.
- **🩺 Doctor**: `hps doctor` automatically checks Java, Node, and Docker environments.

## 📦 Installation

```bash
npm install -g @cysupper/halo-plugin-spec-kit
```

Or use `npx`:

```bash
npx @cysupper/halo-plugin-spec-kit init
```

## 🛠️ Usage Guide

### 1. Initialize Project

Run in an empty directory:

```bash
hps init <project-name>
```

- **Select AI Agent**: Supports Opencode, Cursor, Windsurf, Trae, Claude, etc.
- **Auto Config**: Automatically downloads the official template and installs the `halo-plugin-builder` skill into the corresponding rules directory (e.g., `.opencode/skills/` or `.cursor/rules/`).

### 2. Start AI Coding

Once created, open your AI Editor (Opencode / Cursor / Trae) and issue a natural language command:

> **"Build a simple Guestbook feature. I need a Message model and a backend management UI."**

The AI will automatically trigger the `halo-plugin-builder` skill:
1.  **Architecture**: References `architecture.md` to create an `Extension` instead of a MySQL table.
2.  **Code Gen**: References `backend_deep_dive.md` to generate `Reconciler` and `Extension` Java code.
3.  **UI Dev**: References `frontend_deep_dive.md` to generate Vue 3 admin pages.
4.  **Self-Check**: Verifies compliance with `strict_rules.md`.

### 3. Manual Skill Install (Existing Project)

If you have an existing Halo plugin project and just want the AI skill:

```bash
cd my-existing-plugin
hps skill
```

## 📂 Knowledge Base Inside the Skill

Once installed, your project will contain `.opencode/skills/halo-plugin-builder` (or similar), featuring:

- **`SKILL.md`**: Core instruction set.
- **`references/`**:
    - `backend_deep_dive.md`: Spring WebFlux & R2DBC deep guide.
    - `frontend_deep_dive.md`: Console UI components guide.
    - `strict_rules.md`: **[CRITICAL]** Development red lines.
    - `architecture.md`: Halo 2.x architecture diagrams.
- **`assets/templates/`**: Standardized code templates.

## 🤖 Supported AI Environments

| AI Agent / IDE | Support Level | Path |
| :--- | :--- | :--- |
| **Opencode Agent** | ⭐⭐⭐⭐⭐ | `.opencode/skills/` (Native) |
| **Cursor IDE** | ⭐⭐⭐⭐⭐ | `.cursor/rules/` (Native) |
| **Windsurf IDE** | ⭐⭐⭐⭐⭐ | `.windsurf/rules/` (Native) |
| **Trae IDE** | ⭐⭐⭐⭐⭐ | `.trae/rules/` (Native) |
| **Claude / Copilot** | ⭐⭐⭐ | `.hps/skills/` (Manual Prompt Copy) |

## 🔗 Links

- [Halo Docs](https://docs.halo.run)
- [Plugin Dev Guide](https://docs.halo.run/category/%E6%8F%92%E4%BB%B6%E5%BC%80%E5%8F%91)

---

<p align="center">Made with ❤️ by Halo Community & AI</p>
