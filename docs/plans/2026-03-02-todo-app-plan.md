# Todo Application Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a beautiful frontend-only todo application with React, shadcn/ui, and localStorage persistence, deployed to Vercel.

**Architecture:** Single-page React app with flat component structure. State managed via useState + custom useLocalStorage hook. No routing or external state management. shadcn/ui for polished UI components with dark/light theme support.

**Tech Stack:** React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, localStorage

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`

**Step 1: Scaffold Vite + React + TypeScript project**

Run:
```bash
npm create vite@latest . -- --template react-ts
```

**Step 2: Install dependencies**

Run:
```bash
npm install
```

**Step 3: Verify dev server starts**

Run:
```bash
npm run dev -- --host 0.0.0.0
```
Expected: Dev server starts on localhost, no errors.

**Step 4: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold Vite + React + TypeScript project"
```

---

### Task 2: Install and Configure Tailwind CSS + shadcn/ui

**Files:**
- Modify: `package.json`, `vite.config.ts`, `tsconfig.json`, `src/index.css`
- Create: `tailwind.config.js`, `postcss.config.js`, `components.json`, `src/lib/utils.ts`

**Step 1: Install Tailwind CSS v4 and dependencies**

Run:
```bash
npm install tailwindcss @tailwindcss/vite
```

**Step 2: Configure Vite plugin for Tailwind**

In `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**Step 3: Add Tailwind import to CSS**

Replace `src/index.css` content with:
```css
@import "tailwindcss";
```

**Step 4: Initialize shadcn/ui**

Run:
```bash
npx shadcn@latest init
```
Select: New York style, Zinc base color, CSS variables for colors.

**Step 5: Verify Tailwind works**

Update `src/App.tsx` to use a Tailwind class (e.g., `<h1 className="text-3xl font-bold">Hello</h1>`), verify it renders styled in browser.

**Step 6: Commit**

```bash
git add .
git commit -m "chore: configure Tailwind CSS and shadcn/ui"
```

---

### Task 3: Add shadcn/ui Components

**Files:**
- Create: `src/components/ui/button.tsx`, `src/components/ui/input.tsx`, `src/components/ui/card.tsx`, `src/components/ui/checkbox.tsx`, `src/components/ui/select.tsx`, `src/components/ui/badge.tsx`, `src/components/ui/dropdown-menu.tsx`, `src/components/ui/popover.tsx`, `src/components/ui/calendar.tsx`

**Step 1: Install required shadcn components**

Run each:
```bash
npx shadcn@latest add button input card checkbox select badge dropdown-menu popover calendar
```

**Step 2: Verify components installed**

Check that files exist under `src/components/ui/`.

**Step 3: Commit**

```bash
git add .
git commit -m "chore: add shadcn/ui components"
```

---

### Task 4: Create Todo Types and useLocalStorage Hook

**Files:**
- Create: `src/types/todo.ts`
- Create: `src/hooks/useLocalStorage.ts`

**Step 1: Create the Todo type**

`src/types/todo.ts`:
```typescript
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  createdAt: string;
}

export type FilterType = "all" | "active" | "completed";
export type SortType = "createdAt" | "dueDate" | "priority";
```

**Step 2: Create the useLocalStorage hook**

`src/hooks/useLocalStorage.ts`:
```typescript
import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add Todo types and useLocalStorage hook"
```

---

### Task 5: Create Theme Provider

**Files:**
- Create: `src/components/ThemeProvider.tsx`
- Create: `src/hooks/useTheme.ts`

**Step 1: Create ThemeProvider context and component**

`src/components/ThemeProvider.tsx`:
```typescript
import { createContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeProviderContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeProviderContext = createContext<ThemeProviderContextProps>({
  theme: "system",
  setTheme: () => null,
});

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "todo-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
```

**Step 2: Create useTheme hook**

`src/hooks/useTheme.ts`:
```typescript
import { useContext } from "react";
import { ThemeProviderContext } from "../components/ThemeProvider";

export function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add ThemeProvider with dark/light/system support"
```

---

### Task 6: Build Header Component

**Files:**
- Create: `src/components/Header.tsx`

**Step 1: Create Header with theme toggle**

`src/components/Header.tsx`:
```typescript
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "../hooks/useTheme";

export function Header() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Todo</h1>
        <p className="text-muted-foreground text-sm">Stay organized, stay productive</p>
      </div>
      <Button variant="outline" size="icon" onClick={toggleTheme}>
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>
    </header>
  );
}
```

**Step 2: Install lucide-react if not already installed**

Run:
```bash
npm install lucide-react
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add Header component with theme toggle"
```

---

### Task 7: Build TodoInput Component

**Files:**
- Create: `src/components/TodoInput.tsx`

**Step 1: Create TodoInput form**

`src/components/TodoInput.tsx`:
```typescript
import { useState } from "react";
import { Plus, CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Todo } from "../types/todo";
import { cn } from "../lib/utils";
import { format } from "date-fns";

