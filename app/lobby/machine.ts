import { assign, setup } from "xstate";

import type { LobbyEvent } from "./events/lobby";

type LobbyMachineInput = LobbyEvent;

type LobbyMachineContext = {
  username: string;
  created: Date;
  owner: string | null;
  players: string[];
  maxPlayers: number;
  quizzes: string[];
  currentQuiz: string;
};

type LobbyMachineEvent =
  | {
      type: "updateLobby";
      created: Date;
      owner: string | null;
      players: string[];
      maxPlayers: number;
      quizzes: string[];
      currentQuiz: string;
    }
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
    owner: input.data.owner,
    players: input.data.playerList,
    maxPlayers: input.data.maxPlayers,
    quizzes: input.data.quizzes,
    currentQuiz: input.data.currentQuiz,
    created: input.data.created,
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
        created: ({ event }) => event.created,
        owner: ({ event }) => event.owner,
        players: ({ event }) => event.players,
        maxPlayers: ({ event }) => event.maxPlayers,
        quizzes: ({ event }) => event.quizzes,
        currentQuiz: ({ event }) => event.currentQuiz,
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
