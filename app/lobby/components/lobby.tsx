import { useSelector } from "@xstate/react";

import { JoinLobbyCard } from "~/lobby/components/join-lobby-card";
import { PlayerList } from "~/lobby/components/player-list";
import type { LobbyEvent } from "~/lobby/events/lobby";
import { useLobbySetup } from "~/lobby/hooks/setup";
import { register } from "~/lobby/actions/register";
import { saveUsername } from "~/lobby/utils";
import { kick } from "../actions/kick";

export interface LobbyProps {
  socket: WebSocket;
  initialLobby: LobbyEvent;
  id: string;
}

export function Lobby(props: LobbyProps) {
  const actorRef = useLobbySetup(props.socket, props.initialLobby, props.id);
  const state = useSelector(actorRef, (state) => state.value);

  return (
    <div className="flex-grow grid grid-rows-2 md:grid-cols-2 md:grid-rows-1 gap-4">
      <PlayerList actorRef={actorRef} onKick={(player) => kick(props.socket, player)} />
      {state === "disconnected" && (
        <JoinLobbyCard
          code={props.id}
          onSubmit={(username) => {
            saveUsername(props.id, username);
            register(props.socket, actorRef, username);
          }}
        />
      )}
    </div>
  );
}
