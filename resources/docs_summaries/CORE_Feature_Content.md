# Halo Plugin Development: Content & Themes

## 1. Finder (Expose Data to Themes)
Allows themes to query plugin data via `finder.yourFinderName`.

```java
import run.halo.app.theme.finder.Finder;
import reactor.core.publisher.Mono;

@Component
@Finder("myPluginData") // Theme usage: finder.myPluginData.getById(1)
public class MyDataFinder {
    public Mono<String> getById(Integer id) {
        return Mono.just("Data-" + id);
    }
}
```

## 2. Template Injection
Plugins can provide templates (e.g., custom pages) for themes.

### Structure
Files in `src/main/resources/templates/`.

### Resolution
Use `TemplateNameResolver` in your Controller.
```java
return TemplateNameResolver.resolveTemplateNameOrDefault(exchange, "moments");
// Logic: Checks theme first, falls back to plugin's "moments.html"
```

### Fragments
Use `plugin:<plugin-name>:fragments/layout` to reference plugin fragments.
