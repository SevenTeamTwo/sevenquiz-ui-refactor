import type { ActorRefFrom } from "xstate";

import type { lobbyMachine } from "~/lobby/machine";
import { PlayerList } from "~/lobby/components/player-list";
import { JoinLobbyCard } from "~/lobby/components/join-lobby-card";

export interface DisconnectedProps {
  actor: ActorRefFrom<typeof lobbyMachine>;
  lobbyId: string;
}

export function Disconnected(props: DisconnectedProps) {
  return (
    <div className="flex-grow grid grid-rows-2 md:grid-cols-2 md:grid-rows-1 gap-4">
      <PlayerList actor={props.actor} />
      <JoinLobbyCard
        code={props.lobbyId}
        onSubmit={(_, username) => props.actor.send({ type: "actionConnect", username })}
      />
    </div>
  );
}
