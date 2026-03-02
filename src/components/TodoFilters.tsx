import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { FilterType, SortType } from "../types/todo";
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
