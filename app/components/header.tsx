import { Link, useParams } from "react-router";

import { SevenLogo } from "~/components//logo";
import { ThemeSwitcher } from "~/components/theme-switcher";
import { WebSocketIndicator } from "~/lobby/components/websocket-indicator";
import { Badge } from "~/shadcn/components/badge";

export function Header() {
  const params = useParams();

  return (
    <header className="sticky top-0 z-10 border-b bg-background/75 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 h-16 flex items-center">
        <Link to="/" className="font-bold text-xl flex items-center italic">
          <SevenLogo className="h-8 w-8" />
          <h1 className="font-title ml-1">Seven</h1>
          <Badge className="ml-3 bg-gradient-to-br text-sm font-bold from-blue-600 to-green-500 text-white shadow-xl rounded-xl border-small border-white/50 not-italic">
            Quiz
          </Badge>
        </Link>
        <div className="flex-grow flex justify-end space-x-4">
          <WebSocketIndicator key={params.id} />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
