# Halo 插件开发准备 (Plugin Preparation)

## 1. 核心技能要求 (Prerequisites)
在开始开发 Halo 插件之前，你需要具备以下基础技能，这将直接决定你能否顺利完成开发：

### 后端 (Backend)
*   **语言**: Java 17+ (Halo 2.x 基于 Java 17)。
*   **框架**: 熟练掌握 **Spring Boot** 开发，理解依赖注入、自动配置等核心概念。
*   **架构**: 必须阅读并理解 Halo 的扩展机制 (Extension) 和调和机制 (Reconciler)。

### 前端 (Frontend)
*   **基础**: 熟悉 HTML, CSS, JavaScript。
*   **框架**: 必须掌握 **Vue 3** (Composition API) 和 **TypeScript**。Halo 的控制台 (Console) 插件开发深度依赖这两者。
*   **构建工具**: 了解 Vite 或 Rsbuild 的基本配置。

## 2. 软件环境要求 (Software Requirements)
这些是开发环境必须安装的基础设施，请确保版本符合要求：

### 基础环境
1.  **JDK**: **Java 17** 或更高版本 (必须)。这是 Halo 后端运行的基石。
2.  **Node.js**: **Version 18 LTS** 或更高版本 (推荐 20 LTS)。用于前端构建和脚手架工具。
3.  **Git**: 用于版本控制和插件发布。
4.  **pnpm**: **Version 8+**。Halo 及其插件生态强制使用 pnpm 进行包管理 (Monorepo 支持更好)。

### 容器化环境 (强力推荐)
*   **Docker**: 强烈建议安装 Docker Desktop 或 Docker Engine。
    *   **原因**: Halo 提供了 `halo-gradle-plugin`，其中的 `haloServer` 任务依赖 Docker 来快速启动一个包含当前插件的 Halo 实例，无需手动下载和配置 Halo 源码。

### IDE 推荐
*   **IntelliJ IDEA** (推荐): 对 Java 和 Spring Boot 支持最好，同时对前端 Vue/TS 也有很好的支持。
*   **VS Code**: 前端开发体验极佳，但开发 Java 后端时配置稍繁琐。

## 3. 与 Halo 源码环境的关系
如果你需要深入调试 Halo 核心代码 (即 `02_run.md` 中提到的运行 Halo 源码)，你的环境必须同时满足编译 Halo 源码的要求。但对于大多数**纯插件开发**场景，只需满足上述要求并通过 Docker 运行 Halo 即可。