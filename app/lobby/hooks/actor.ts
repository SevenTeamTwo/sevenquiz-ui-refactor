import { useActorRef, useSelector } from "@xstate/react";
import { useEffect, useContext } from "react";
import { useSetAtom } from "jotai";

import { lobbyMachine, LobbyContext } from "~/lobby/machine";
import { removeUsername, retrieveUsername } from "~/lobby/utils";
import { handleEvent } from "~/lobby/events";
import type { LobbyEvent } from "~/lobby/events/lobby";
import { addCallbackAtom, gameStateAtom, removeCallbackAtom } from "~/lobby/websocket";

export function useLobbyActorSetup(initialLobby: LobbyEvent, id: string) {
  const actor = useActorRef(lobbyMachine, { input: initialLobby });
  const state = useSelector(actor, (state) => state.value);
  const addCallback = useSetAtom(addCallbackAtom);
  const removeCallback = useSetAtom(removeCallbackAtom);
  const setGameState = useSetAtom(gameStateAtom);

  useEffect(() => {
    setGameState(state);
    return () => setGameState("disconnected");
  }, [state, setGameState]);

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

export function useLobbyActor() {
  const actor = useContext(LobbyContext);

  if (actor === undefined) {
    throw new Error("useLobbyActor must be used within a LobbyContext.Provider");
  }

  return actor;
}
