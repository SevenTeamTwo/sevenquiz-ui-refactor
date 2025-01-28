import { assign, setup, emit, type ActorRefFrom } from "xstate";

import type { QuizContext, QuizLobby } from "./context.ts";
import type { QuizEvent } from "./events.ts";
import type { QuizEmitted } from "./emitted.ts";

export const quizMachine = setup({
  types: {
    input: {} as QuizLobby,
    context: {} as QuizContext,
    events: {} as QuizEvent,
    emitted: {} as QuizEmitted,
  },
}).createMachine({
  id: "@seven/quiz",
  context: ({ input }) => ({
    name: "",
    created: input.created,
    owner: input.owner,
    players: input.players,
    maxPlayers: input.maxPlayers,
    quizzes: input.quizzes,
    currentQuiz: input.currentQuiz,
    currentQuestion: null,
    currentReview: null,
    results: null,
  }),
  initial: "unregistered",
  states: {
    unregistered: {
      on: {
        registered: {
          target: "configuring",
        },
      },
    },
    configuring: {
      on: {
        configure: {
          actions: assign({
            currentQuiz: ({ event }) => event.quiz,
          }),
        },
        start: {
          target: "playing",
        },
      },
    },
    playing: {
      on: {
        question: {
          actions: assign({
            currentQuestion: ({ event }) => event.question,
          }),
        },
        review: {
          actions: assign({
            currentQuestion: null,
            currentReview: ({ event }) => event.review,
          }),
          target: "reviewing",
        },
      },
    },
    reviewing: {
      on: {
        review: {
          actions: assign({
            currentReview: ({ event }) => event.review,
          }),
        },
        results: {
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
    playerJoined: {
      actions: [
        assign({
          players: ({ context, event }) => [...context.players, event.name],
        }),
        emit(({ event }) => ({ type: "playerJoined", name: event.name })),
      ],
    },
    playerLeft: {
      actions: [
        assign({
          players: ({ context, event }) => context.players.filter((player) => player !== event.name),
        }),
        emit(({ event }) => ({ type: "playerLeft", name: event.name })),
      ],
    },
    ownerChanged: {
      actions: [
        assign({
          owner: ({ event }) => event.name,
        }),
        emit(({ event }) => ({ type: "ownerChanged", name: event.name })),
      ],
    },
  },
});

/**
 * Type of an actor reference for the quiz machine.
 */
export type QuizActor = ActorRefFrom<typeof quizMachine>;
