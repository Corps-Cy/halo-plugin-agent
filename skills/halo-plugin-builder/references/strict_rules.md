# 🚫 STRICT ANTI-PATTERNS (CRITICAL)

The following patterns are **STRICTLY PROHIBITED** in Halo 2.x Plugin development. 
Any usage of these patterns will cause system crashes or deadlocks.

## 1. ☠️ Blocking I/O in Reactive Streams (Project Reactor)
> **Severity: FATAL**
- **FORBIDDEN:** calling `.block()`, `.blockFirst()`, `.blockLast()` inside a reactive chain.
- **FORBIDDEN:** using `Thread.sleep()`.
- **FORBIDDEN:** using traditional JDBC (blocking) drivers.
- **CORRECT:** Use `flatMap`, `map`, `zip`, and Reactive implementations (R2DBC).

## 2. ☠️ Legacy Servlet Dependencies
> **Severity: COMPILATION ERROR**
- **FORBIDDEN:** Importing `javax.servlet.*` or `jakarta.servlet.*`.
- **FORBIDDEN:** Using `HttpServletRequest` or `HttpServletResponse`.
- **CORRECT:** Use `ServerWebExchange`, `ServerHttpRequest`, `ServerHttpResponse` (Spring WebFlux).

## 3. ☠️ Direct Database Manipulation
> **Severity: ARCHITECTURAL VIOLATION**
- **FORBIDDEN:** Creating database tables manually using SQL.
- **FORBIDDEN:** Direct `INSERT/UPDATE` statements bypassing the Extension mechanism.
- **CORRECT:** Define a `CustomResource` (Extension) and use `ReactiveExtensionClient` to manage data.

## 4. ☠️ Synchronous HTTP Clients
> **Severity: PERFORMANCE DEGRADATION**
- **FORBIDDEN:** Using `RestTemplate`, `Apache HttpClient`, or `OkHttp` (synchronous).
- **CORRECT:** Use `WebClient` (Reactive).

## 5. ☠️ UI Component Imports
> **Severity: COMPILATION ERROR**
- **FORBIDDEN:** `import { VButton, VInput, VTable } from "@halo-dev/components"`.
- **FORBIDDEN:** Importing individual icons as classes (e.g., `import { IconShare... }`).
- **CORRECT:** Core components (`VButton`, `VInput`, etc.) are **globally registered**. Use them directly in `<template>` as kebab-case (e.g., `<v-button>`).
- **CORRECT:** Use the `<Icon icon="ri:name" />` component for icons.

## 6. ☠️ Incorrect Hook Sources
> **Severity: RUNTIME ERROR**
- **FORBIDDEN:** `import { useToast } from "@halo-dev/components"`.
- **CORRECT:** Use `import { useToast, useDialog } from "@halo-dev/console-shared"`.
