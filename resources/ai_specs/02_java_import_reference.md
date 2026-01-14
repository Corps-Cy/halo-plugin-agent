# Halo 2.x Java 导包与依赖参考 (Import & Dependency Map)

> **AI 必读 (Critical)**：
> 1. 在编写 Java 代码时，**严禁** 凭直觉猜测包名。
> 2. 必须优先对照下表确认 `import` 路径。
> 3. 如果表中没有，请使用 `search_file_content` 工具在代码库中搜索现有用法。

## 1. 核心扩展模型 (Extension Model)
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `AbstractExtension` | `run.halo.app.extension.AbstractExtension` | 自定义模型基类 |
| `Extension` | `run.halo.app.extension.Extension` | 顶级接口 |
| `GVK` | `run.halo.app.extension.GVK` | 必须标注在模型类上 |
| `Metadata` | `run.halo.app.extension.Metadata` | 模型元数据 |
| `Condition` | `run.halo.app.extension.Condition` | 查询条件接口 |

## 2. 控制器与协调器 (Controller & Reconciler)
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `Reconciler` | `run.halo.app.extension.controller.Reconciler` | 核心逻辑接口 |
| `Controller` | `run.halo.app.extension.controller.Controller` | 标记接口 |
| `Result` | `run.halo.app.extension.controller.Result` | 返回处理结果 (Requeue/Done) |
| `ControllerBuilder` | `run.halo.app.extension.controller.ControllerBuilder` | 用于注册 Reconciler |

## 3. 数据访问客户端 (Reactive Client)
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `ReactiveExtensionClient` | `run.halo.app.extension.ReactiveExtensionClient` | **唯一** 推荐的数据操作客户端 |
| `ListOptions` | `run.halo.app.extension.ListOptions` | 列表查询参数 |
| `LabelSelector` | `run.halo.app.extension.LabelSelector` | 标签选择器 |
| `GroupVersionKind` | `run.halo.app.extension.GroupVersionKind` | GVK 对象 |

## 4. 常用 Spring 与 WebFlux
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `Mono` / `Flux` | `reactor.core.publisher.Mono` / `Flux` | 响应式流 |
| `Component` | `org.springframework.stereotype.Component` | Spring Bean 注解 |
| `Autowired` | `org.springframework.beans.factory.annotation.Autowired` | 依赖注入 (建议用构造器注入) |
| `ServerWebExchange` | `org.springframework.web.server.ServerWebExchange` | 替代 HttpServletRequest |
| `WebFilterChain` | `org.springframework.web.server.WebFilterChain` | 过滤器链 |

## 5. 常用扩展点 (Extension Points)
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `AdditionalWebFilter` | `run.halo.app.extensions.registry.AdditionalWebFilter` | 注册 Web 过滤器 |
| `TemplateHeadProcessor` | `run.halo.app.theme.renderer.TemplateHeadProcessor` | 注入 Head 内容 |
| `TemplateFooterProcessor` | `run.halo.app.theme.renderer.TemplateFooterProcessor` | 注入 Footer 内容 |
| `ReactivePostContentHandler` | `run.halo.app.content.ReactivePostContentHandler` | 文章内容预处理 |
| `PostContentContext` | `run.halo.app.content.PostContentContext` | 文章内容上下文 |
| `AttachmentHandler` | `run.halo.app.extension.endpoint.AttachmentHandler` | 附件上传处理 |

## 6. 工具与注解
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `Schema` | `io.swagger.v3.oas.annotations.media.Schema` | OpenAPI 字段描述 |
| `Assert` | `org.springframework.util.Assert` | 断言工具 |
| `StringUtils` | `org.apache.commons.lang3.StringUtils` | (按需使用，优先用 JDK) |
