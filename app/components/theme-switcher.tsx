import { Theme, useTheme } from "remix-themes";

import { Moon, Sun } from "lucide-react";
import { Button } from "~/shadcn/components/button";

export function ThemeSwitcher() {
  const [theme, setTheme] = useTheme();

  const onClick = () => {
    console.log("Setting the theme to", theme === Theme.DARK ? Theme.LIGHT : Theme.DARK);
    setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK);
  };

  return (
    <Button variant="ghost" size="icon" onClick={onClick}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
