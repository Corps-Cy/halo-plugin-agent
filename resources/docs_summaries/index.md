# Halo 2.x 开发者知识库索引 (V2 - Topic Based)

> 本知识库基于官方文档与源码分析整理，采用“主题式”结构存储。

## 核心主题 (Core Topics)

### 1. 环境与架构
- [CORE_Environment.md](CORE_Environment.md): 环境要求 (JDK 21, pnpm)、目录结构、关键文件说明。
- [CORE_Backend_Architecture.md](CORE_Backend_Architecture.md): Manifest 配置、生命周期、自定义模型 (Extension) 定义。

### 2. 核心逻辑实现
- [CORE_Backend_Logic.md](CORE_Backend_Logic.md): Reconciler 控制器模式、**高级 Reactive 编程技巧** (Mono.using, Schedulers)、ExtensionClient、SettingFetcher。
- [CORE_Backend_ExtensionPoints.md](CORE_Backend_ExtensionPoints.md): **服务端扩展点速查** (Filter, TemplateProcessor, PostContent)。
- [CORE_Backend_Common_Utils.md](CORE_Backend_Common_Utils.md): Ref 类、Metadata 构造、OwnerReference (自动级联删除)。
- [CORE_Frontend_UI.md](CORE_Frontend_UI.md): UI 入口 (definePlugin)、路由菜单、API Client 封装、全局状态。
- [CORE_Frontend_Components.md](CORE_Frontend_Components.md): Halo 预置组件 (UppyUpload, SearchInput, etc.) 与指令。
- [CORE_Frontend_ExtensionPoints.md](CORE_Frontend_ExtensionPoints.md): **UI 注入全解** (编辑器扩展、列表按钮、详情页 Tab、评论引用)。

### 3. 安全与权限
- [CORE_Security.md](CORE_Security.md): RBAC 模型、RoleTemplate 定义 (YAML)、UI 权限控制。

## 实战案例 (Best Practices)
- [CORE_Example_TodoList.md](CORE_Example_TodoList.md): **官方标准开发范式** (零 Controller、自动 API、前端 Axios 规范)。

---
*提示: 遇到代码生成问题时，请优先参考 Logic 和 Security 两个核心主题。*