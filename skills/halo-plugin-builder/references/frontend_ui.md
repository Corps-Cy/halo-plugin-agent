# Frontend Development Guide

## Technology Stack
- **Framework**: Vue.js 3
- **Build Tool**: Vite
- **Language**: TypeScript
- **UI Library**: `@halo-dev/components` (Core), `@halo-dev/console-shared` (Shared Logic)

## 1. Entry Point (`src/index.ts`)

The plugin entry point registers routes and menus.

```typescript
import { definePlugin } from "@halo-dev/ui-shared";
import { IconBook } from "@halo-dev/components"; // Use built-in icons

export default definePlugin({
  components: {},
  routes: [
    {
      parentName: "Root",
      route: {
        path: "/my-plugin",
        name: "MyPluginHome",
        component: () => import("./views/Home.vue"),
        meta: {
          menu: {
            name: "My Plugin",
            group: "content",
            icon: markRaw(IconBook),
          }
        }
      }
    }
  ]
});
```

## 2. Using Core Components

Do NOT import component classes directly. They are globally registered.

### Button
```html
<v-button type="primary" @click="handleClick">Submit</v-button>
```

### Input
```html
<v-input v-model:value="form.title" placeholder="Enter title" />
```

### Card
```html
<v-card title="Settings">
  <template #extra>
    <v-button>Save</v-button>
  </template>
  Content here...
</v-card>
```

## 3. Data Fetching

Use `useFetch` or `axios` configured in `console-shared`.

```typescript
import { apiClient } from "@halo-dev/console-shared";

const fetchData = async () => {
  const { data } = await apiClient.get("/api/v1alpha1/plugins/my-plugin/resources");
  return data;
};
```