interface TodoInputProps {
  onAdd: (todo: Omit<Todo, "id" | "completed" | "createdAt">) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      priority,
      dueDate: dueDate ? dueDate.toISOString() : null,
    });

    setTitle("");
    setPriority("medium");
    setDueDate(undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1"
      />
      <div className="flex gap-2">
        <Select value={priority} onValueChange={(v) => setPriority(v as "low" | "medium" | "high")}>
          <SelectTrigger className="w-[110px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-[130px] justify-start text-left font-normal", !dueDate && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "MMM d") : "Due date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
          </PopoverContent>
        </Popover>
        <Button type="submit" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
```

**Step 2: Install date-fns**

Run:
```bash
npm install date-fns
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add TodoInput component with priority and due date"
```

---

### Task 8: Build TodoItem Component

**Files:**
- Create: `src/components/TodoItem.tsx`

**Step 1: Create TodoItem with edit, complete, delete**

`src/components/TodoItem.tsx`:
```typescript
import { useState } from "react";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Todo } from "../types/todo";
import { cn } from "../lib/utils";
import { format } from "date-fns";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
}

const priorityColors = {
  high: "bg-red-500/10 text-red-500 border-red-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  low: "bg-green-500/10 text-green-500 border-green-500/20",
};

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleSave = () => {
    if (editTitle.trim()) {
      onEdit(todo.id, editTitle.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg border bg-card transition-all duration-200 hover:shadow-sm group",
      todo.completed && "opacity-60"
    )}>
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="mt-0.5"
      />

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-7 text-sm"
              autoFocus
            />
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSave}>
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCancel}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn("text-sm cursor-pointer", todo.completed && "line-through text-muted-foreground")}
              onClick={() => !todo.completed && setIsEditing(true)}
            >
              {todo.title}
            </span>
            <Badge variant="outline" className={cn("text-xs", priorityColors[todo.priority])}>
              {todo.priority}
            </Badge>
            {todo.dueDate && (
              <span className="text-xs text-muted-foreground">
                {format(new Date(todo.dueDate), "MMM d")}
              </span>
            )}
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsEditing(true)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete(todo.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add TodoItem component with inline editing"
```

---

### Task 9: Build TodoFilters Component

**Files:**
- Create: `src/components/TodoFilters.tsx`

**Step 1: Create TodoFilters**

`src/components/TodoFilters.tsx`:
```typescript
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { FilterType, SortType } from "../types/todo";
import { cn } from "../lib/utils";

interface TodoFiltersProps {
  filter: FilterType;
  sort: SortType;
  onFilterChange: (filter: FilterType) => void;
  onSortChange: (sort: SortType) => void;
}

const filters: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export function TodoFilters({ filter, sort, onFilterChange, onSortChange }: TodoFiltersProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex gap-1">
        {filters.map((f) => (
          <Button
            key={f.value}
            variant={filter === f.value ? "default" : "ghost"}
            size="sm"
            onClick={() => onFilterChange(f.value)}
            className={cn("text-xs", filter !== f.value && "text-muted-foreground")}
          >
            {f.label}
          </Button>
        ))}
      </div>
      <Select value={sort} onValueChange={(v) => onSortChange(v as SortType)}>
        <SelectTrigger className="w-[140px] h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt">Date created</SelectItem>
          <SelectItem value="dueDate">Due date</SelectItem>
          <SelectItem value="priority">Priority</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add TodoFilters component"
```

---

### Task 10: Build TodoStats Component

**Files:**
- Create: `src/components/TodoStats.tsx`

**Step 1: Create TodoStats**

`src/components/TodoStats.tsx`:
```typescript
import { Todo } from "../types/todo";

interface TodoStatsProps {
  todos: Todo[];
}

export function TodoStats({ todos }: TodoStatsProps) {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const remaining = total - completed;

  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
      <span>{remaining} remaining</span>
      <span>{completed} of {total} completed</span>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add TodoStats component"
```

---

### Task 11: Assemble App Component

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

**Step 1: Wire up App.tsx with all components and state logic**

`src/App.tsx`:
```typescript
import { useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader } from "./components/ui/card";
import { Header } from "./components/Header";
import { TodoInput } from "./components/TodoInput";
import { TodoFilters } from "./components/TodoFilters";
import { TodoItem } from "./components/TodoItem";
import { TodoStats } from "./components/TodoStats";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Todo, FilterType, SortType } from "./types/todo";

function App() {
  const [todos, setTodos] = useLocalStorage<Todo[]>("todos", []);
  const [filter, setFilter] = useLocalStorage<FilterType>("todo-filter", "all");
  const [sort, setSort] = useLocalStorage<SortType>("todo-sort", "createdAt");

  const addTodo = useCallback((data: Omit<Todo, "id" | "completed" | "createdAt">) => {
    const newTodo: Todo = {
      ...data,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  }, [setTodos]);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, [setTodos]);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, [setTodos]);

  const editTodo = useCallback((id: string, title: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));
  }, [setTodos]);

  const filteredAndSortedTodos = useMemo(() => {
    let result = [...todos];

    // Filter
    if (filter === "active") result = result.filter((t) => !t.completed);
    if (filter === "completed") result = result.filter((t) => t.completed);

    // Sort
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    result.sort((a, b) => {
      if (sort === "priority") return priorityOrder[a.priority] - priorityOrder[b.priority];
      if (sort === "dueDate") {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [todos, filter, sort]);

  return (
    <div className="min-h-screen bg-background flex items-start justify-center p-4 pt-16 sm:pt-24">
      <div className="w-full max-w-xl">
        <Header />
        <Card>
          <CardHeader className="pb-3">
            <TodoInput onAdd={addTodo} />
          </CardHeader>
          <CardContent className="space-y-3">
            <TodoFilters filter={filter} sort={sort} onFilterChange={setFilter} onSortChange={setSort} />
            <div className="space-y-2">
              {filteredAndSortedTodos.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-8">
                  {filter === "all" ? "No todos yet. Add one above!" : `No ${filter} todos.`}
                </p>
              ) : (
                filteredAndSortedTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onEdit={editTodo}
                  />
                ))
              )}
            </div>
            <TodoStats todos={todos} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
```

**Step 2: Wrap main.tsx with ThemeProvider**

`src/main.tsx`:
```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./components/ThemeProvider";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system">
      <App />
    </ThemeProvider>
  </StrictMode>
);
```

**Step 3: Verify the app works**

Run:
```bash
npm run dev
```
Expected: App renders with input form, theme toggle, empty state message. Add a todo, verify it appears and persists on refresh.

**Step 4: Commit**

```bash
git add .
git commit -m "feat: assemble App with full todo functionality"
```

---

### Task 12: Polish and Final Styling

**Files:**
- Modify: `src/index.css` (add any global styles)
- Modify: `index.html` (update title, add meta tags)

**Step 1: Update index.html**

Set `<title>Todo</title>`, add meta description, set viewport.

**Step 2: Clean up default Vite styles**

Remove any leftover Vite boilerplate CSS from `src/index.css` and `src/App.css` (delete App.css if exists).

**Step 3: Build and verify**

Run:
```bash
npm run build
npm run preview
```
Expected: Production build succeeds, preview works correctly.

**Step 4: Commit**

```bash
git add .
git commit -m "chore: polish styling and clean up boilerplate"
```

---

### Task 13: Push to GitHub

**Files:** None (git operations only)

**Step 1: Create GitHub repository**

Run:
```bash
gh repo create todo --public --source=. --push
```
Expected: Repository created on GitHub, code pushed.

**Step 2: Verify**

Run:
```bash
gh repo view --web
```
Expected: Opens the repo in browser, all code visible.

---

### Task 14: Deploy to Vercel

**Files:**
- May create: `.vercel/` directory (auto-generated)

**Step 1: Install Vercel CLI if needed**

Run:
```bash
npm install -g vercel
```

**Step 2: Deploy to Vercel**

Run:
```bash
vercel --prod
```
Follow prompts: link to the project, confirm settings (Vite framework auto-detected).

Expected: Deployment succeeds, URL printed to terminal.

**Step 3: Verify deployment**

Open the URL printed by Vercel. App should work exactly as local.

---
