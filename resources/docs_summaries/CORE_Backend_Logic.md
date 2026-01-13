# Halo Plugin Development: Backend Logic (Reconciler & Client)

## 1. The Reconciler Pattern
> ⚠️ **CRITICAL (Halo 2.22.0+)**: The `Reconciler` interface is **Synchronous**. 
> Do NOT use `Mono<Result>` as the return type.

### Standard Template (Synchronous)
```java
import run.halo.app.extension.controller.Reconciler;
import run.halo.app.extension.controller.Result;
import run.halo.app.extension.controller.Request;
import run.halo.app.extension.ExtensionClient; // Use standard client for sync calls

@Component
@RequiredArgsConstructor
public class MyTaskReconciler implements Reconciler<Request>, Controller {
    
    private final ExtensionClient client;

    @Override
    public void setupWith(ControllerBuilder builder) {
        // Pass an INSTANCE of the model, not .class
        builder.extension(new MyTask());
    }

    @Override
    public Result reconcile(Request request) {
        // 1. Fetch data synchronously
        var task = client.fetch(MyTask.class, request.getName())
                         .orElse(null);
        
        if (task == null) return Result.none();

        // 2. Business Logic
        // In this thread (Worker pool), blocking IO is allowed.
        // If using Reactive WebClient, use .block() to wait for results.
        
        return Result.none();
    }
}
```

## 2. Interacting with Data (ExtensionClient)
Halo 2.22.0 provides two clients. In a Reconciler, use the **Synchronous** one.

*   **`ExtensionClient`**: Returns `Optional<E>` or `List<E>`. Recommended for Reconcilers.
*   **`ReactiveExtensionClient`**: Returns `Mono<E>` or `Flux<E>`. Recommended for Web Controllers.

### Sync Fetch Example
```java
Post post = client.fetch(Post.class, "my-post").orElseThrow();
```

## 3. Best Practices
*   **Blocking Allowed**: Since Reconcilers run in a dedicated worker pool, you can use `.block()` on Mono/Flux or call synchronous APIs without crashing the system.
*   **Prototype Injection**: Always use `builder.extension(new MyModel())` in `setupWith`.