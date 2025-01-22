import type { ActorRefFrom } from "xstate";
import { z } from "zod";

import type { lobbyMachine } from "~/lobby/machine";

/**
 * Lobby event schema
 */
export const lobbyEventSchema = z.object({
  type: z.literal("lobby"),
  data: z.object({
    id: z.string(),
    created: z
      .string()
      .transform((value) => new Date(value))
      .refine((value) => !Number.isNaN(value.getTime())),
    owner: z.string().nullable(),
    maxPlayers: z.number(),
    playerList: z.array(z.string()),
    quizzes: z.array(z.string()),
    currentQuiz: z.string(),
  }),
});

/**
 * Type of a lobby event
 */
export type LobbyEvent = z.infer<typeof lobbyEventSchema>;

/**
 * Handle a lobby event
 *
 * @param actor the actor
 * @param event the event
 */
export function handleLobbyEvent(actor: ActorRefFrom<typeof lobbyMachine>, event: LobbyEvent) {
  actor.send({
    type: "eventUpdateLobby",
    created: event.data.created,
    owner: event.data.owner,
    players: event.data.playerList,
    maxPlayers: event.data.maxPlayers,
    quizzes: event.data.quizzes,
    currentQuiz: event.data.currentQuiz,
  });
}
