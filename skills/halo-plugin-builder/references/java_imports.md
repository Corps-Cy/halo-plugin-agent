# Halo 2.x Java 导包与依赖参考 (Import & Dependency Map)

> **AI 必读 (Critical)**：
> 1. 在编写 Java 代码时，**严禁** 凭直觉猜测包名。
> 2. 必须优先对照下表确认 `import` 路径。
> 3. 如果表中没有，请使用 `search_file_content` 工具在代码库中搜索现有用法。
>
> **数据来源**: 官方插件 (plugin-s3, plugin-oauth2, plugin-moments) 及 Halo 核心代码

## 1. 核心扩展模型 (Extension Model)
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `AbstractExtension` | `run.halo.app.extension.AbstractExtension` | 自定义模型基类 |
| `Extension` | `run.halo.app.extension.Extension` | 顶级接口 |
| `GVK` | `run.halo.app.extension.GVK` | 必须标注在模型类上 |
| `GroupVersionKind` | `run.halo.app.extension.GroupVersionKind` | GVK 对象 |
| `Metadata` | `run.halo.app.extension.Metadata` | 模型元数据 |
| `MetadataUtil` | `run.halo.app.extension.MetadataUtil` | 元数据工具类 |
| `Unstructured` | `run.halo.app.extension.Unstructured` | 非结构化数据 |
| `ExtensionUtil` | `run.halo.app.extension.ExtensionUtil` | 扩展工具类 |
| `ExtensionMatcher` | `run.halo.app.extension.ExtensionMatcher` | 扩展匹配器 |

## 2. 控制器与协调器 (Controller & Reconciler)
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `Reconciler` | `run.halo.app.extension.controller.Reconciler` | 核心逻辑接口 |
| `Reconciler.Request` | `run.halo.app.extension.controller.Reconciler.Request` | Reconcile 请求对象 |
| `Controller` | `run.halo.app.extension.controller.Controller` | 标记接口 |
| `ControllerBuilder` | `run.halo.app.extension.controller.ControllerBuilder` | 用于注册 Reconciler |
| `Result` | `run.halo.app.extension.controller.Result` | 返回处理结果 (Requeue/Done) |
| `DefaultController` | `run.halo.app.extension.controller.DefaultController` | 默认控制器实现 |
| `RequestQueue` | `run.halo.app.extension.controller.RequestQueue` | 请求队列 |
| `Synchronizer` | `run.halo.app.extension.controller.Synchronizer` | 同步器 |

## 3. 数据访问客户端 (Reactive Client)
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `ReactiveExtensionClient` | `run.halo.app.extension.ReactiveExtensionClient` | **唯一** 推荐的数据操作客户端 |
| `ExtensionClient` | `run.halo.app.extension.ExtensionClient` | 阻塞式客户端 (不推荐) |
| `ListOptions` | `run.halo.app.extension.ListOptions` | 列表查询参数 |
| `ListResult` | `run.halo.app.extension.ListResult` | 列表结果包装 |
| `LabelSelector` | `run.halo.app.extension.LabelSelector` | 标签选择器 |
| `Scheme` | `run.halo.app.extension.Scheme` | 扩展方案定义 |
| `SchemeManager` | `run.halo.app.extension.SchemeManager` | 扩展方案管理器 |
| `Watcher` | `run.halo.app.extension.Watcher` | 资源变更监听器 |
| `Ref` | `run.halo.app.extension.Ref` | 资源引用 |

## 4. 常用 Spring 与 WebFlux
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `Mono` / `Flux` | `reactor.core.publisher.Mono` / `Flux` | 响应式流 |
| `Schedulers` | `reactor.core.scheduler.Schedulers` | 响应式调度器 |
| `Retry` | `reactor.util.retry.Retry` | 重试策略 |
| `Component` | `org.springframework.stereotype.Component` | Spring Bean 注解 |
| `Service` | `org.springframework.stereotype.Service` | 服务层注解 |
| `Configuration` | `org.springframework.context.annotation.Configuration` | 配置类 |
| `Bean` | `org.springframework.context.annotation.Bean` | Bean 定义 |
| `Autowired` | `org.springframework.beans.factory.annotation.Autowired` | 依赖注入 (建议用构造器注入) |
| `ServerWebExchange` | `org.springframework.web.server.ServerWebExchange` | 替代 HttpServletRequest |
| `WebFilter` | `org.springframework.web.server.WebFilter` | Web 过滤器接口 |
| `WebFilterChain` | `org.springframework.web.server.WebFilterChain` | 过滤器链 |
| `ResponseStatusException` | `org.springframework.web.server.ResponseStatusException` | HTTP 异常 |
| `HttpStatus` | `org.springframework.http.HttpStatus` | HTTP 状态码 |
| `MediaType` | `org.springframework.http.MediaType` | 媒体类型 |
| `MediaTypeFactory` | `org.springframework.http.MediaTypeFactory` | 媒体类型工厂 |

