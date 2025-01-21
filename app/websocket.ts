import { useEffect } from "react";
import type { ActorRefFrom } from "xstate";
import { useSelector } from "@xstate/react";
import type { SendJsonMessage, WebSocketLike } from "react-use-websocket/dist/lib/types";

import type { lobbyMachine } from "./lobby";
import { handleEvent } from "./events";

export function useWebSocketSetup(
  socket: WebSocketLike,
  sendJsonMessage: SendJsonMessage,
  actorRef: ActorRefFrom<typeof lobbyMachine>,
) {
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
    socket.addEventListener("message", listener as EventListener);

    return () => {
      socket.removeEventListener("message", listener as EventListener);
    };
  }, [socket, actorRef]);

  useEffect(() => {
    console.log("Current state", state);
    if (state !== "disconnected") {
      return;
    }

    const username = localStorage.getItem("username");
    if (username === null) {
      return;
    }

    sendJsonMessage({
      type: "register",
      data: { username },
    });
    actorRef.send({ type: "connecting", username: username });
  }, [sendJsonMessage, state, actorRef]);
}
