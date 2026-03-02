import { useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader } from "./components/ui/card";
import { Header } from "./components/Header";
import { TodoInput } from "./components/TodoInput";
import { TodoFilters } from "./components/TodoFilters";
import { TodoItem } from "./components/TodoItem";
import { TodoStats } from "./components/TodoStats";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { Todo, FilterType, SortType } from "./types/todo";

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
