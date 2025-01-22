import { useEffect, useRef, useState } from "react";

import { type LobbyEvent, lobbyEventSchema } from "~/lobby/events/lobby";

export function useLobbyConnection(id: string) {
  const socket = useRef<WebSocket | null>(null);
  const [initialLobby, setInitialLobby] = useState<LobbyEvent | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${window.env.websocketUrl}/lobby/${id}`);
    socket.current = ws;

    const onMessage = (event: MessageEvent) => {
      if (typeof event.data !== "string") {
        console.error("Received a non-string message", event.data);
        return;
      }

      try {
        setInitialLobby(lobbyEventSchema.parse(JSON.parse(event.data)));
        ws.removeEventListener("message", onMessage);
      } catch (error) {
        console.error(error);
      }
    };

    ws.addEventListener("message", onMessage);

    ws.addEventListener("close", () => {
      setInitialLobby(null);
    });

    return () => {
      ws.close();
    };
  }, [id]);

  return [socket.current, initialLobby] as const;
}
