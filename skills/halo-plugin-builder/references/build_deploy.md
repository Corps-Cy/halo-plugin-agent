# Halo 2.x Build & Deploy Guide

## 1. Gradle Configuration (`build.gradle`)

Use `run.halo.plugin.devtools` version **0.6.1+**.

```groovy
plugins {
    id 'java'
    id 'io.freefair.lombok' version '8.6'
    id 'run.halo.plugin.devtools' version '0.6.1'
}

group = 'com.example.plugin'
version = '1.0.0-SNAPSHOT'

halo {
    version = '2.21.0' // Target Halo Version
}

dependencies {
    implementation platform('run.halo.tools.platform:plugin:2.21.0')
    compileOnly 'run.halo.app:api'
    testImplementation 'run.halo.app:api'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
```

## 2. Plugin Manifest (`src/main/resources/plugin.yaml`)

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: Plugin
metadata:
  name: plugin-example
spec:
  displayName: "Example Plugin"
  description: "A demo plugin."
  version: 1.0.0-SNAPSHOT
  requires: ">=2.20.0"
  enabled: true
  homepage: https://github.com/example/plugin
  author:
    name: "Developer"
  license:
    - name: "Apache-2.0"
```

## 3. Permissions (RBAC)

Create `src/main/resources/extensions/role.yaml` to define permissions.

```yaml
apiVersion: v1alpha1
kind: Role
metadata:
  name: plugin-example-admin
  labels:
    halo.run/role-template: "true"
rules:
  - apiGroups: ["plugin.example.com"]
    resources: ["todos"]
    verbs: ["*"]
```

## 4. GitHub Actions (CI/CD)

Use the standard workflows from `halo-sigs`.

**CI (`.github/workflows/ci.yaml`)**:
```yaml
name: CI
on: [push, pull_request]
jobs:
  ci:
    uses: halo-sigs/reusable-workflows/.github/workflows/plugin-ci.yaml@v3
    with:
      java-version: 21
```

**Release (`.github/workflows/release.yaml`)**:
```yaml
name: Release
on:
  release:
    types: [published]
jobs:
  release:
    uses: halo-sigs/reusable-workflows/.github/workflows/plugin-cd.yaml@v3
    with:
      java-version: 21
      skip-appstore-release: true
```
