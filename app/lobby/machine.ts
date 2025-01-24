import { createContext } from "react";
import { assign, emit, setup, type ActorRefFrom } from "xstate";

import type { LobbyEvent } from "./events/lobby";
import { sendAtom, store } from "./websocket";

type LobbyMachineInput = LobbyEvent;

export type Question = {
  id: number;
  type: "text";
  title: string;
  duration: number;
};

export type Review = {
  question: Question & {
    answer: string;
  };
  player: string;
  answer: string;
};

type LobbyMachineContext = {
  username: string;
  created: Date;
  owner: string | null;
  players: string[];
  maxPlayers: number;
  quizzes: string[];
  currentQuiz: string;
  currentQuestion: Question | null;
  currentReview: Review | null;
  results: Record<string, number> | null;
};

type LobbyMachineEvent =
  | ({ type: "eventUpdateLobby" } & Pick<
      LobbyMachineContext,
      "created" | "owner" | "players" | "maxPlayers" | "quizzes" | "currentQuiz"
    >)
  | { type: "eventPlayerJoined"; name: string }
  | { type: "eventPlayerLeft"; name: string }
  | { type: "eventNewOwner"; name: string | null }
  | { type: "eventRegistered" }
  | { type: "eventConfigure"; quiz: string }
  | { type: "eventStart" }
  | { type: "eventReview"; review: Review }
  | { type: "eventQuestion"; question: Question }
  | { type: "eventResults"; results: Record<string, number> }
  | { type: "actionConnect"; username: string }
  | { type: "actionKick"; username: string }
  | { type: "actionConfigure"; quiz: string }
  | { type: "actionStart" }
  | { type: "actionAnswerText"; answer: string }
  | { type: "actionReview"; validate: boolean };

type LobbyMachineEmitted =
  | { type: "playerJoined"; username: string }
  | { type: "playerLeft"; username: string }
  | { type: "newOwner"; username: string | null };

export const lobbyMachine = setup({
  types: {
    input: {} as LobbyMachineInput,
    context: {} as LobbyMachineContext,
    events: {} as LobbyMachineEvent,
    emitted: {} as LobbyMachineEmitted,
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
    currentQuestion: null,
    currentReview: null,
    results: null,
  }),
  initial: "disconnected",
  states: {
    disconnected: {
      on: {
        actionConnect: {
          actions: assign(({ event }) => {
            store.set(sendAtom, { type: "register", data: { username: event.username } });
            return { username: event.username };
          }),
          target: "connecting",
        },
      },
    },
    connecting: {
      on: {
        eventRegistered: {
          target: "configuring",
        },
      },
    },
    configuring: {
      on: {
        actionKick: {
          actions: [({ event }) => store.set(sendAtom, { type: "kick", data: { username: event.username } })],
        },
        actionConfigure: {
          actions: [({ event }) => store.set(sendAtom, { type: "configure", data: { quiz: event.quiz } })],
        },
        actionStart: {
          actions: [() => store.set(sendAtom, { type: "start", data: {} })],
        },
        eventStart: {
          target: "playing",
        },
      },
    },
    playing: {
      on: {
        eventQuestion: {
          actions: assign({
            currentQuestion: ({ event }) => event.question,
          }),
        },
        eventReview: {
          actions: assign({
            currentQuestion: null,
            currentReview: ({ event }) => event.review,
          }),
          target: "reviewing",
        },
        actionAnswerText: {
          actions: [({ event }) => store.set(sendAtom, { type: "answer", data: { answer: { text: event.answer } } })],
        },
      },
    },
    reviewing: {
      on: {
        actionReview: {
          actions: [({ event }) => store.set(sendAtom, { type: "review", data: { validate: event.validate } })],
        },
        eventReview: {
          actions: assign({
            currentReview: ({ event }) => event.review,
          }),
        },
        eventResults: {
          actions: assign({
            currentReview: null,
            results: ({ event }) => event.results,
          }),
          target: "results",
        },
      },
    },
    results: {},
  },
  on: {
    eventUpdateLobby: {
      actions: assign({
        created: ({ event }) => event.created,
        owner: ({ event }) => event.owner,
        players: ({ event }) => event.players,
        maxPlayers: ({ event }) => event.maxPlayers,
        quizzes: ({ event }) => event.quizzes,
        currentQuiz: ({ event }) => event.currentQuiz,
      }),
    },
    eventPlayerJoined: {
      actions: [
        assign({
          players: ({ context, event }) => [...context.players, event.name],
        }),
        emit(({ event }) => ({ type: "playerJoined", username: event.name })),
      ],
    },
    eventPlayerLeft: {
      actions: [
        assign({
          players: ({ context, event }) => context.players.filter((player) => player !== event.name),
        }),
        emit(({ event }) => ({ type: "playerLeft", username: event.name })),
      ],
    },
    eventNewOwner: {
      actions: [
        assign({
          owner: ({ event }) => event.name,
        }),
        emit(({ event }) => ({ type: "newOwner", username: event.name })),
      ],
    },
    eventConfigure: {
      actions: assign({
        currentQuiz: ({ event }) => event.quiz,
      }),
    },
  },
});

export const LobbyContext = createContext<ActorRefFrom<typeof lobbyMachine> | undefined>(undefined);
