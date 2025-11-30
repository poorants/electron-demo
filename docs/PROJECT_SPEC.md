# Electron Project Technical Specification

## 1. Core Frameworks

### 1.1 Electron

Base framework for building cross-platform desktop applications using web technologies.  
Handles the main process, window management, system integration, IPC, and application lifecycle.

### 1.2 React

Primary renderer framework for building UI components.  
Provides a component-based architecture optimized for maintainability and scalability.

### 1.3 TypeScript

Strongly typed language layer used across main, preload, and renderer processes.  
Improves reliability, tooling support, and long-term maintainability.

### 1.4 Node.js

Runtime for the Electron main process.  
Used for backend logic, filesystem access, cryptographic operations, and integration with native modules.

## 2. UI & Styling

### 2.1 Tailwind CSS

Utility-first CSS framework enabling fast and consistent styling.  
Reduces custom CSS overhead and improves developer productivity.

### 2.2 Shadcn UI

React component library built on Tailwind.  
Provides reusable, accessible, and customizable UI components.

### 2.3 React Router (optional)

Routing solution for managing multi-page navigation within the renderer.

## 3. State Management

### 3.1 Zustand

Lightweight state management solution for React.  
Minimal boilerplate, supports persistence and middleware, and works well in Electron environments.

## 4. Build System

### 4.1 Vite

High-performance bundler for both main and renderer code.  
Offers fast dev server, HMR, and optimized production builds.

### 4.2 Electron Builder

Packaging and automatic updater tool for distributing cross-platform builds.  
Supports Windows, macOS, and Linux targets.

## 5. Security Architecture

### 5.1 Preload Script with Context Isolation

Required for secure IPC communication.  
Ensures renderer cannot directly access Node APIs.

### 5.2 IPC Channels

Structured communication layer between renderer and main processes.  
Uses window.exposed API patterns to restrict surface area.

### 5.3 CSP (Content Security Policy)

Recommended for blocking remote script execution.  
Improves security in production environments.

## 6. Optional Enhancements

### 6.1 SQLite / Local Database

Can be integrated for storing local configuration or logs.

### 6.2 Native Node Addons (C++)

Optional for performance-critical features or legacy system integration.

### 6.3 ESLint + Prettier

Code-quality and formatting toolchain for consistent development.

## 7. Project Directory Structure

Recommended directory layout for modern Electron applications using React, TypeScript, and Vite.

```text
project-root/
├── .github/                    # GitHub Actions, issue templates
│   └── workflows/
│       └── release.yml         # CI/CD for auto-release
├── docs/                       # Project documentation
│   └── PROJECT_SPEC.md
├── resources/                  # App icons, installer assets
│   ├── icon.ico
│   ├── icon.icns
│   └── icon.png
├── src/
│   ├── main/                   # Electron main process
│   │   ├── index.ts            # Entry point
│   │   ├── ipc/                # IPC handlers (modular)
│   │   │   ├── auth.ipc.ts
│   │   │   └── index.ts
│   │   ├── services/           # Business logic (auth, storage, etc.)
│   │   │   ├── auth.service.ts
│   │   │   └── session.service.ts
│   │   └── utils/              # Main process utilities
│   │       └── paths.ts
│   ├── preload/                # Preload scripts (context bridge)
│   │   ├── index.ts            # Exposes API to renderer
│   │   └── types.d.ts          # Type definitions for exposed API
│   ├── renderer/               # React application (UI)
│   │   ├── index.html          # HTML entry
│   │   ├── main.tsx            # React entry point
│   │   ├── App.tsx             # Root component
│   │   ├── assets/             # Static assets (images, fonts)
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/             # Shadcn/primitive components
│   │   │   └── layout/         # Layout components (Topbar, Sidebar)
│   │   ├── pages/              # Page-level components
│   │   │   ├── LoginPage.tsx
│   │   │   └── MainPage.tsx
│   │   ├── hooks/              # Custom React hooks
│   │   ├── stores/             # Zustand stores
│   │   │   └── authStore.ts
│   │   ├── lib/                # Utility functions
│   │   └── styles/             # Global styles, Tailwind config
│   │       └── globals.css
│   └── shared/                 # Shared types/constants (main + renderer)
│       ├── constants.ts
│       └── types.ts
├── electron-builder.yml        # Electron Builder config
├── vite.config.ts              # Vite config (renderer)
├── vite.config.main.ts         # Vite config (main process)
├── vite.config.preload.ts      # Vite config (preload)
├── tsconfig.json               # TypeScript base config
├── tsconfig.node.json          # TS config for main/preload
├── tailwind.config.js          # Tailwind CSS config
├── postcss.config.js           # PostCSS config
├── package.json
├── .env.example                # Environment variable template
├── .gitignore
└── README.md
```

### 7.1 Directory Responsibilities

| Directory                         | Description                                                                 |
| --------------------------------- | --------------------------------------------------------------------------- |
| `src/main/`                       | Electron main process: window management, IPC handlers, native integrations |
| `src/main/ipc/`                   | Modular IPC handler files, registered in `index.ts`                         |
| `src/main/services/`              | Business logic separated from IPC (auth, session, file operations)          |
| `src/preload/`                    | Context bridge scripts exposing safe APIs to renderer                       |
| `src/renderer/`                   | React application with pages, components, stores                            |
| `src/renderer/components/ui/`     | Shadcn UI primitives (Button, Dialog, etc.)                                 |
| `src/renderer/components/layout/` | App shell components (Topbar, Sidebar, Content)                             |
| `src/renderer/pages/`             | Route-level page components                                                 |
| `src/renderer/stores/`            | Zustand state stores                                                        |
| `src/shared/`                     | Types and constants shared between main and renderer                        |
| `resources/`                      | Platform-specific icons and installer assets                                |
| `docs/`                           | Technical documentation and specs                                           |

### 7.2 Key Conventions

- **One IPC handler per domain**: `auth.ipc.ts`, `file.ipc.ts`, etc.
- **Services for logic**: Keep IPC handlers thin; delegate to services.
- **Shared types**: Define IPC payload types in `src/shared/types.ts`.
- **Component colocation**: Keep component-specific styles/tests alongside components.
- **Environment variables**: Use `.env` files, never commit secrets.

## 8. Summary of Technology Stack

```text
Electron
React
TypeScript
Node.js
Tailwind CSS
Shadcn UI
Zustand
Vite
Electron Builder
IPC with preload bridge
Optional: React Router, SQLite, C++ Native Addons, ESLint/Prettier
```
