# Halo Plugin Spec Kit (HPS)

> **Halo 2.x 插件开发的 AI 原生基础设施 (V2.0)**

[![NPM Version](https://img.shields.io/npm/v/@cysupper/halo-plugin-spec-kit?color=cyan)](https://www.npmjs.com/package/@cysupper/halo-plugin-spec-kit)
![License](https://img.shields.io/badge/License-MIT-green)

[English Documentation](README.md) | [🐞 提交反馈](https://github.com/Corps-Cy/halo.plugin.spec-kit/issues)

HPS 是一个驻扎在终端里的 **"AI 产品架构师"**。V2.0 版本引入了**主题化知识图谱**与**强约束防火墙**，能彻底解决 AI 写出阻塞代码、导错包等导致死循环报错的痛点。

---

## 🌟 V2.0 重大更新

-   **🛡️ 强约束规则引擎**: 引入《严禁行为清单》(`STRICT_RULES.md`)，强制 AI 禁止使用 `.block()`、Servlet API 或手动 SQL，从源头杜绝编译错误。
-   **📚 主题化知识库**: 将原本 90+ 个碎片文件整合为 **11 个高密度核心主题文档**，AI 上下文加载速度提升 300%，逻辑连贯性大幅增强。
-   **⚙️ 完美适配 Halo 2.22+**: 针对最新架构进行了深度校准（包括同步 Reconciler 签名、Snapshot 内容存储机制、Iconify 图标系统等）。
-   **🛠️ 官方生产级范式**: 核心代码模板直接提取自官方插件（如 `plugin-s3`），确保生成的代码不仅能跑通，而且符合最佳实践。

---

## 🚀 快速开始 (对话式开发)

### 1. 初始化项目
```bash
hps init my-awesome-plugin
```
*HPS 会自动为你的 AI 工具（Cursor/Gemini 等）配置最新的强约束规则和知识库。*

### 2. “我想做一个功能...”
在 AI 聊天框中直接输入：
> **“我想做一个‘文章打赏’功能。”**

### 3. AI 架构师模式 (起草)
AI 会自动运行 `hps new`，并按照最新的主题化标准为你**起草一份专业的产品规格书**。

### 4. AI 工程师模式 (编码)
确认方案后，AI 会自动运行 `hps code`，**精准注入**（逻辑、UI、安全等）主题上下文并生成高质量代码。

---

## 🛠 手动命令参考

*   `hps init [项目名]`: 初始化项目并注入 V2.0 AI 上下文。
*   `hps doctor`: 环境自检与修复（支持 JDK 21, pnpm 10）。
*   `hps new <功能名>`: (AI 专用) 起草符合 V2.0 规范的功能规格书。
*   `hps code <功能名>`: (AI 专用) 注入高密度主题上下文生成代码。

## 📄 许可证

MIT © [Corps-Cy](https://github.com/Corps-Cy)