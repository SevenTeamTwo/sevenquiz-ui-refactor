import { Link, useParams } from "react-router";

import { ThemeSwitcher } from "~/components/theme-switcher";
import { WebSocketIndicator } from "~/lobby/components/websocket-indicator";

export function Header() {
  const params = useParams();

  return (
    <header className="sticky top-0 z-10 border-b bg-background/75 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 h-16 flex items-center">
        <Link to="/" className="font-bold text-xl">
          <h1>SevenQuiz</h1>
        </Link>
        <div className="flex-grow flex justify-end space-x-4">
          <WebSocketIndicator key={params.id} />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
