# Troubleshooting Guide - Common Issues & Solutions

> This reference provides quick fixes for common errors encountered during Halo plugin development.

## Backend Issues

### 1. "Reconciler not getting triggered"

**Symptoms**: Extension is created, but Reconciler's `reconcile()` method never executes.

**Possible Causes & Fixes**:

#### Case 1: Controller not registered
```java
@Component
public class MyReconciler implements Reconciler<Request> {
    @Override
    public Controller setupWith(ControllerBuilder builder) {
        // ✅ CORRECT: Must return the Controller
        return builder.extension(MyExtension.class).build();
    }
}
```

#### Case 2: Extension not registered
```java
@Override
public void start() {
    // ✅ CORRECT: Must register in start() lifecycle
    schemeManager.register(MyExtension.class);
}
```

#### Case 3: Wrong Request name
```java
@Override
public Mono<Result> reconcile(Request request) {
    // ✅ CORRECT: Use request.name() not request.namespace()
    return client.fetch(MyExtension.class, request.name());
}
```

---

### 2. "Infinite reconcile loop"

**Symptoms**: Reconciler keeps running endlessly, consuming CPU.

**Root Cause**: Updating `Status` without checking if it actually changed.

**Solution**:
```java
@Override
public Mono<Result> reconcile(Request request) {
    return client.fetch(MyExtension.class, request.name())
        .flatMap(ext -> {
            String newPhase = "READY";
            
            // ❌ WRONG: Always updates
            // ext.getStatus().setPhase(newPhase);
            // return client.update(ext);
            
            // ✅ CORRECT: Only update if changed
            if (!Objects.equals(ext.getStatus().getPhase(), newPhase)) {
                ext.getStatus().setPhase(newPhase);
                return client.update(ext);
            }
            return Mono.just(ext);
        });
}
```

---

### 3. "block() called on a thread not in blockingCall pattern"

**Symptoms**: Application crashes with reactor exception.

**Root Cause**: Calling `.block()` inside a reactive chain.

**Wrong Pattern**:
```java
// ❌ WRONG
return client.fetch(MyExt.class, name)
    .flatMap(ext -> {
        // This blocks the reactive thread!
        String result = externalService.callBlocking().block(); 
        return Mono.just(result);
    });
```

**Correct Pattern**:
```java
// ✅ CORRECT: Wrap blocking call in Mono.fromCallable
return client.fetch(MyExt.class, name)
    .flatMap(ext -> {
        return Mono.fromCallable(() -> externalService.callBlocking())
            .subscribeOn(Schedulers.boundedElastic()); // Run on separate thread pool
    });
```

---

### 4. "Extension not found in database"

**Symptoms**: `client.fetch()` returns empty Mono, Extension was just created.

**Root Cause**: Database transaction not committed or race condition.

**Solution**:
```java
// ✅ Use retryWithBackoff for transient issues
return client.fetch(MyExt.class, name)
    .switchIfEmpty(Mono.defer(() -> {
        log.warn("Extension {} not found, will retry", name);
        return Mono.error(new RuntimeException("Not found"));
    }))
    .retryWhen(Retry.backoff(3, Duration.ofSeconds(1)))
    .onErrorResume(e -> {
        log.error("Failed after retries: {}", e.getMessage());
        return Mono.empty();
    });
```

---

## Frontend Issues

### 5. "Component not found: VButton"

**Symptoms**: Vue compilation error, component not recognized.

**Root Cause**: Importing component instead of using globally registered one.

**Wrong**:
```vue
<script setup lang="ts">
// ❌ WRONG: Don't import global components
import { VButton } from "@halo-dev/components";
</script>
```

**Correct**:
```vue
<script setup lang="ts">
// ✅ CORRECT: Use directly in template
</script>

<template>
  <v-button type="primary">Click me</v-button>
</template>
```

---

### 6. "API call returns 401 Unauthorized"

**Symptoms**: `apiClient.extension.customResource.list()` fails with 401.

**Root Cause**: Token not attached or expired.

**Solution**:
```typescript
// ✅ CORRECT: Use apiClient from @halo-dev/console-shared
import { apiClient } from "@halo-dev/console-shared";

// Don't use axios directly
// ❌ const response = await axios.get('/apis/plugin.halo.run/v1alpha1/todos');

// ✅ CORRECT: apiClient handles auth automatically
const { data } = await apiClient.extension.customResource.list(
  "plugin.halo.run",
  "v1alpha1",
  "todos"
);
```

---

### 7. "Route not found" or 404 on custom page

**Symptoms**: Opening `/my-plugin/page` shows 404 error.

**Root Cause**: Route not registered or `parentName` is wrong.

**Solution**:
```typescript
// In src/index.ts
export default definePlugin({
  routes: [
    {
      parentName: "Root",  // ✅ Must be "Root" for top-level routes
      route: {
        path: "/my-plugin/page",
        name: "MyPage",
        component: () => import("./views/Page.vue"),
        meta: {
          title: "My Plugin Page"
        }
      }
    }
  ]
});
```

---

## Build & Deploy Issues

### 8. "Plugin not showing in Console"

**Symptoms**: Plugin builds successfully but doesn't appear in plugin list.

**Root Cause**: `plugin.yaml` metadata is missing or incorrect.

**Solution**:
```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: Plugin
metadata:
  name: my-plugin
spec:
  displayName: My Plugin  # ✅ Required
  description: Plugin description
  version: 1.0.0
  requires: ">=2.0.0"  # ✅ Required: Halo version constraint
  author: Your Name
  logo: https://example.com/logo.png
```

---

### 9. "Permission denied" when accessing custom resource

**Symptoms**: UI shows "Access denied" even though you're admin.

**Root Cause**: Role template not defined or rules don't match Extension's GVK.

**Solution**:
```yaml
# src/main/resources/extensions/role-template.yaml
apiVersion: v1alpha1
kind: Role
metadata:
  name: plugin-my-plugin-role-default
  labels:
    halo.run/role-template: "true"
    halo.run/hidden: "false"
rules:
  - apiGroups: ["plugin.halo.run"]  # ✅ Must match Extension's @GVK group
    resources: ["todos"]  # ✅ Must match plural name
    verbs: ["get", "list", "create", "update", "delete"]
```

---

## Debugging Tips

### Enable Reactive Debugging

Add this to `application.yaml` during development:
```yaml
logging:
  level:
    run.halo.app.extension.controller: DEBUG
    reactor.core.publisher: DEBUG
```

### Check Extension Registration

Use Halo's built-in API to verify:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-halo.com/apis/plugin.halo.run/v1alpha1/todos
```

### Monitor Reconciler Events

```java
@Override
public Mono<Result> reconcile(Request request) {
    log.info("Reconciling extension: {}", request.name());
    log.debug("Current spec: {}", ext.getSpec());
    // ... logic
}
```

---

## Getting More Help

If the issue persists:
1. Check [Halo Official Docs](https://docs.halo.run)
2. Search [Halo GitHub Issues](https://github.com/halo-dev/halo/issues)
3. Join [Halo Community Discord](https://discord.gg/halo)
