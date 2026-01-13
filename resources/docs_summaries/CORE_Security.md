# Halo Plugin Development: Security & Permissions

## 1. RBAC Model Overview
Halo uses a Kubernetes-like RBAC.
*   **Role**: A collection of permissions.
*   **RoleBinding**: Assigns a Role to a User.
*   **RoleTemplate**: A template Role provided by plugins.

## 2. Role Template (Backend)
> Defined in `src/main/resources/extensions/role-template.yaml`.

```yaml
apiVersion: v1alpha1
kind: Role
metadata:
  name: plugin-demo-manage
  labels:
    halo.run/role-template: "true" # Mandatory
  annotations:
    rbac.authorization.halo.run/module: "Todo"
    rbac.authorization.halo.run/ui-permissions: |
      ["plugin:demo:todo:view"]
rules:
  - apiGroups: ["demo.plugin.halo.run"]
    resources: ["todos"]
    verbs: ["*"]
```

## 3. UI Permission (Frontend)
> Control visibility of Menus and Buttons.

### Menu Visibility (index.ts)
```ts
meta: {
  permissions: ["plugin:demo:todo:view"]
}
```

### Component Visibility (Vue Template)
```html
<HasPermission :permissions="['plugin:demo:todo:manage']">
  <VButton>Delete</VButton>
</HasPermission>
```

## 4. Best Practices
*   **Naming**: `plugin:{plugin-name}:{resource}:{action}`
*   **Aggregation**: Use `rbac.authorization.halo.run/aggregate-to-anonymous: "true"` for public APIs.