## 5. 常用扩展点 (Extension Points)
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `AdditionalWebFilter` | `run.halo.app.security.AdditionalWebFilter` | 注册 Web 过滤器 |
| `AttachmentHandler` | `run.halo.app.core.extension.endpoint.AttachmentHandler` | 附件上传处理 |
| `CustomEndpoint` | `run.halo.app.core.extension.endpoint.CustomEndpoint` | 自定义 API 端点 |
| `Finder` | `run.halo.app.theme.finders.Finder` | 主题 Finder 接口 |
| `ReactivePostContentHandler` | `run.halo.app.content.ReactivePostContentHandler` | 文章内容预处理 |
| `PostContentHandler` | `run.halo.app.content.PostContentHandler` | 文章内容处理器 |
| `PostContentContext` | `run.halo.app.content.PostContentContext` | 文章内容上下文 |
| `TemplateHeadProcessor` | `run.halo.app.theme.renderer.TemplateHeadProcessor` | 注入 Head 内容 |
| `TemplateFooterProcessor` | `run.halo.app.theme.renderer.TemplateFooterProcessor` | 注入 Footer 内容 |
| `ExtensionGetter` | `run.halo.app.plugin.extensionpoint.ExtensionGetter` | 扩展点获取器 |

## 6. 工具与注解
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `Schema` | `io.swagger.v3.oas.annotations.media.Schema` | OpenAPI 字段描述 |
| `Assert` | `org.springframework.util.Assert` | 断言工具 |
| `StringUtils` | `org.apache.commons.lang3.StringUtils` | 字符串工具 |
| `Slf4j` | `lombok.extern.slf4j.Slf4j` | 日志注解 |
| `Data` | `lombok.Data` | Lombok 数据类 |
| `Builder` | `lombok.Builder` | Lombok 构建器 |
| `RequiredArgsConstructor` | `lombok.RequiredArgsConstructor` | Lombok 构造器注入 |
| `NonNull` | `lombok.NonNull` | 非空参数 |
| `Valid` | `jakarta.validation.Valid` | JSR-303 验证 |

## 7. 路由与 API (Router & API)
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `RouterFunction` | `org.springframework.web.reactive.function.server.RouterFunction` | 函数式路由 |
| `HandlerFunction` | `org.springframework.web.reactive.function.server.HandlerFunction` | 处理函数 |
| `ServerRequest` | `org.springframework.web.reactive.function.server.ServerRequest` | 服务端请求 |
| `ServerResponse` | `org.springframework.web.reactive.function.server.ServerResponse` | 服务端响应 |
| `RequestPredicates` | `org.springframework.web.reactive.function.server.RequestPredicates` | 请求谓词 |
| `RouterFunctions` | `org.springframework.web.reactive.function.server.RouterFunctions` | 路由工具 |
| `WebClient` | `org.springframework.web.reactive.function.client.WebClient` | 响应式 HTTP 客户端 |
| `IListRequest` | `run.halo.app.extension.router.IListRequest` | 列表请求接口 |
| `SortableRequest` | `run.halo.app.extension.router.SortableRequest` | 可排序请求 |
| `FieldSelector` | `run.halo.app.extension.router.selector.FieldSelector` | 字段选择器 |
| `QueryParamBuildUtil` | `run.halo.app.extension.router.QueryParamBuildUtil` | 查询参数构建 |

## 8. 索引与查询 (Index & Query)
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `IndexSpec` | `run.halo.app.extension.index.IndexSpec` | 索引规范 |
| `QueryFactory` | `run.halo.app.extension.index.query.QueryFactory` | 查询工厂 |
| `IndexedQueryEngine` | `run.halo.app.extension.index.IndexedQueryEngine` | 索引查询引擎 |
| `IndexSpecs` | `run.halo.app.extension.index.IndexSpecs` | 索引规范工具 |
| `IndexAttributeFactory` | `run.halo.app.extension.index.IndexAttributeFactory` | 索引属性工厂 |

## 9. 通知系统 (Notification)
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `NotificationCenter` | `run.halo.app.notification.NotificationCenter` | 通知中心 |
| `NotificationReasonEmitter` | `run.halo.app.notification.NotificationReasonEmitter` | 通知原因发送器 |
| `UserIdentity` | `run.halo.app.notification.UserIdentity` | 用户身份 |
| `Reason` | `run.halo.app.core.extension.notification.Reason` | 通知原因 |
| `Subscription` | `run.halo.app.core.extension.notification.Subscription` | 订阅 |

## 10. 搜索集成 (Search)
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `HaloDocument` | `run.halo.app.search.HaloDocument` | Halo 搜索文档 |
| `HaloDocumentsProvider` | `run.halo.app.search.HaloDocumentsProvider` | 文档提供者接口 |
| `HaloDocumentAddRequestEvent` | `run.halo.app.search.event.HaloDocumentAddRequestEvent` | 添加文档事件 |
| `HaloDocumentDeleteRequestEvent` | `run.halo.app.search.event.HaloDocumentDeleteRequestEvent` | 删除文档事件 |

