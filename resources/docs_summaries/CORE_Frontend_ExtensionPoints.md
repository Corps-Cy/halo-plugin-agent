# Halo Plugin Development: UI Extension Points (Deep Dive)

> UI Extension Points allow you to inject custom Vue components into Halo's core console.
> All definitions live in `ui/src/index.ts` under the `extensionPoints` key.

## 1. List Item Fields (Adding Columns)
Inject additional information columns into existing data tables.

**Return Type**: `EntityFieldItem[]`

| Technical ID | Target | Context Argument (Ref) |
| :--- | :--- | :--- |
| `post:list-item:field:create` | Post List | `post` |
| `single-page:list-item:field:create` | Page List | `singlePage` |
| `plugin:list-item:field:create` | Plugin List | `plugin` |

### Field Interface
```ts
export interface EntityFieldItem {
  priority: number;
  position: "start" | "end"; // Where to insert
  component: Raw<Component>;
  props?: Record<string, unknown>; // Data passed to component
}
```

## 2. Dashboard Widgets
Add interactive cards to the administrative home screen.

**Return Type**: `DashboardWidgetDefinition[]`

### Widget Interface
```ts
export interface DashboardWidgetDefinition {
  id: string;
  group: string; // Category
  component: Raw<Component>;
  defaultSize: { w: number, h: number }; // Grid units
  configFormKitSchema?: Record<string, unknown>[]; // Dynamic config form
}
```
**Component Props**: `editMode: boolean`, `config: Record<string, any>`.

## 3. Advanced Tabs (User & Profile)
Add tabs to user-related pages.

| Technical ID | Target | Props Injected |
| :--- | :--- | :--- |
| `user:detail:tabs:create` | Admin: User Details | `user: DetailedUser` |
| `uc:user-profile:tabs:create` | User Center: My Profile | `user: DetailedUser` |

## 4. List Item Operations (Context Menu)
Standard format for adding buttons to the "..." menu.

| Technical ID | Target |
| :--- | :--- |
| `post:list-item:operation:create` | Post List |
| `comment:list-item:operation:create` | Comment List |
| `attachment:list-item:operation:create` | Attachment List |
| `backup:list-item:operation:create` | Backup List |
| `theme:list-item:operation:create` | Theme List |

## 5. Editor & Media
- `editor:create`: Register a new editor type.
- `attachment:selector:create`: Add tabs to attachment modal.
- `default:editor:extension:create`: Extend the TipTap editor (toolbar, commands).

## 🚨 Critical Best Practices
1. **`markRaw`**: ALWAYS use `markRaw()` for components to avoid performance overhead.
2. **`permissions`**: Specify permissions for all extension points to ensure security.
3. **`priority`**: Use priority to control the ordering of buttons or tabs.
