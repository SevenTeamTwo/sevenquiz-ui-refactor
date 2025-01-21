import { useEffect, useRef, useState } from "react";
import type { ActorRefFrom } from "xstate";
import { useSelector } from "@xstate/react";

import type { lobbyMachine } from "./lobby";
import { handleEvent } from "./events";
import { lobbyEventSchema, type LobbyEvent } from "./events/lobby";

export function useWebSocket(id: string) {
  const socket = useRef<WebSocket | null>(null);
  const [lobby, setLobby] = useState<LobbyEvent | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${window.env.websocketUrl}/lobby/${id}`);
    socket.current = ws;

    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data !== "string") {
        console.error("Received a non-string message", event.data);
        return;
      }

      try {
        setLobby(lobbyEventSchema.parse(JSON.parse(event.data)));
        console.log("[useWebSocket] lobby changed", JSON.parse(event.data));
        ws.removeEventListener("message", handleMessage);
      } catch (error) {
        console.error(error);
      }
    };
    ws.addEventListener("message", handleMessage);

    ws.onopen = () => {
      console.log("[useWebSocket] connected");
    };

    ws.onclose = () => {
      console.log("[useWebSocket] disconnected");
    };

    return () => {
      ws.removeEventListener("message", handleMessage);
      ws.close();
    };
  }, [id]);

  return [socket.current, lobby] as const;
}

export function useWebSocketSetup(socket: WebSocket, actorRef: ActorRefFrom<typeof lobbyMachine>) {
  const state = useSelector(actorRef, (state) => state.value);

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (typeof event.data !== "string") {
        console.error("Received a non-string message", event.data);
        return;
      }

      try {
        const message = JSON.parse(event.data);
        handleEvent(actorRef, message);
      } catch (error) {
        console.error(error);
      }
    };
    socket.addEventListener("message", listener);

    return () => {
      socket.removeEventListener("message", listener);
    };
  }, [socket, actorRef]);

  useEffect(() => {
    if (state !== "disconnected") {
      return;
    }

    const username = localStorage.getItem("username");
    if (username === null) {
      return;
    }

    console.log("[useWebSocketSetup] registering", username);
    socket.send(
      JSON.stringify({
        type: "register",
        data: { username },
      }),
    );
    actorRef.send({ type: "connecting", username: username });
  }, [socket, state, actorRef]);
}
