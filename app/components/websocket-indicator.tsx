import { Link } from "react-router";
import { useAtomValue } from "jotai";

import { Button } from "~/shadcn/components/button";

import { statusAtom, lobbyIdAtom } from "~/lobby/websocket";

export function WebSocketIndicator() {
  const lobbyId = useAtomValue(lobbyIdAtom);
  const status = useAtomValue(statusAtom);

  return (
    lobbyId && (
      <Link to={`/lobby/${lobbyId}`}>
        <Button variant={status === "connected" ? "secondary" : "destructive"}>{lobbyId}</Button>
      </Link>
    )
  );
}
