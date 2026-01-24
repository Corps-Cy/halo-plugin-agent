# Backend Development Guide

## Technology Stack
- **Language**: Java 17+
- **Framework**: Spring Boot 3
- **Reactive Stack**: Spring WebFlux (Project Reactor)
- **Database**: R2DBC (Reactive Relational Database Connectivity)

## 1. Defining Extensions (Custom Resources)

Use the `@GVK` annotation to define the API Group, Version, and Kind.

```java
@Data
@GVK(group = "plugin.halo.run", version = "v1alpha1", kind = "MyResource", plural = "myresources", singular = "myresource")
public class MyResource extends AbstractExtension {
    private Spec spec;
    private Status status;

    @Data
    public static class Spec {
        private String configValue;
    }

    @Data
    public static class Status {
        private String phase;
    }
}
```

## 2. Implementing Reconcilers

Reconcilers must implement `Reconciler<Reconciler.Request>` and be registered via `ControllerBuilder`.

### Key Rules:
1.  **Idempotency**: The `reconcile` method may be called multiple times. Ensure logic is safe to repeat.
2.  **Non-Blocking**: NEVER use `Thread.sleep` or blocking JDBC calls. Use `Mono` and `Flux`.
3.  **Client Usage**: Use `ReactiveExtensionClient` for all DB operations.

### Example Reconciler:

```java
@Component
public class MyReconciler implements Reconciler<Reconciler.Request> {
    private final ReactiveExtensionClient client;

    public MyReconciler(ReactiveExtensionClient client) {
        this.client = client;
    }

    @Override
    public Mono<Result> reconcile(Request request) {
        return client.fetch(MyResource.class, request.name())
            .flatMap(resource -> {
                // Business Logic Here
                return Mono.just(Result.doNotRetry());
            });
    }

    @Override
    public Controller setupWith(ControllerBuilder builder) {
        return builder.extension(MyResource.class).build();
    }
}
```

## 3. Reactive Programming Cheatsheet

| Operation | Blocking (Forbidden) | Reactive (Allowed) |
| :--- | :--- | :--- |
| Return a value | `return obj;` | `return Mono.just(obj);` |
| Process list | `for (x : list) { ... }` | `Flux.fromIterable(list).map(...)` |
| DB Query | `repo.findById(id)` | `client.fetch(Class, name)` |
| Sleep | `Thread.sleep(1000)` | `Mono.delay(Duration.ofMillis(1000))` |
