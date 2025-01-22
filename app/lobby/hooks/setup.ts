import { useActorRef, useSelector } from "@xstate/react";
import { useEffect } from "react";

import { handleEvent } from "~/lobby/events";
import { lobbyMachine } from "~/lobby/machine";
import type { LobbyEvent } from "~/lobby/events/lobby";
import { register } from "~/lobby/actions/register";
import { retrieveUsername } from "../utils";

export function useLobbySetup(socket: WebSocket, initialLobby: LobbyEvent, id: string) {
  const actorRef = useActorRef(lobbyMachine, {
    input: initialLobby,
  });
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

    const username = retrieveUsername(id);
    if (username === null) {
      return;
    }

    register(socket, actorRef, username);
  }, [state, socket, actorRef, id]);

  return actorRef;
}
