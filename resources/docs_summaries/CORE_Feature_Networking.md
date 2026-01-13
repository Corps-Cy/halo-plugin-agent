# Halo Plugin Development: Networking & Integration

## 1. Reverse Proxy (Static Assets)
> Expose internal static files (images, js) to the web.

### Definition (YAML)
File: `src/main/resources/extensions/reverse-proxy.yaml`
```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: ReverseProxy
metadata:
  name: plugin-demo-assets
spec:
  rules:
    - path: /assets/**          # External Path: /plugins/{name}/assets/...
      file:
        directory: static/      # Internal Path: src/main/resources/static/
```

## 2. WebSocket
> Real-time bidirectional communication.

### Implementation
Must implement `WebSocketEndpoint`.
```java
import run.halo.app.core.extension.endpoint.WebSocketEndpoint;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.stereotype.Component;

@Component
public class ChatEndpoint implements WebSocketEndpoint {
    @Override
    public String groupVersion() { return "demo.plugin.halo.run/v1alpha1"; }
    
    @Override
    public String urlPath() { return "chat"; } // URL: ws://host/apis/{groupVersion}/{urlPath}

    @Override
    public WebSocketHandler handler() {
        return session -> session.send(
            session.receive()
                .map(msg -> session.textMessage("Echo: " + msg.getPayloadAsText()))
        );
    }
}
```

## 3. RESTful API (Spring WebFlux)
> Standard Reactive Controllers.

```java
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/apis/api.plugin.demo/v1alpha1")
public class DemoController {
    @GetMapping("/hello")
    public Mono<String> hello() {
        return Mono.just("Hello Reactive World");
    }
}
```
