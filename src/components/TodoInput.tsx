import { useState } from "react";
import { Plus, CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import type { Todo } from "../types/todo";
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
