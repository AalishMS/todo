import type { Todo } from "../types/todo";

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
