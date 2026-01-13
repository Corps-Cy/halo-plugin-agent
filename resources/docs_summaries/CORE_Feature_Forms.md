# Halo Plugin Development: Form Schema & Dynamic Forms

> Halo uses a YAML-based Form Schema (built on FormKit) to render dynamic configuration interfaces for settings and metadata.

## 1. Core Field Types (`$formkit`)
Common components available in Halo Console:

| Type | Purpose | Key Props |
| :--- | :--- | :--- |
| `text` / `password` | Standard inputs | `label`, `value`, `validation` |
| `select` | Dropdown | `options` (static) or `action` (dynamic API) |
| `switch` | Toggle | `onValue`, `offValue` |
| `attachment` | File upload | `accepts: ["image/*"]`, `multiple` |
| `iconify` | Icon selector | `format: "name"` |
| `code` | Code editor | `language: "javascript"`, `height` |
| `array` | Repeating items | `children: [ ... ]`, `addLabel` |
| `postSelect` | Select Halo Posts | - |

## 2. Plugin Settings (`Setting` Extension)
To create a settings page for your plugin, define a `Setting` resource.

**File**: `src/main/resources/extensions/settings.yaml`
```yaml
apiVersion: v1alpha1
kind: Setting
metadata:
  name: my-plugin-setting # Matches 'settingName' in plugin.yaml
spec:
  forms:
    - group: general
      label: General Settings
      formSchema:
        - $formkit: "text"
          name: "apiKey"
          label: "API Key"
          validation: "required"
        - $formkit: "switch"
          name: "enableFeature"
          label: "Enable Feature"
          value: false
```

## 3. Metadata Forms (`AnnotationSetting`)
Inject fields into Halo's core entities (Post, Page, User, etc.) via `metadata.annotations`.

**File**: `src/main/resources/extensions/post-annotations.yaml`
```yaml
apiVersion: v1alpha1
kind: AnnotationSetting
metadata:
  name: post-seo-settings
spec:
  targetRef:
    group: content.halo.run
    kind: Post
  formSchema:
    - $formkit: "text"
      name: "seo-keywords" # Saved as 'seo-keywords' annotation
      label: "SEO Keywords"
```

## 4. Frontend Component: `<AnnotationsForm />`
If you are building a custom UI and want to render these annotation fields:

```html
<template>
  <AnnotationsForm 
    ref="formRef"
    :value="item.metadata.annotations" 
    kind="Post" 
    group="content.halo.run" 
  />
</template>
```

## ⚠️ Best Practices
1. **Validation**: Use `validation: "required|length:5"` string format.
2. **Dynamic Data**: For `select` components, use `action: "/apis/..."` to fetch data from your plugin's controllers.
3. **Naming**: Use kebab-case for field names to maintain consistency with Kubernetes-style labels/annotations.
