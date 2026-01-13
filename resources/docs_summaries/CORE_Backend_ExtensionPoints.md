# Halo Plugin Development: Server Extension Points (Cheatsheet)

> Implement these interfaces to hook into Halo's core lifecycle and rendering process.
> **Discovery**: Most require implementing the interface as a `@Component` bean AND defining an `ExtensionDefinition` YAML (or using `@Extension` for PF4J based ones).

## 1. Request Filtering & Security

### `AdditionalWebFilter`
Global WebFlux filter.
```java
@Component
public class MyFilter implements AdditionalWebFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        // Pre-processing
        return chain.filter(exchange)
            .then(Mono.fromRunnable(() -> {
                // Post-processing
            }));
    }
}
```

### `AuthenticationWebFilter`
Custom authentication logic.
*   **Interfaces**: `FormLoginSecurityWebFilter`, `AuthenticationSecurityWebFilter`
*   **Key**: Use `LoginHandlerEnhancer` to trigger success/failure events.

## 2. Content Rendering (Theme Side)

### `TemplateHeadProcessor` / `TemplateFooterProcessor`
Inject HTML into `<head>` or `<footer>`.
```java
@Component
public class MySeoProcessor implements TemplateHeadProcessor {
    @Override
    public Mono<Void> process(ITemplateContext context, IModel model, IElementModelStructureHandler handler) {
        // Add meta tags
        return Mono.empty();
    }
}
```

### `ReactivePostContentHandler`
Modify post content before rendering (e.g., inject ads, syntax highlighting).
```java
@Component
public class MyAdProcessor implements ReactivePostContentHandler {
    @Override
    public Mono<PostContentContext> handle(PostContentContext context) {
        String newContent = context.content() + "<div>Ad</div>";
        return Mono.just(context.toBuilder().content(newContent).build());
    }
}
```

## 3. Comments & Interaction

### `CommentSubject`
Define what can be commented on (e.g., custom "Product" extension).
```java
@Component
public class ProductCommentSubject implements CommentSubject<Product> {
    @Override
    public Mono<Product> get(String name) { ... }
}
```

## 4. System Extensions (References)
*   **Storage**: See [System Integration](CORE_Feature_System.md) (`AttachmentHandler`).
*   **Notification**: See [System Integration](CORE_Feature_System.md) (`ReactiveNotifier`).
