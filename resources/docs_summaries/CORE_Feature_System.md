# Halo Plugin Development: System Integration

## 1. Attachment Storage (AttachmentHandler)
> Implement custom file storage (e.g., S3, OSS).

### Core Concept
Unlike Data Models (which use CRD/YAML), System Extensions often use **PF4J** for discovery.

### Implementation
```java
import org.pf4j.Extension; // ⚠️ Critical: PF4J Annotation
import run.halo.app.core.extension.attachment.endpoint.AttachmentHandler;
import reactor.core.publisher.Mono;

@Extension
public class MyStorage implements AttachmentHandler {
    @Override
    public Mono<Attachment> upload(UploadContext context) {
        // Use Schedulers.boundedElastic() for blocking SDKs
        return Mono.fromCallable(() -> s3Client.putObject(...))
                   .subscribeOn(Schedulers.boundedElastic())
                   .map(resp -> ...);
    }

    @Override
    public Mono<Attachment> delete(DeleteContext context) {
        return Mono.empty();
    }
}
```

## 2. Notification System
> Send events to users.

### Step 1: Define ReasonType (YAML)
`src/main/resources/extensions/reason.yaml`
```yaml
apiVersion: notification.halo.run/v1alpha1
kind: ReasonType
metadata:
  name: demo-event
spec:
  displayName: "Demo Event"
  properties:
    - name: "author"
      type: "string"
      description: "Author Name"
```

### Step 2: Emit Event (Java)
Inject `NotificationReasonEmitter`.
```java
@Autowired
private NotificationReasonEmitter emitter;

public Mono<Void> send() {
    return emitter.emit("demo-event", builder -> {
        builder.subject("New Event");
        builder.author(UserIdentity.of("admin"));
        builder.attributes(Map.of("author", "John Doe"));
    });
}
```

## 3. Extension Getter (Plugin-to-Plugin)
> Retrieve implementations of an interface from other plugins.

### Usage
Inject `ExtensionGetter` to build extensible plugins (e.g., a Search Plugin that aggregates other plugins).

```java
@Service
@RequiredArgsConstructor
public class AggregateSearchService {
    private final ExtensionGetter extensionGetter;

    public Flux<SearchResult> searchAll(String keyword) {
        // Get all beans implementing SearchProvider from ALL plugins
        return extensionGetter.getExtensions(SearchProvider.class)
            .flatMap(provider -> provider.search(keyword));
    }
}
```

## 4. Login Handler Enhancer
> For Custom Authentication Plugins (e.g., OAuth2).

### Usage
If you implement a custom `AuthenticationWebFilter`, you MUST call this to trigger Halo's post-login logic (Token issuance, etc.).

```java
@Autowired
private LoginHandlerEnhancer enhancer;

// In your custom auth success handler:
return enhancer.onLoginSuccess(exchange, authResult);
```
