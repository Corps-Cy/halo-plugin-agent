# Halo 2.x 插件开发 AI 编码规范 (Master Spec)

> **版本**: V1.0  
> **适用对象**: AI 助手、插件开发者  
> **核心原则**: 声明式 (Declarative)、全异步 (Reactive)、资源导向 (Resource-Oriented)

## 1. 核心架构约束 (Architectural Constraints)

### 1.1 设计哲学
*   **资源协调模式**: 严禁使用传统的命令式 MVC (Controller -> Service -> DAO)。业务逻辑必须抽象为 **Extension (自定义模型)**，并通过 **Reconciler (协调器)** 监听资源状态变化来执行逻辑。
*   **全异步非阻塞**: 后端必须 100% 采用 **Project Reactor (Mono/Flux)**。严禁使用 `Thread.sleep`、`block()` 或同步的 JDBC/IO 操作。
*   **状态最终一致性**: 业务逻辑应实现在协调循环中，确保系统“实际状态”趋向于 `Spec` 定义的“期望状态”。通过 `Status` 反馈处理结果。
*   **前后端解耦**: 后端负责数据治理，前端通过 `@halo-dev/ui-shared` 和 `@halo-dev/api-client` 以“插件化”方式注入 UI。

### 1.2 关键技术栈
*   **语言**: Java 17+ (后端), TypeScript (前端)
*   **框架**: Spring Boot 3 (WebFlux), Vue 3 (Composition API)
*   **构建**: Gradle (Kotlin DSL), Vite / Rsbuild
*   **包管理**: pnpm 10+

---

## 2. 后端开发规范 (Backend Standards)

> ⚠️ **IMPORTS CHECK (导包强制检查)**
> 在编写 Java 代码之前，**必须** 查阅 `02_java_import_reference.md` 获取正确的包路径。
> **严禁** 臆造包名（如 `com.halo.core...` 都是错误的），必须使用 `run.halo.app...` 开头的标准路径。

### 2.1 资源定义 (Extension)
所有业务实体必须定义为 Extension。

*   **基类**: 必须继承 `run.halo.app.extension.AbstractExtension`。
*   **注解**: 必须使用 `@GVK` 注解。
    *   `group`: 小写反向域名 (e.g., `plugin.todo.halo.run`)。
    *   `version`: API 版本 (e.g., `v1alpha1`)。
    *   `kind`: 大驼峰类名 (e.g., `Todo`)。
*   **内部结构**:
    *   `Spec` (静态内部类): 定义用户可配置的字段。
    *   `Status` (静态内部类): 定义系统反馈的状态字段。
*   **元数据校验**: 字段必须使用 `@Schema` (OpenAPI v3) 标注描述和校验逻辑（如 `requiredMode`, `maxLength`, `min`）。

**代码模板**:
```java
@Data
@GVK(group = "plugin.example.halo.run", version = "v1alpha1", kind = "MyResource", plural = "myresources", singular = "myresource")
public class MyResource extends AbstractExtension {
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private Spec spec;
    private Status status;

    @Data
    public static class Spec {
        @Schema(description = "名称", maxLength = 50)
        private String name;
    }

    @Data
    public static class Status {
        private String phase;
    }
}
```

### 2.2 协调器逻辑 (Reconciler)
业务逻辑的核心载体。

*   **接口**: 必须实现 `Reconciler` 和 `Controller` 接口，并标注 `@Component`。
*   **注册**: 在 `setupWith(ControllerBuilder builder)` 中注册监听的 Extension。
*   **幂等性**: `reconcile` 方法必须支持多次重复执行而结果一致。
*   **异常处理**: 不要吞掉异常，应返回 `Result.requeue(duration)` 进行指数级重试。
*   **生命周期安全**: 删除前的清理逻辑（如删除关联文件）**必须**通过 `Finalizers` 机制实现。
*   **状态更新**: 更新反馈时必须调用 `client.updateStatus(object)`，严禁使用 `update` 修改 Status。

### 2.3 数据访问 (ExtensionClient)
*   **客户端**: 统一使用 `ReactiveExtensionClient`。
*   **查询**: 使用 `ListOptions` 配合 `LabelSelector` 和 `FieldSelector` (QueryFactory) 进行筛选。
*   **禁止**: 严禁绕过 Client 直接操作数据库。

### 2.4 配置与扩展
*   **配置读取**: 优先使用 `ReactiveSettingFetcher` 配合 Java Record 模型（必须带 `GROUP` 常量）。
*   **系统通知**: 定义 `ReasonType` 资源，通过 `NotificationReasonEmitter` 发送通知。
*   **扩展点注入**: 实现系统接口（如 `AttachmentHandler`）后，必须在 `src/main/resources/extensions` 下提供 `ExtensionDefinition` YAML 声明。

