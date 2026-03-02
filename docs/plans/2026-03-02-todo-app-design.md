# Todo Application Design

**Date:** 2026-03-02
**Status:** Approved

## Overview

A frontend-only todo application with a beautiful, polished UI. No backend — all data persists in the browser via localStorage. Deployed to Vercel.

## Tech Stack

- **Framework:** React + Vite
- **Styling:** shadcn/ui + Tailwind CSS
- **Persistence:** localStorage (custom `useLocalStorage` hook)
- **Theme:** Dark + Light mode with toggle (auto-detects OS preference)
- **Deployment:** Vercel CLI
- **Source Control:** GitHub (via `gh` CLI)

## Architecture

Single-page flat architecture. All state managed with React `useState` + a custom `useLocalStorage` hook. No routing, no external state management library.

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

## Component Tree

```
App
├── ThemeProvider (dark/light, OS auto-detect)
├── Header (title + theme toggle)
├── TodoInput (form: title, priority, due date)
├── TodoFilters (filter by: all/active/completed, sort by: date/priority)
├── TodoList
│   └── TodoItem (checkbox, title, priority badge, due date, edit/delete actions)
└── TodoStats (total, completed, remaining counts)
```

## Features

### Core
- **Add:** Form with title (required), priority dropdown (default: medium), optional due date
- **Complete:** Checkbox toggle. Completed items get strikethrough styling
- **Edit:** Inline editing — click todo text to edit in place
- **Delete:** Delete button on each item

### Filtering & Sorting
- **Filter:** Toggle between All / Active / Completed
- **Sort:** By creation date, due date, or priority

### Persistence
- All todo state synced to `localStorage` via a `useLocalStorage` hook
- Data survives page refreshes and browser restarts

### Theme
- Toggle button in header switches dark/light mode
- Defaults to OS preference via `prefers-color-scheme` media query
- Theme choice persisted to localStorage

## Visual Design

- Centered card layout (max-width ~600px) on a subtle background
- shadcn/ui components: Card, Input, Button, Select, Checkbox, Badge, DropdownMenu
- Priority badges: red (high), yellow (medium), green (low)
- Smooth CSS transitions on state changes
- Fully responsive — works on mobile

## Deployment Pipeline

1. Initialize git repo, push to GitHub via `gh repo create`
2. Deploy to Vercel via `npx vercel --prod`
