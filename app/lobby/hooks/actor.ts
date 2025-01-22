import { useActorRef, useSelector } from "@xstate/react";
import { useEffect } from "react";
import { useSetAtom } from "jotai";

import { lobbyMachine } from "~/lobby/machine";
import { removeUsername, retrieveUsername } from "~/lobby/utils";
import { handleEvent } from "~/lobby/events";
import type { LobbyEvent } from "~/lobby/events/lobby";
import { addCallbackAtom, removeCallbackAtom } from "~/lobby/websocket";

export function useLobbyActor(initialLobby: LobbyEvent, id: string) {
  const actor = useActorRef(lobbyMachine, { input: initialLobby });
  const state = useSelector(actor, (state) => state.value);
  const addCallback = useSetAtom(addCallbackAtom);
  const removeCallback = useSetAtom(removeCallbackAtom);

  useEffect(() => {
    const cb = (message: unknown) => handleEvent(actor, message);
    addCallback(cb);
    return () => removeCallback(cb);
  }, [actor, addCallback, removeCallback]);

  useEffect(() => {
    if (state !== "disconnected") {
      return;
    }

    const username = retrieveUsername(id);
    if (username !== null) {
      removeUsername(id);
      actor.send({ type: "actionConnect", username });
    }
  });

  return actor;
}
