# Halo 2.x Frontend Development Deep Dive

> **Core Principle**: Halo Console uses Vue 3 + TypeScript.
> **Critical Rule**: Core components are **globally registered**. Do NOT import them.

## 1. UI Library (`@halo-dev/components`)

Use these components directly in your `<template>`.

### Common Components

| Component | Usage | Key Props |
| :--- | :--- | :--- |
| **VButton** | `<v-button>` | `type` ("primary", "default", "danger", "dashed"), `loading`, `block`, `disabled` |
| **VInput** | `<v-input>` | `v-model:value`, `placeholder`, `type` ("text", "password"), `clearable` |
| **VSpace** | `<v-space>` | `direction` ("vertical", "horizontal"), `size` ("small", "middle", "large") |
| **VCard** | `<v-card>` | `title`, `loading`. Use slots `#extra` for header buttons. |
| **VTag** | `<v-tag>` | `type` ("success", "warning", "error", "info"). |
| **VTable** | `<v-table>` | `columns` (See below), `data-source` (Array), `row-key`. |
| **VForm** | `<v-form>` | Container for custom forms. (But prefer FormKit for settings). |

### VTable Usage Example

```html
<script setup lang="ts">
const columns = [
  { title: "Name", dataIndex: "metadata.name", key: "name" },
  { title: "Status", dataIndex: "status.phase", key: "phase" },
  { title: "Actions", key: "actions" } // Custom slot
];
</script>

<template>
  <v-table :columns="columns" :data-source="items" row-key="metadata.name">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'actions'">
        <v-button size="small" @click="handleEdit(record)">Edit</v-button>
      </template>
    </template>
  </v-table>
</template>
```

### Icons
Use the `<Icon>` component.
```html
<Icon icon="ri:user-line" />
<Icon icon="carbon:add" />
```

---

## 2. Shared Logic (`@halo-dev/console-shared`)

**Import from here** for API clients and UI feedback.

### Feedback Hooks
```typescript
import { useToast, useDialog } from "@halo-dev/console-shared";

const toast = useToast();
const dialog = useDialog();

const handleDelete = () => {
  dialog.warning({
    title: "Delete Item?",
    content: "This action cannot be undone.",
    onConfirm: () => {
      toast.success("Deleted!");
    }
  });
};
```

### HTTP Requests
Use `apiClient` or `axiosInstance`. They automatically handle Auth Tokens.

```typescript
import { apiClient } from "@halo-dev/console-shared";

// List Custom Resources
const { data } = await apiClient.extension.customResource.list(
  "my-plugin.group", 
  "v1alpha1", 
  "myresources"
);
```

---

## 3. Routing & Menu (`src/index.ts`)

The entry point defines where your plugin appears in the Console.

```typescript
import { definePlugin } from "@halo-dev/ui-shared";
import { markRaw } from "vue";
import { IconBook } from "@iconify-prerendered/vue-remix-icon"; // Import specific icon for menu

export default definePlugin({
  routes: [
    {
      parentName: "Root",
      route: {
        path: "/my-plugin",
        name: "MyPluginHome",
        component: () => import("./views/Home.vue"), // Lazy load
        meta: {
          title: "My Plugin",
          menu: {
            name: "My Plugin",
            group: "content",      // content, system, interface, tools
            icon: markRaw(IconBook),
            priority: 0
          }
        }
      }
    }
  ]
});
```