## 11. RSS/Feed 集成
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `RSS2` | `run.halo.feed.RSS2` | RSS 2.0 支持 |
| `RssRouteItem` | `run.halo.feed.RssRouteItem` | RSS 路由项 |
| `RssCacheClearRequested` | `run.halo.feed.RssCacheClearRequested` | RSS 缓存清理事件 |
| `CacheClearRule` | `run.halo.feed.CacheClearRule` | 缓存清理规则 |

## 12. OAuth2 认证 (可选)
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `OAuth2AuthorizedClient` | `org.springframework.security.oauth2.client.OAuth2AuthorizedClient` | OAuth2 授权客户端 |
| `ReactiveOAuth2AuthorizedClientService` | `org.springframework.security.oauth2.client.ReactiveOAuth2AuthorizedClientService` | 响应式授权服务 |
| `ReactiveClientRegistrationRepository` | `org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository` | 客户端注册仓库 |
| `ClientRegistration` | `org.springframework.security.oauth2.client.registration.ClientRegistration` | 客户端注册信息 |
| `OAuth2User` | `org.springframework.security.oauth2.core.user.OAuth2User` | OAuth2 用户 |
| `OAuth2LoginReactiveAuthenticationManager` | `org.springframework.security.oauth2.client.authentication.OAuth2LoginReactiveAuthenticationManager` | OAuth2 登录管理器 |

## 13. SpringDoc API 文档
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `SpringdocRouteBuilder` | `org.springdoc.webflux.core.fn.SpringdocRouteBuilder` | SpringDoc 路由构建器 |
| `operation.Builder` | `org.springdoc.core.fn.builders.operation.Builder` | 操作构建器 |
| `schema.Builder` | `org.springdoc.core.fn.builders.schema.Builder` | Schema 构建器 |
| `parameter.Builder` | `org.springdoc.core.fn.builders.parameter.Builder` | 参数构建器 |

## 14. 主题与模板 (Theme)
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `PageUrlUtils` | `run.halo.app.theme.router.PageUrlUtils` | 分页 URL 工具 |
| `UrlContextListResult` | `run.halo.app.theme.router.UrlContextListResult` | URL 上下文列表结果 |
| `ExternalLinkProcessor` | `run.halo.app.infra.ExternalLinkProcessor` | 外链处理器 |

## 15. 数据持久化 (Data Persistence)
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `PageRequest` | `run.halo.app.extension.PageRequest` | 分页请求 |
| `PageRequestImpl` | `run.halo.app.extension.PageRequestImpl` | 分页请求实现 |
| `Sort` | `org.springframework.data.domain.Sort` | 排序 |
| `OptimisticLockingFailureException` | `org.springframework.dao.OptimisticLockingFailureException` | 乐观锁异常 |

## 16. 安全相关 (Security)
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `Authentication` | `org.springframework.security.core.Authentication` | 认证对象 |
| `ReactiveSecurityContextHolder` | `org.springframework.security.core.context.ReactiveSecurityContextHolder` | 响应式安全上下文 |
| `SecurityContext` | `org.springframework.security.core.context.SecurityContext` | 安全上下文 |
| `GrantedAuthority` | `org.springframework.security.core.GrantedAuthority` | 权限接口 |
| `ServerSecurityContextRepository` | `org.springframework.security.web.server.context.ServerSecurityContextRepository` | 服务端安全上下文仓库 |
| `ServerWebExchangeMatcher` | `org.springframework.security.web.server.util.matcher.ServerWebExchangeMatcher` | 请求匹配器 |

## 17. 事件系统 (Events)
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `ApplicationEvent` | `org.springframework.context.ApplicationEvent` | 应用事件基类 |
| `ApplicationListener` | `org.springframework.context.ApplicationListener` | 事件监听器 |
| `ApplicationEventPublisher` | `org.springframework.context.ApplicationEventPublisher` | 事件发布器 |
| `EventListener` | `org.springframework.context.event.EventListener` | 事件监听注解 |

## 18. 附件管理 (Attachment)
| 类名 (Class) | 完整包名 (Full Package Path) | 说明 |
| :--- | :--- | :--- |
| `Attachment` | `run.halo.app.core.extension.attachment.Attachment` | 附件扩展 |
| `AttachmentSpec` | `run.halo.app.core.extension.attachment.Attachment.AttachmentSpec` | 附件规格 |
| `AttachmentStatus` | `run.halo.app.core.extension.attachment.Attachment.AttachmentStatus` | 附件状态 |
| `Policy` | `run.halo.app.core.extension.attachment.Policy` | 存储策略 |
| `Group` | `run.halo.app.core.extension.attachment.Group` | 附件分组 |
| `Thumbnail` | `run.halo.app.core.extension.attachment.Thumbnail` | 缩略图 |
| `ThumbnailSize` | `run.halo.app.core.attachment.ThumbnailSize` | 缩略图尺寸 |
| `AttachmentService` | `run.halo.app.core.extension.service.AttachmentService` | 附件服务 |
