import { useActorRef, useSelector } from "@xstate/react";
import type { SendJsonMessage, WebSocketLike } from "react-use-websocket/dist/lib/types";

import { lobbyMachine } from "~/lobby";
import { PlayerList } from "~/components/player-list";
import type { LobbyEvent } from "~/events/lobby";
import { useWebSocketSetup } from "~/websocket";
import { JoinLobbyCard } from "./join-lobby-card";

export interface LobbyProps {
  socket: WebSocketLike;
  lobby: LobbyEvent;
  id: string;
  sendJsonMessage: SendJsonMessage;
}

export function Lobby(props: LobbyProps) {
  const actorRef = useActorRef(lobbyMachine, {
    input: {
      created: props.lobby.data.created,
      players: props.lobby.data.playerList,
      owner: props.lobby.data.owner,
    },
  });
  useWebSocketSetup(props.socket, props.sendJsonMessage, actorRef);
  const state = useSelector(actorRef, (state) => state.value);

  return (
    <div className="flex-grow grid grid-rows-2 md:grid-cols-2 md:grid-rows-1 gap-4">
      <PlayerList actorRef={actorRef} />
      {state === "disconnected" && (
        <JoinLobbyCard
          code={props.id}
          onSubmit={(username) => {
            localStorage.setItem("username", username);
            props.sendJsonMessage({ type: "register", data: { username } });
            actorRef.send({ type: "connecting", username });
          }}
        />
      )}
    </div>
  );
}
