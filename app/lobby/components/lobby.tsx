import { useSelector } from "@xstate/react";
import type { ActorRefFrom, StateValueFrom } from "xstate";

import type { lobbyMachine } from "~/lobby/machine";
import type { LobbyEvent } from "~/lobby/events/lobby";
import { useLobbyActor } from "~/lobby/hooks/actor";

import { Disconnected } from "~/lobby/states/disconnected";
import { Connecting } from "~/lobby/states/connecting";
import { Configuring } from "~/lobby/states/configuring";

export interface LobbyProps {
  initialLobby: LobbyEvent;
  id: string;
}

type States = Record<
  StateValueFrom<typeof lobbyMachine>,
  (args: { actor: ActorRefFrom<typeof lobbyMachine>; lobbyId: string }) => React.ReactNode
>;

const states = {
  disconnected: (args) => <Disconnected {...args} />,
  connecting: (args) => <Connecting {...args} />,
  configuring: (args) => <Configuring {...args} />,
} as const satisfies States;

export function Lobby(props: LobbyProps) {
  const actor = useLobbyActor(props.initialLobby, props.id);
  const state = useSelector(actor, (state) => state.value);
  return states[state]({ actor, lobbyId: props.id });
}
