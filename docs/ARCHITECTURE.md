# Architecture

## Overview

This is a single-page React application with no routing, no backend, and no external state management. All state lives in React hooks and is persisted to `localStorage`.

## Component Tree

```
main.tsx
└── ThemeProvider (context: theme + setTheme)
    └── App (all application state)
        ├── Header (theme toggle)
        └── Card
            ├── TodoInput (add form)
            ├── TodoFilters (filter buttons + sort dropdown)
            ├── TodoItem[] (mapped list)
            └── TodoStats (counts footer)
```

## State Management

All state is managed in `App.tsx` using the `useLocalStorage` hook, which wraps `useState` with automatic `localStorage` sync.

### State Variables

| State | localStorage Key | Type | Default |
|-------|-----------------|------|---------|
| `todos` | `"todos"` | `Todo[]` | `[]` |
| `filter` | `"todo-filter"` | `FilterType` | `"all"` |
| `sort` | `"todo-sort"` | `SortType` | `"createdAt"` |
| `theme` | `"todo-theme"` | `"dark" \| "light" \| "system"` | `"system"` |

### CRUD Operations

All CRUD functions are defined in `App.tsx` and wrapped in `useCallback`:

- **addTodo** -- creates a `Todo` with `crypto.randomUUID()`, prepends to list
- **toggleTodo** -- flips `completed` by id
- **deleteTodo** -- removes by id
- **editTodo** -- updates `title` by id

### Filtering and Sorting

Computed in a single `useMemo` in `App.tsx`:

1. **Filter** -- `all` (no filter), `active` (`!completed`), `completed` (`completed`)
2. **Sort**:
   - `createdAt` -- newest first (descending)
   - `dueDate` -- soonest first (ascending), nulls last
   - `priority` -- high > medium > low

## Data Flow

```
User interaction
    ↓
Component callback (onAdd, onToggle, onDelete, onEdit)
    ↓
App.tsx state updater (setTodos via useLocalStorage)
    ↓
React re-render + useMemo recomputes filtered/sorted list
    ↓
useEffect in useLocalStorage writes to localStorage
```

Props flow one direction: `App` → child components. No prop drilling beyond one level. Theme state is the exception -- it uses React Context via `ThemeProvider` and is consumed with `useTheme()`.

## Theme System

`ThemeProvider` manages a `"dark" | "light" | "system"` theme:

1. Reads initial value from `localStorage` key `"todo-theme"`, falls back to `"system"`
2. On change, adds/removes `"dark"` or `"light"` class on `<html>`
3. For `"system"`, checks `prefers-color-scheme` media query
4. CSS variables in `index.css` define the color palette for `:root` (light) and `.dark`

## shadcn/ui Components

The `src/components/ui/` directory contains shadcn/ui primitives installed via the CLI. These are vendor components -- do not modify them directly. To update, re-run `npx shadcn@latest add <component>`.

Installed components: `badge`, `button`, `calendar`, `card`, `checkbox`, `dropdown-menu`, `input`, `popover`, `select`.

## Build Pipeline

```
TypeScript (tsc -b) → Vite build → Static files in dist/
```

- `tsconfig.app.json` -- app source (ES2022, react-jsx, strict)
- `tsconfig.node.json` -- Vite config (ES2023, node)
- `vite.config.ts` -- plugins: `@vitejs/plugin-react`, `@tailwindcss/vite`; path alias `@` → `./src`

## Key Design Decisions

1. **No routing** -- single-page app, all content visible at once
2. **No state library** -- `useState` + `useLocalStorage` is sufficient for this scope
3. **localStorage over IndexedDB** -- simpler API, sufficient for small todo lists
4. **Flat component structure** -- no nesting beyond `App` → components, keeps prop passing simple
5. **shadcn/ui over custom components** -- polished, accessible UI out of the box
6. **Tailwind v4** -- CSS-first config, no `tailwind.config.js` needed
