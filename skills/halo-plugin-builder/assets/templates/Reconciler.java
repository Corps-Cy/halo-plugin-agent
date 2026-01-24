package com.example.plugin;

import run.halo.app.extension.controller.Controller;
import run.halo.app.extension.controller.ControllerBuilder;
import run.halo.app.extension.controller.Reconciler;
import run.halo.app.extension.controller.Result;
import run.halo.app.extension.ReactiveExtensionClient;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import java.time.Duration;

@Component
public class TemplateReconciler implements Reconciler<Reconciler.Request> {

    private final ReactiveExtensionClient client;

    public TemplateReconciler(ReactiveExtensionClient client) {
        this.client = client;
    }

    @Override
    public Mono<Result> reconcile(Request request) {
        // 1. Fetch the resource
        return client.fetch(TemplateExtension.class, request.name())
            .flatMap(resource -> {
                // 2. Implement Business Logic
                // boolean changed = doSomething(resource);
                
                // 3. Update Status if needed
                // if (changed) return client.update(resource);
                
                return Mono.just(resource);
            })
            // Success: Do not retry
            .thenReturn(Result.doNotRetry())
            // Error Handling: Log and Retry after 5s
            .onErrorResume(e -> {
                // log.error("Reconcile failed", e);
                return Mono.just(Result.requeue(Duration.ofSeconds(5)));
            });
    }

    @Override
    public Controller setupWith(ControllerBuilder builder) {
        return builder.extension(TemplateExtension.class).build();
    }
}
