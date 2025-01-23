import { PlayerList } from "~/lobby/components/player-list";
import { JoinLobbyCard } from "~/lobby/components/join-lobby-card";
import { useLobbyActor } from "~/lobby/hooks/actor";

export interface DisconnectedProps {
  lobbyId: string;
}

export function Disconnected(props: DisconnectedProps) {
  const actor = useLobbyActor();

  return (
    <div className="flex-grow grid grid-rows-2 md:grid-cols-2 md:grid-rows-1 gap-4">
      <PlayerList />
      <JoinLobbyCard code={props.lobbyId} onSubmit={(_, username) => actor.send({ type: "actionConnect", username })} />
    </div>
  );
}
