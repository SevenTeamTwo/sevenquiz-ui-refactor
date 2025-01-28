import { z } from "zod";

import type { QuizActor } from "@seven/quiz-state";

import { handleEventLobby, lobbyEventSchema } from "./events/lobby.ts";

/**
 * List of event types
 */
const eventTypes = ["lobby"] as const;

/**
 * Base event schema
 */
const eventSchema = z.object({
  type: z.enum(eventTypes),
});

/**
 * Type of event handlers
 */
type EventHandlers = {
  [K in (typeof eventTypes)[number]]: (actor: QuizActor, event: unknown) => void;
};

/**
 * Event handlers
 */
const handlers = {
  lobby: (actor, event) => handleEventLobby(actor, lobbyEventSchema.parse(event)),
} as const satisfies EventHandlers;

/**
 * Handle an event
 *
 * @param actor the actor
 * @param event the event
 */
export function handleEvent(actor: QuizActor, event: unknown) {
  const { type } = eventSchema.parse(event);
  handlers[type](actor, event);
}
