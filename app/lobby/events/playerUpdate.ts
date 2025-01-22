import type { ActorRefFrom } from "xstate";
import { z } from "zod";

import type { lobbyMachine } from "~/lobby";

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
 * @param actorRef the actor reference
 * @param event the event
 */
export function handlePlayerUpdateEvent(actorRef: ActorRefFrom<typeof lobbyMachine>, event: PlayerUpdateEvent) {
  switch (event.data.action) {
    case "join":
    case "reconnect": {
      actorRef.send({ type: "clientJoined", name: event.data.username });
      break;
    }
    case "disconnect":
    case "kick": {
      actorRef.send({ type: "clientLeft", name: event.data.username });
      break;
    }
    case "new owner": {
      actorRef.send({ type: "newOwner", name: event.data.username });
      break;
    }
    default: {
      console.error("Unhandled player update action: ", event.data.action);
    }
  }
}
