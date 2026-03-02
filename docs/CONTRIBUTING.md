# Contributing

## Development Setup

```bash
git clone https://github.com/AalishMS/todo.git
cd todo
npm install
npm run dev
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Project Conventions

### File Organization

- **Application components** go in `src/components/` (e.g., `Header.tsx`, `TodoItem.tsx`)
- **shadcn/ui primitives** go in `src/components/ui/` -- do not edit these manually
- **Custom hooks** go in `src/hooks/`
- **TypeScript types** go in `src/types/`
- **Utilities** go in `src/lib/`

### Naming

- Components: PascalCase (`TodoItem.tsx`)
- Hooks: camelCase with `use` prefix (`useLocalStorage.ts`)
- Types: PascalCase for interfaces, PascalCase for type aliases (`FilterType`)
- Files match their default export name

### Import Aliases

Use the `@/` alias for imports from `src/`:

```typescript
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import type { Todo } from "@/types/todo";
```

### Type Imports

Use `import type` for type-only imports (required by `verbatimModuleSyntax`):

```typescript
import type { Todo, FilterType } from "@/types/todo";
```

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add TodoInput component with priority and due date
fix: correct sort order for null due dates
chore: add shadcn/ui components
docs: update README with deployment instructions
```

Common prefixes:
- `feat:` -- new feature or component
- `fix:` -- bug fix
- `chore:` -- tooling, dependencies, config
- `docs:` -- documentation only
- `refactor:` -- code change that neither fixes a bug nor adds a feature

## Adding shadcn/ui Components

```bash
npx shadcn@latest add <component-name>
```

This installs the component to `src/components/ui/`. See [shadcn/ui docs](https://ui.shadcn.com/) for available components. The project uses the **New York** style with **neutral** base color.

## Adding Dependencies

Install runtime deps with `npm install <pkg>`, dev deps with `npm install -D <pkg>`. Keep the dependency count minimal -- this is a frontend-only app.

## Code Style

- TypeScript strict mode is enabled
- ESLint with `react-hooks` and `react-refresh` plugins
- Tailwind CSS for all styling -- no CSS modules or styled-components
- Prefer `cn()` from `@/lib/utils` for conditional class merging
