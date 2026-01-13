# Halo 2.x Plugin Development AI Specification Kit (V2.0)

![Halo](https://img.shields.io/badge/Halo-2.x-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![Status](https://img.shields.io/badge/Status-V2.0_Ready-success)

This project is a comprehensive **technical knowledge base and AI collaboration specification** designed specifically for **Halo 2.x plugin development**, fully updated for Halo 2.22+.

We have restructured the entire knowledge base from 90+ fragmented summaries into **11 high-density core topic documents**. This ensures that AI agents (ChatGPT, Claude, Gemini, Cursor) receive coherent, accurate, and strictly constrained context.

---

## 📂 Core Assets (V2.0 Structure)

1.  **Strict Anti-Patterns (`ai_specs/STRICT_RULES.md`)**: Hard constraints that forbid AI from using blocking I/O, legacy Servlets, or manual SQL tables.
2.  **Consolidated Knowledge Base (`docs_summaries/`)**: 
    - `CORE_Environment.md`: JDK 21, pnpm 10, and directory layout.
    - `CORE_Backend_Architecture.md`: Manifest, Lifecycle, and GVK models.
    - `CORE_Backend_Logic.md`: Synchronous Reconcilers and Reactive best practices.
    - `CORE_Frontend_UI.md`: Routing, API Client, and global state.
    - `CORE_Frontend_ExtensionPoints.md`: Deep dive into UI injection points.
    - `CORE_Security.md`: RBAC and RoleTemplates.
    - `CORE_Example_TodoList.md`: The official standard implementation template.

---

## 🚀 Optimized Workflow

When developing a new plugin with HPS, the workflow is now 300% more stable:

### Step 1: Initialize (`hps init`)
HPS sets up the environment and injects the **Strict Rules** into your AI's system prompt or `.cursorrules`.

### Step 2: Define (`hps new`)
Draft your feature requirement. The AI will now follow the **Topic-Based** documentation standards.

### Step 3: Implement (`hps code`)
HPS will detect your needs and inject the relevant **CORE Topic Documents**. For example, if you are building a UI feature, it will inject `CORE_Frontend_UI.md` and `CORE_Frontend_Components.md` automatically.

---

## 📚 Topic Index

| Topic | Focus | Document |
| :--- | :--- | :--- |
| **Foundation** | Env, Build, Structure | [Environment](docs_summaries/CORE_Environment.md) |
| **Logic** | Reconcilers, Reactive IO | [Logic](docs_summaries/CORE_Backend_Logic.md) |
| **UI** | Components, Routing | [UI](docs_summaries/CORE_Frontend_UI.md) |
| **Security** | RBAC, Roles | [Security](docs_summaries/CORE_Security.md) |
| **Integration** | Notifications, Storage | [System](docs_summaries/CORE_Feature_System.md) |

---

**Happy Coding with Halo & AI V2.0!**