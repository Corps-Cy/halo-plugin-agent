# Halo Plugin Development: Interaction & Ecosystem

> How to build plugins that work with each other.

## 1. Plugin Dependencies (plugin.yaml)
Declare dependencies to use classes/APIs from other plugins.

```yaml
spec:
  pluginDependencies:
    # Mandatory: Plugin will fail to start if missing
    plugin-a: ">=1.0.0"
    
    # Optional: Append '?'
    plugin-b?: ">=2.0.0"
```

## 2. Shared Events (Cross-Plugin)
Allows Plugin A to fire events that Plugin B can listen to.

### Step 1: Define Event (Plugin A)
MUST be annotated with `@SharedEvent`.
```java
import run.halo.app.plugin.SharedEvent;
import org.springframework.context.ApplicationEvent;

@SharedEvent
public class OrderCreatedEvent extends ApplicationEvent {
    // ...
}
```

### Step 2: Publish (Plugin A)
Use standard Spring `ApplicationEventPublisher`.

### Step 3: Listen (Plugin B)
Use `@EventListener`.
```java
@EventListener
public void onOrderCreated(OrderCreatedEvent event) {
    // Handle event
}
```

## 3. Making Your Plugin Extensible
Define an Extension Point for other plugins to implement.

### Step 1: Define Interface (Java)
Must extend `org.pf4j.ExtensionPoint`.
```java
public interface PaymentProvider extends ExtensionPoint {
    Mono<Void> pay(Order order);
}
```

### Step 2: Register Definition (YAML)
File: `src/main/resources/extensions/payment-provider.yaml`
```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: ExtensionPointDefinition
metadata:
  name: payment-provider
spec:
  className: com.example.PaymentProvider
  type: MULTI_INSTANCE # or SINGLE_INSTANCE
```

### Step 3: Load Implementations
Use `ExtensionGetter` (See [System Integration](CORE_Feature_System.md)).
