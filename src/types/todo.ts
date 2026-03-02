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
