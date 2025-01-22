import type { ActorRefFrom } from "xstate";
import { z } from "zod";

import type { lobbyMachine } from "~/lobby/machine";

/**
 * PlayerUpdate event schema
 */
export const playerUpdateEventSchema = z.object({
  type: z.literal("playerUpdate"),
  data: z.object({
    username: z.string(),
    action: z.union([
      z.literal("join"),
      z.literal("disconnect"),
      z.literal("reconnect"),
      z.literal("new owner"),
      z.literal("kick"),
    ]),
  }),
});

/**
 * Type of a register event
 */
export type PlayerUpdateEvent = z.infer<typeof playerUpdateEventSchema>;

/**
 * Handle a player update event
 *
 * @param actor the actor
 * @param event the event
 */
export function handlePlayerUpdateEvent(actor: ActorRefFrom<typeof lobbyMachine>, event: PlayerUpdateEvent) {
  switch (event.data.action) {
    case "join":
    case "reconnect": {
      actor.send({ type: "eventPlayerJoined", name: event.data.username });
      break;
    }
    case "disconnect":
    case "kick": {
      actor.send({ type: "eventPlayerLeft", name: event.data.username });
      break;
    }
    case "new owner": {
      actor.send({ type: "eventNewOwner", name: event.data.username });
      break;
    }
    default: {
      console.error("Unhandled player update action: ", event.data.action);
    }
  }
}
