# Todo

A frontend-only todo application with a polished UI, built with React, shadcn/ui, and Tailwind CSS. All data persists in the browser via localStorage -- no backend required.

**Live:** [todo-two-nu-76.vercel.app](https://todo-two-nu-76.vercel.app)

## Features

- **Add todos** with title, priority (low/medium/high), and optional due date
- **Inline editing** -- click a todo's text to edit in place
- **Complete & delete** -- checkbox toggle with strikethrough styling
- **Filter** by All / Active / Completed
- **Sort** by creation date, due date, or priority
- **Dark/light theme** -- toggle in header, defaults to OS preference
- **Persistent state** -- todos, filters, sort, and theme survive page refreshes via localStorage
- **Responsive** -- works on mobile and desktop

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 + shadcn/ui (New York style) |
| Icons | Lucide React |
| Date handling | date-fns |
| Persistence | Browser localStorage |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install and run

```bash
git clone https://github.com/AalishMS/todo.git
cd todo
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

### Build for production

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── App.tsx                    # Root component with all state logic
├── main.tsx                   # Entry point, wraps App in ThemeProvider
├── index.css                  # Tailwind v4 config + theme variables
├── components/
│   ├── Header.tsx             # Title + theme toggle button
│   ├── ThemeProvider.tsx       # Dark/light/system theme context
│   ├── TodoInput.tsx          # Add form (title, priority, due date)
│   ├── TodoItem.tsx           # Single todo with edit/delete/complete
│   ├── TodoFilters.tsx        # Filter buttons + sort dropdown
│   ├── TodoStats.tsx          # Remaining/completed counts
│   └── ui/                    # shadcn/ui primitives (button, card, etc.)
├── hooks/
│   ├── useLocalStorage.ts     # Generic localStorage sync hook
│   └── useTheme.ts            # Theme context consumer
├── types/
│   └── todo.ts                # Todo interface, FilterType, SortType
└── lib/
    └── utils.ts               # cn() utility (clsx + tailwind-merge)
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
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md) -- component tree, data flow, state management
- [Contributing](docs/CONTRIBUTING.md) -- dev setup, conventions, commit format
- [Agent Context](docs/AGENT-CONTEXT.md) -- codebase summary for AI agent sessions
- [Design Doc](docs/plans/2026-03-02-todo-app-design.md) -- original design decisions
- [Implementation Plan](docs/plans/2026-03-02-todo-app-plan.md) -- task-by-task build plan

## Deployment

The app is deployed to Vercel. To deploy your own instance:

```bash
vercel login
vercel --prod
```

## License

This project is unlicensed. Use it however you like.
