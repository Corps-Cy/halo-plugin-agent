# Halo Plugin Development: Official TodoList Template

> This is the "Gold Standard" for Halo 2.x plugins. Follow this pattern for 90% of your CRUD requirements.

## 1. Backend: Data Model ONLY
Define your model with `@GVK`. No Controller needed.

```java
@Data
@EqualsAndHashCode(callSuper = true)
@GVK(kind = "Todo", group = "todo.plugin.halo.run", version = "v1alpha1", singular = "todo", plural = "todos")
public class Todo extends AbstractExtension {
    @Schema(requiredMode = REQUIRED)
    private TodoSpec spec;

    @Data
    public static class TodoSpec {
        @Schema(requiredMode = REQUIRED, minLength = 1)
        private String title;
        private Boolean done = false;
    }
}
```

## 2. Backend: Register in Lifecycle
```java
@Component
public class TodoListPlugin extends BasePlugin {
    private final SchemeManager schemeManager;

    public TodoListPlugin(PluginContext ctx, SchemeManager sm) {
        super(ctx);
        this.schemeManager = sm;
    }

    @Override
    public void start() {
        schemeManager.register(Todo.class); // This generates all APIs automatically
    }
}
```

## 3. Frontend: API Interaction
The auto-generated endpoint is: `/apis/todo.plugin.halo.run/v1alpha1/todos`

### Create Item
```ts
http.post("/apis/todo.plugin.halo.run/v1alpha1/todos", {
    metadata: { generateName: "todo-" }, // Server will generate unique name
    spec: { title: "New Task", done: false },
    kind: "Todo",
    apiVersion: "todo.plugin.halo.run/v1alpha1"
});
```

### Fetch Items (Paginated)
```ts
const res = await http.get("/apis/todo.plugin.halo.run/v1alpha1/todos");
// Result: { items: [], total: 0, ... }
```

## 4. Key Takeaways for AI
*   **Don't reinvent the wheel**: Check if `@GVK` auto-generated APIs are enough before writing custom Controllers.
*   **Strict GVK**: Frontend requests MUST include `kind` and `apiVersion` in the body.
*   **Metadata**: Always use the full `Metadata` interface in TypeScript.
