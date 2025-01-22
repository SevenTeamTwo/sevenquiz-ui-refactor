import { assign, setup } from "xstate";

type LobbyMachineInput = {
  owner: string | null;
  players: string[];
  created: Date;
};

type LobbyMachineContext = {
  username: string;
  owner: string | null;
  players: string[];
  created: Date;
};

type LobbyMachineEvent =
  | { type: "updateLobby"; owner: string | null; players: string[]; created: Date }
  | { type: "clientJoined"; name: string }
  | { type: "clientLeft"; name: string }
  | { type: "connecting"; username: string }
  | { type: "connected" }
  | { type: "disconnect" }
  | { type: "newOwner"; name: string | null };

export const lobbyMachine = setup({
  types: {
    input: {} as LobbyMachineInput,
    context: {} as LobbyMachineContext,
    events: {} as LobbyMachineEvent,
  },
}).createMachine({
  id: "lobby",
  context: ({ input }) => ({
    username: "",
    owner: input.owner,
    players: [...input.players],
    created: input.created,
  }),
  initial: "disconnected",
  states: {
    disconnected: {
      on: {
        connecting: {
          actions: assign(({ event }) => ({
            username: event.username,
          })),
          target: "connecting",
        },
      },
    },
    connecting: {
      on: {
        connected: {
          target: "connected",
        },
      },
    },
    connected: {},
  },
  on: {
    updateLobby: {
      actions: assign({
        owner: ({ event }) => event.owner,
        players: ({ event }) => event.players,
        created: ({ event }) => event.created,
      }),
    },
    clientJoined: {
      actions: assign({
        players: ({ context, event }) => [...context.players, event.name],
      }),
    },
    clientLeft: {
      actions: assign({
        players: ({ context, event }) => context.players.filter((player) => player !== event.name),
      }),
    },
    newOwner: {
      actions: assign({
        owner: ({ event }) => event.name,
      }),
    },
    disconnect: {
      target: ".disconnected",
      actions: assign({
        username: "",
      }),
    },
  },
});
