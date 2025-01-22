import type { ActorRefFrom } from "xstate";

import type { lobbyMachine } from "~/lobby/machine";
import { PlayerList } from "~/lobby/components/player-list";
import { SettingsCard } from "~/lobby/components/settings-card";

export interface DisconnectedProps {
  actor: ActorRefFrom<typeof lobbyMachine>;
}

export function Configuring(props: DisconnectedProps) {
  return (
    <div className="flex-grow grid grid-rows-2 md:grid-cols-2 md:grid-rows-1 gap-4">
      <PlayerList actor={props.actor} />
      <SettingsCard actor={props.actor} />
    </div>
  );
}
