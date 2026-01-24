# Halo 2.x Backend Development Deep Dive

> **Core Stack**: Java 17+, Spring Boot 3, Project Reactor (Mono/Flux), R2DBC.
> **Golden Rule**: NEVER BLOCK.

## 1. Defining Extensions (Custom Resources)

Extensions are the database tables of Halo plugins.

```java
@Data
@EqualsAndHashCode(callSuper = true)
@GVK(group = "plugin.example.com", version = "v1alpha1", kind = "Todo", plural = "todos", singular = "todo")
public class Todo extends AbstractExtension {
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private Spec spec;

    private Status status;

    @Data
    public static class Spec {
        @Schema(minLength = 1)
        private String content;
        private Boolean completed = false;
    }

    @Data
    public static class Status {
        private String phase;
    }
}
```

**Registration**:
In your plugin's `start()` method:
```java
@Override
public void start() {
    // Register the class so Halo creates the DB table
    schemeManager.register(Todo.class);
}
```

---

## 2. ReactiveExtensionClient (The DB Client)

Use `ReactiveExtensionClient` for all data operations.

### Basic CRUD
```java
@Autowired
private ReactiveExtensionClient client;

public Mono<Todo> createTodo(String name, String content) {
    Todo todo = new Todo();
    todo.setMetadata(new Metadata());
    todo.getMetadata().setName(name);
    
    Todo.Spec spec = new Todo.Spec();
    spec.setContent(content);
    todo.setSpec(spec);

    return client.create(todo);
}
```

### Advanced Query (ListOptions)
```java
import run.halo.app.extension.ListOptions;

public Flux<Todo> findCompletedTodos() {
    ListOptions options = ListOptions.builder()
        .labelSelector().eq("completed", "true").end() // Requires label on metadata
        .build();

    return client.listAll(Todo.class, options);
}
```

---

## 3. Reconciler (The Logic)

Reconcilers sync state. They must implement `Reconciler<Request>`.

### Error Handling & Retry Pattern
```java
@Component
public class TodoReconciler implements Reconciler<Reconciler.Request> {

    private final ReactiveExtensionClient client;

    @Override
    public Mono<Result> reconcile(Request request) {
        return client.fetch(Todo.class, request.name())
            .flatMap(todo -> {
                // Business Logic
                if (todo.getSpec().getCompleted()) {
                    return handleCompletion(todo);
                }
                return Mono.just(todo);
            })
            // Success: Stop retrying
            .thenReturn(Result.doNotRetry())
            // Error: Log and Retry later
            .onErrorResume(e -> {
                log.error("Failed to reconcile Todo: {}", request.name(), e);
                return Mono.just(Result.requeue(Duration.ofSeconds(10)));
            });
    }
}
```

### Updating Status
Only update status if it changed, to avoid infinite loops.
```java
todo.getStatus().setPhase("COMPLETED");
return client.update(todo);
```
