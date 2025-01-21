import { useActorRef } from "@xstate/react";

import { useWebSocketSetup, type LobbyEvent } from "~/websocket";
import { lobbyMachine } from "~/lobby";
import { PlayerList } from "~/components/player-list";

import { useEffect } from "react";

export interface LobbyProps {
  socket: WebSocket;
  lobby: LobbyEvent;
}

export function Lobby(props: LobbyProps) {
  const actorRef = useActorRef(lobbyMachine, {
    input: {
      created: props.lobby.data.created,
      players: props.lobby.data.playerList,
      owner: props.lobby.data.owner,
    },
  });
  // useWebSocketSetup(props.socket, actorRef);

  useEffect(() => {
    console.log("[Lobby] props.lobby changed", props.lobby);
  }, [props.lobby]);

  return (
    <div className="flex-grow grid grid-rows-2 md:grid-cols-2 md:grid-rows-1 gap-4">
      <PlayerList actorRef={actorRef} />
    </div>
  );
}
