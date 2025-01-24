import { useSelector } from "@xstate/react";
import type { StateValueFrom } from "xstate";

import { type lobbyMachine, LobbyContext } from "~/lobby/machine";
import type { LobbyEvent } from "~/lobby/events/lobby";
import { useLobbyActorSetup } from "~/lobby/hooks/actor";
import { useLobbyNotification } from "~/lobby/hooks/notification";

import { Disconnected } from "~/lobby/states/disconnected";
import { Connecting } from "~/lobby/states/connecting";
import { Configuring } from "~/lobby/states/configuring";
import { Playing } from "~/lobby/states/playing";
import { Reviewing } from "~/lobby/states/reviewing";
import { Results } from "~/lobby/states/results";

export interface LobbyProps {
  initialLobby: LobbyEvent;
  id: string;
}

type States = Record<StateValueFrom<typeof lobbyMachine>, (args: { lobbyId: string }) => React.ReactNode>;

const states = {
  disconnected: (args) => <Disconnected lobbyId={args.lobbyId} />,
  connecting: () => <Connecting />,
  configuring: () => <Configuring />,
  playing: () => <Playing />,
  reviewing: () => <Reviewing />,
  results: () => <Results />,
} as const satisfies States;

export function Lobby(props: LobbyProps) {
  const actor = useLobbyActorSetup(props.initialLobby, props.id);
  const state = useSelector(actor, (state) => state.value);
  useLobbyNotification(actor);

  return <LobbyContext value={actor}>{states[state]({ lobbyId: props.id })}</LobbyContext>;
}
