import type { ActorRefFrom } from "xstate";
import { z } from "zod";

import type { lobbyMachine } from "~/lobby/machine";

/**
 * Results schema
 */
export const resultsEventSchema = z.object({
  type: z.literal("results"),
  data: z.object({
    results: z.record(z.string(), z.number()),
  }),
});

/**
 * Type of a results event
 */
export type ResultsEvent = z.infer<typeof resultsEventSchema>;

/**
 * Handle a results event
 *
 * @param actor the actor
 * @param event the event
 */
export function handleResultsEvent(actor: ActorRefFrom<typeof lobbyMachine>, event: ResultsEvent) {
  actor.send({
    type: "eventResults",
    results: event.data.results,
  });
}
