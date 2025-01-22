import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

import { connectAtom, disconnectAtom, initialLobbyAtom, statusAtom } from "~/lobby/websocket";

export function useLobbyConnection(lobbyId: string) {
  const connect = useSetAtom(connectAtom);
  const disconnect = useSetAtom(disconnectAtom);
  const initialLobby = useAtomValue(initialLobbyAtom);
  const status = useAtomValue(statusAtom);

  useEffect(() => {
    connect({ id: lobbyId });
    return disconnect;
  }, [connect, disconnect, lobbyId]);

  return { status, initialLobby } as const;
}
