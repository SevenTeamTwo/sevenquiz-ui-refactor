import { useSelector } from "@xstate/react";

import { JoinLobbyCard } from "~/lobby/components/join-lobby-card";
import { PlayerList } from "~/lobby/components/player-list";
import { SettingsCard } from "~/lobby/components/settings-card";

import type { LobbyEvent } from "~/lobby/events/lobby";
import { useLobbyActor } from "~/lobby/hooks/actor";
import { saveUsername } from "~/lobby/utils";

export interface LobbyProps {
  initialLobby: LobbyEvent;
  id: string;
}

export function Lobby(props: LobbyProps) {
  const actor = useLobbyActor(props.initialLobby, props.id);
  const state = useSelector(actor, (state) => state.value);

  return (
    <div className="flex-grow grid grid-rows-2 md:grid-cols-2 md:grid-rows-1 gap-4">
      <PlayerList actorRef={actor} onKick={() => ({})} />
      {state === "disconnected" && (
        <JoinLobbyCard
          code={props.id}
          onSubmit={(code, username) => {
            saveUsername(code, username);
            actor.send({ type: "connect", username });
          }}
        />
      )}
      {state === "connected" && <SettingsCard actorRef={actor} />}
    </div>
  );
}
