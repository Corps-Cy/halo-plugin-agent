# Halo Plugin Spec Kit (HPS)

> **The AI-Native Infrastructure for Halo 2.x Plugin Development (V2.0)**

[![NPM Version](https://img.shields.io/npm/v/@cysupper/halo-plugin-spec-kit?color=cyan)](https://www.npmjs.com/package/@cysupper/halo-plugin-spec-kit)
![License](https://img.shields.io/badge/License-MIT-green)
![Node](https://img.shields.io/badge/Node-%3E%3D14-blue)

[🇨🇳 中文文档](README_zh.md) | [🐞 Report Issue](https://github.com/Corps-Cy/halo.plugin.spec-kit/issues)

HPS is an **AI Product Architect** toolkit that turns your vague ideas into production-ready Halo 2.x plugins using **Topic-Based Smart Context** and **Strict Anti-Pattern Firewall**.

---

## 🌟 What's New in V2.0?

-   **🛡️ Strict Rules Engine**: Injects a "Criminal Code" (`STRICT_RULES.md`) to forbid AI from using `.block()`, Servlet APIs, or manual SQL—preventing infinite error loops.
-   **📚 Topic-Based Knowledge**: Replaced 90+ fragmented files with **11 high-density core topic documents** for 300% faster AI context loading.
-   **⚙️ Halo 2.22+ Ready**: Fully aligned with the latest architecture (Synchronous Reconcilers, Snapshot-based content, Iconify system).
-   **🛠️ Verified Patterns**: All code templates are extracted from official core plugins (e.g., `plugin-s3`).

---

## 🚀 Quick Start (Chat-Driven)

### 1. Initialize & Launch
```bash
hps init my-awesome-plugin
```
*HPS configures `.cursorrules` or `HPS.md` with the new strict rules automatically.*

### 2. "I want a feature..."
In your AI Chat (Cursor/Gemini), simply say:
> **"I want to build a Article Reward feature."**

### 3. AI Architect Mode (Draft)
The AI automatically runs `hps new` and **drafts a professional spec** following the new Topic-based standards.

### 4. AI Developer Mode (Code)
Once approved, the AI runs `hps code` to inject **topic-specific context** (Logic, UI, Security) and generates error-free code.

---

## 📦 Installation

```bash
npm install -g @cysupper/halo-plugin-spec-kit
```

---

## 🛠 Command Reference

*   `hps init [name]`: Initialize project with V2.0 AI context.
*   `hps doctor`: Self-check & fix environment (JDK 21, pnpm 10).
*   `hps new <feat>`: (Agent) Draft a new feature specification.
*   `hps code <feat>`: (Agent) Generate code with high-density topic context.

## 📄 License

MIT © [Corps-Cy](https://github.com/Corps-Cy)