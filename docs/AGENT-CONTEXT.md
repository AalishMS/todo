# Agent Context

> This document provides a fast-start summary for AI coding agents working on this codebase. Read this first before exploring files.

## What This Project Is

A frontend-only todo app. React 19 + TypeScript + Vite 7 + Tailwind CSS v4 + shadcn/ui. No backend, no database, no API. All persistence via browser `localStorage`. Deployed on Vercel.

## Quick Reference

| Item | Value |
|------|-------|
| Entry point | `src/main.tsx` |
| Root component | `src/App.tsx` |
| State management | `useState` + `useLocalStorage` hook (no Redux/Zustand) |
| Styling | Tailwind CSS v4 + shadcn/ui (New York style, neutral palette) |
| Theme | Dark/light/system via `ThemeProvider` context |
| Build command | `npm run build` (runs `tsc -b && vite build`) |
| Dev server | `npm run dev` (Vite on port 5173) |
| Lint | `npm run lint` |
| Path alias | `@/` maps to `src/` |
| Type imports | Must use `import type` (verbatimModuleSyntax enabled) |
| Node version | 18+ |
| Package manager | npm |

## File Map

```
src/
├── App.tsx                    # ALL app state + CRUD logic + render tree
├── main.tsx                   # ThemeProvider wrapper + React root
├── index.css                  # Tailwind imports + CSS theme variables
├── components/
│   ├── Header.tsx             # Title + Sun/Moon theme toggle
│   ├── ThemeProvider.tsx       # React context for dark/light/system
│   ├── TodoInput.tsx          # Form: title + priority select + calendar date picker
│   ├── TodoItem.tsx           # Checkbox + inline edit + priority badge + delete
│   ├── TodoFilters.tsx        # All/Active/Completed buttons + sort dropdown
│   ├── TodoStats.tsx          # "{n} remaining" / "{n} of {total} completed"
│   └── ui/                    # shadcn/ui primitives -- DO NOT EDIT MANUALLY
├── hooks/
│   ├── useLocalStorage.ts     # Generic hook: syncs useState <-> localStorage
│   └── useTheme.ts            # Consumes ThemeProviderContext
├── types/
│   └── todo.ts                # Todo interface, FilterType, SortType
└── lib/
    └── utils.ts               # cn() -- clsx + tailwind-merge
```

## Data Model

```typescript
interface Todo {
  id: string;               // crypto.randomUUID()
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate: string | null;   // ISO date string
  createdAt: string;         // ISO timestamp
}

type FilterType = "all" | "active" | "completed";
type SortType = "createdAt" | "dueDate" | "priority";
```

## localStorage Keys

| Key | Type | Description |
|-----|------|-------------|
| `"todos"` | `Todo[]` | All todo items |
| `"todo-filter"` | `FilterType` | Current filter (default: `"all"`) |
| `"todo-sort"` | `SortType` | Current sort (default: `"createdAt"`) |
| `"todo-theme"` | `"dark" \| "light" \| "system"` | Theme preference (default: `"system"`) |

## Architecture Rules

1. **All application state lives in `App.tsx`** -- state is passed down as props, callbacks passed as handlers
2. **Theme is the only context** -- accessed via `useTheme()` hook
3. **No routing** -- single page, everything renders at once
4. **`src/components/ui/` is vendor code** -- reinstall with `npx shadcn@latest add <name>`, never hand-edit
5. **Type-only imports required** -- use `import type { Foo }` not `import { Foo }` for types

## Common Tasks for Agents

### Adding a new field to Todo

1. Update `Todo` interface in `src/types/todo.ts`
2. Update `addTodo` in `src/App.tsx` to include the new field
3. Update `TodoInput.tsx` to collect the new field
4. Update `TodoItem.tsx` to display/edit the new field
5. Run `npm run build` to verify

### Adding a new component

1. Create `src/components/NewComponent.tsx`
2. Import and render it in `src/App.tsx`
3. If it needs shadcn/ui components not yet installed: `npx shadcn@latest add <name>`

### Changing theme colors

Edit CSS variables in `src/index.css` under `:root` (light) and `.dark` sections. Colors use `oklch` color space.

### Adding a new shadcn/ui component

```bash
npx shadcn@latest add <component-name>
```

### Deploying

```bash
npm run build          # verify build passes
vercel --prod          # deploy to Vercel
```

## Gotchas

- **Tailwind v4** -- uses CSS-based config in `index.css`, not a `tailwind.config.js` file
- **shadcn/ui New York style** -- components use `size="sm"` patterns, not `variant="sm"`
- **`date-fns`** is used for date formatting in `TodoInput.tsx` and `TodoItem.tsx`
- **No test framework** is configured -- if adding tests, install vitest + testing-library
- **`package.json` name** is still `"vite-scaffold"` -- rename if needed

## Related Docs

- [Architecture](ARCHITECTURE.md) -- detailed component tree and data flow
- [Contributing](CONTRIBUTING.md) -- dev setup and conventions
- [Design Doc](plans/2026-03-02-todo-app-design.md) -- original design decisions
- [Implementation Plan](plans/2026-03-02-todo-app-plan.md) -- how the app was built step by step
