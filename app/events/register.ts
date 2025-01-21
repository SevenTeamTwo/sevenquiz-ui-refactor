import type { ActorRefFrom } from "xstate";
import { z } from "zod";

import type { lobbyMachine } from "~/lobby";

/**
 * Register event schema
 */
export const registerEventSchema = z.object({
  type: z.literal("register"),
});

/**
 * Type of a register event
 */
export type RegisterEvent = z.infer<typeof registerEventSchema>;

/**
 * Handle a register event
 *
 * @param actorRef the actor reference
 * @param event the event
 */
export function handleRegisterEvent(actorRef: ActorRefFrom<typeof lobbyMachine>, _event: RegisterEvent) {
  actorRef.send({ type: "connected" });
}
