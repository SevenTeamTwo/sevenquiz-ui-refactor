import { useActorRef, useSelector } from "@xstate/react";
import { useEffect } from "react";
import { useSetAtom } from "jotai";

import { lobbyMachine } from "~/lobby/machine";
import { retrieveUsername } from "~/lobby/utils";
import { handleEvent } from "~/lobby/events";
import type { LobbyEvent } from "~/lobby/events/lobby";
import { setCallbackAtom } from "~/lobby/websocket";

export function useLobbyActor(initialLobby: LobbyEvent, id: string) {
  const actor = useActorRef(lobbyMachine, { input: initialLobby });
  const state = useSelector(actor, (state) => state.value);
  const setCallback = useSetAtom(setCallbackAtom);

  useEffect(() => {
    setCallback((message) => {
      handleEvent(actor, message);
    });
    return () => setCallback(null);
  }, [actor, setCallback]);

  useEffect(() => {
    if (state !== "disconnected") {
      return;
    }

    const username = retrieveUsername(id);
    if (username !== null) {
      actor.send({ type: "connect", username });
    }
  });

  return actor;
}
