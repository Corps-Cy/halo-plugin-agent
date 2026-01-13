# Halo Plugin Development: Environment & Structure

## 1. Environment Requirements
> Critical: Strict adherence to versions is required.
*   **Java**: OpenJDK 21 LTS (Halo 2.15+).
*   **Node.js**: 20 LTS.
*   **pnpm**: 10.x (DO NOT use npm/yarn).
*   **Docker**: Recommended for `haloServer` debugging.

## 2. Directory Structure (Standard)
```text
my-plugin/
├── build.gradle          # Gradle build script
├── settings.gradle       # Gradle settings
├── ui/                   # [Frontend] Vue 3 Root
│   ├── src/
│   │   ├── index.ts      # UI Entry (definePlugin)
│   │   ├── views/        # Page Components
│   │   └── components/   # Reusable Components
│   └── package.json      # Frontend Deps
└── src/
    └── main/
        ├── java/
        │   └── run/halo/plugin/demo/
        │       └── StarterPlugin.java  # [Backend] Entry Class
        └── resources/
            ├── plugin.yaml             # [Core] Manifest
            └── ui/                     # Built assets (Auto-generated)
```

## 3. Key Files
*   **StarterPlugin.java**: Must extend `BasePlugin` and be `@Component`.
*   **plugin.yaml**: Defines metadata (GVK, version). Must be in `src/main/resources`.
*   **ui/src/index.ts**: Must export `definePlugin`.

## 4. Common Pitfalls
*   **Path Issues**: `~/halo-next` structure varies by OS.
*   **Build Flow**: `./gradlew build` automatically triggers `pnpm build`. Do not manually copy assets.
