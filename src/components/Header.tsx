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