---

## 3. 前端开发规范 (Frontend Standards)

### 3.1 核心原则
*   **入口**: `ui/src/index.ts` 必须使用 `definePlugin` 导出。
*   **打包约束**: 核心依赖（`vue`, `pinia`, `vue-router`, `@halo-dev/ui-shared`, `@halo-dev/components`）必须配置为 **external**，严禁重复打包。

### 3.2 UI 注入模式
*   **优先扩展点**: 除非是独立大模块，否则必须优先通过 `extensionPoints` 注入 UI。
    *   `editor:sidebar:pushed`: 编辑器侧边栏
    *   `dashboard:widget:pushed`: 仪表盘挂件
    *   `post:list-item:operation:create`: 文章列表操作
    *   `plugin:self:tabs:create`: 插件详情页配置 Tab
*   **路由规范**: 所有自定义页面路由必须设置 `parentName: "Root"` 以嵌入 Halo 主框架。

### 3.3 组件复用与风格
*   **基础 UI**: 必须使用 `@halo-dev/components` (如 `VButton`, `VModal`, `VCard`)。
*   **业务组件**: 必须复用系统全局组件：
    *   `AttachmentSelectorModal`: 附件选择
    *   `UppyUpload`: 文件上传
    *   `AnnotationsForm`: 元数据编辑
    *   `FilterDropdown`: 列表筛选
*   **权限指令**: 使用 `v-permission` 指令或 `HasPermission` 组件进行元素级显隐控制。

### 3.4 通信与状态
*   **API 调用**: 使用 `coreApiClient.extension` 操作资源，使用 `axiosInstance` 调用自定义 REST API。
*   **状态共享**: 通过 `@halo-dev/ui-shared` 的 `stores` (如 `currentUser`, `globalInfo`) 获取共享状态。

---

## 4. 权限与安全 (Security & RBAC)

### 4.1 角色模板 (Role Template)
*   必须在 `src/main/resources/extensions` 下定义带有 `halo.run/role-template: "true"` 标签的 `Role` 资源。
*   **命名**: 建议格式 `plugin-{name}-role-{scope}`。

### 4.2 权限规则 (Rules)
*   **精准动词**: 严禁滥用 `*`。必须明确指定 `get`, `list`, `create`, `update`, `delete`, `watch`。
*   **API 组**: `apiGroups` 必须与 Extension 的 `@GVK` group 一致。

### 4.3 UI 权限映射
*   在 `Role` 的 `annotations` 中使用 `rbac.authorization.halo.run/ui-permissions` 声明前端权限标识符。
*   前端标识符格式建议：`plugin:{plugin-name}:{resource}:{action}`。

---

## 5. 项目工程结构 (Standard Layout)

```text
├── build.gradle.kts          // 必须引入 run.halo.plugin 插件
├── settings.gradle.kts
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com/example/plugin
│   │   │       ├── StarterPlugin.java    // 插件入口 (必须继承 BasePlugin)
│   │   │       ├── extension             // GVK 资源定义
│   │   │       ├── controller            // Reconciler 协调器
│   │   │       └── service               // 纯业务逻辑
│   │   └── resources
│   │       ├── plugin.yaml               // 核心元数据 (requires, settingName)
│   │       ├── extensions                // Role, Definition, Notifier 等 YAML
│   │       └── templates                 // Finder 专用模板
│   └── test                              // 单元测试
└── ui                                    // 前端工程
    ├── src
    │   ├── index.ts                      // definePlugin 入口
    │   └── views                         // 页面组件
    ├── package.json
    └── vite.config.ts                    // 必须配置 external
```

---

## 6. 禁止事项 (Anti-Patterns / Forbidden)

*   ❌ **禁止** 在 `Reconciler` 或 WebFlux 线程池中执行长时间的同步 I/O 或调用 `block()`。
*   ❌ **禁止** 手动操作 Session 或 Cookie（应使用安全框架或 `LoginHandlerEnhancer`）。
*   ❌ **禁止** 硬编码静态资源路径（应使用 `ReverseProxy` 扩展点）。
*   ❌ **禁止** 在 `plugin.yaml` 中不写 `spec.requires` 版本约束（会导致兼容性灾难）。
*   ❌ **禁止** 绕过权限系统直接暴露无保护的自定义 API 路径（所有 Controller 必须受 RBAC 保护）。
*   ❌ **禁止** 在前端手动引入和打包 `vue` 等基础库（会导致体积膨胀和运行时冲突）。
