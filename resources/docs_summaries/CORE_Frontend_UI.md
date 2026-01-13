# Halo Plugin Development: Frontend UI

## 1. Entry Point (index.ts)
Must export `definePlugin`.
```ts
import { definePlugin } from "@halo-dev/ui-shared";
import { markRaw } from "vue";

export default definePlugin({
  routes: [ ... ],
  extensionPoints: { ... }
});
```

## 2. Routing & Menu (meta)
Full `meta` configuration interface.

```ts
meta: {
  title: "My Feature",
  searchable: true, // Allow finding this page via Global Search (Cmd+K)
  permissions: ["plugin:demo:view"], // ACL check
  menu: {
    name: "My Feature",
    group: "tools", // Built-in groups: dashboard, content, interface, users, settings, tools
    icon: markRaw(Icon),
    priority: 0,
    mobile: false // Show on mobile sidebar?
  }
}
```

## 3. API Requests
Package: `@halo-dev/api-client`

### Calling Core APIs (SDK style)
```ts
import { coreApiClient } from "@halo-dev/api-client";

const res = await coreApiClient.content.post.listPost({
  page: 1, size: 10
});
```

### Calling Plugin APIs (Axios)
```ts
import { axiosInstance } from "@halo-dev/api-client";

const res = await axiosInstance.get("/apis/api.plugin.demo/v1alpha1/todos");
```

## 4. Shared State & Hooks
Package: `@halo-dev/console-shared` (for UI hooks) and `@halo-dev/ui-shared` (for stores).

### Feedback Hooks (Toast / Dialog)
```ts
import { useToast, useDialog } from "@halo-dev/console-shared"; // ✅ Correct source

const toast = useToast();
toast.success("Saved!");
```

### User Info (Pinia Store)
```ts
import { useUserStore } from "@halo-dev/ui-shared";
const { currentUser } = useUserStore();
```

## 5. UI Components (Zero-Import Pattern)
> ⚠️ **IMPORTANT**: Most components are **globally registered**. Do NOT import them in `<script>`.

| Standard Tag | Purpose |
| :--- | :--- |
| `<v-button>` | Primary/Default/Danger buttons |
| `<v-input>` | Text input |
| `<v-table>` | Data table |
| `<v-space>` | Layout spacing |
| `<Icon>` | Iconify icons |
