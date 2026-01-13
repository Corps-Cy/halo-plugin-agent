# Halo Plugin Development: UI Components & Icons

> Halo 2.22+ uses a Global Component Registry. You should use kebab-case tags in templates and avoid manual imports for core components.

## 1. Icon System (Iconify)
Do NOT import icon classes. Use the `<Icon>` component with string identifiers.

```html
<!-- Remix Icon example -->
<Icon icon="ri:share-forward-line" />
<Icon icon="ri:save-3-line" />

<!-- Carbon Icon example -->
<Icon icon="carbon:settings" />
```

## 2. Basic Layout Components
Used directly in templates without `import`.

### `v-space` (Spacing)
```html
<v-space direction="vertical" :size="20">
  <v-input label="Title" />
  <v-button type="primary">Submit</v-button>
</v-space>
```
*   **Props**: `direction` ("vertical" | "horizontal"), `size` (number).

### `v-button` (Button)
```html
<v-button type="primary" @click="save">Save</v-button>
<v-button type="default">Cancel</v-button>
```

## 3. Specialized Components

### `UppyUpload`
```html
<UppyUpload 
  endpoint="/apis/api.console.halo.run/v1alpha1/attachments/upload" 
  :meta="{ policyName: 's3' }" 
/>
```

### `AttachmentSelectorModal`
```html
<AttachmentSelectorModal v-model:visible="visible" @select="onSelect" />
```

## 4. UI Feedback
For Toast and Dialog, always use the hooks from `@halo-dev/console-shared`.

```ts
import { useToast } from "@halo-dev/console-shared";
const toast = useToast();
toast.success("Done");
```

## 🚨 Critical Best Practices
1. **No Manual Imports**: Avoid `import { VButton } from "@halo-dev/components"` as it leads to "Not Found" errors in many build environments.
2. **Kebab-Case**: Use `<v-input>` instead of `<VInput>` in templates for better compatibility with global registration.
3. **Icons**: Always prefer the `<Icon>` component for simple UI icons.