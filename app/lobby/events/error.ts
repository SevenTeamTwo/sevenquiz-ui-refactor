import type { ActorRefFrom } from "xstate";
import { z } from "zod";

import type { lobbyMachine } from "~/lobby/machine";

/**
 * Error event schema
 */
export const errorEventSchema = z.object({
  type: z.literal("error"),
  data: z.object({
    code: z.number(),
    message: z.string(),
    extra: z.unknown().optional(),
  }),
});

/**
 * Type of an error event
 */
export type ErrorEvent = z.infer<typeof errorEventSchema>;

/**
 * Handle an error event
 *
 * @param actorRef the actor reference
 * @param event the event
 */
export function handleErrorEvent(_actorRef: ActorRefFrom<typeof lobbyMachine>, event: ErrorEvent) {
  console.error("Error: ", event.data);
}
