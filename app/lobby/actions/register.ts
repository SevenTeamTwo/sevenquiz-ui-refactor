import type { ActorRefFrom } from "xstate";

import type { lobbyMachine } from "~/lobby/machine";

export function register(socket: WebSocket, actorRef: ActorRefFrom<typeof lobbyMachine>, username: string) {
  socket.send(
    JSON.stringify({
      type: "register",
      data: { username },
    }),
  );
  actorRef.send({ type: "connecting", username: username });
}
