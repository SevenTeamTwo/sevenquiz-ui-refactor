import { atom, createStore } from "jotai";

import { type LobbyEvent, lobbyEventSchema } from "~/lobby/events/lobby";

export type SocketStatus = "unconnected" | "connecting" | "connected" | "disconnected";

interface SocketContext {
  socket: WebSocket;
  abortController: AbortController;
  lobbyId: string;
  state: Exclude<SocketStatus, "unconnected">;
  initialLobby: LobbyEvent | null;
  callbacks: ((message: unknown) => void)[];
}

export const store = createStore();

const socketContextAtom = atom<SocketContext | null>(null);

const updateSocketContext = atom(
  null,
  (_, set, update: Partial<SocketContext> | ((ctx: SocketContext) => Partial<SocketContext>)) => {
    if (typeof update === "function") {
      set(socketContextAtom, (prev) => (prev === null ? null : { ...prev, ...update(prev) }));
    } else {
      set(socketContextAtom, (prev) => (prev === null ? null : { ...prev, ...update }));
    }
  },
);

export const connectAtom = atom(null, (get, set, update: { id: string }) => {
  const current = get(socketContextAtom);

  if (current !== null) {
    if (current.lobbyId === update.id && current.state !== "disconnected") {
      return;
    }

    set(disconnectAtom);
  }

  const socket = new WebSocket(`${window.env.websocketUrl}/lobby/${update.id}`);
  const abortController = new AbortController();
  let receivedInitialLobby = false;

  socket.addEventListener("open", () => set(updateSocketContext, { state: "connected" }), {
    signal: abortController.signal,
  });
  socket.addEventListener("close", () => set(updateSocketContext, { state: "disconnected", initialLobby: null }), {
    signal: abortController.signal,
  });
  socket.addEventListener(
    "message",
    (event) => {
      if (typeof event.data !== "string") {
        return;
      }

      try {
        const message = JSON.parse(event.data);
        set(receiveAtom, message);

        if (!receivedInitialLobby) {
          set(updateSocketContext, { initialLobby: lobbyEventSchema.parse(message) });
          receivedInitialLobby = true;
        }
      } catch (error) {
        console.error(error);
      }
    },
    { signal: abortController.signal },
  );

  set(socketContextAtom, {
    socket,
    abortController,
    lobbyId: update.id,
    state: "connecting",
    initialLobby: null,
    callbacks: [],
  });
});

export const disconnectAtom = atom(null, (get, set) => {
  const current = get(socketContextAtom);
  if (current !== null) {
    current.abortController.abort();

    if (current.state === "connected") {
      current.socket.close();
    }
  }
  set(socketContextAtom, null);
});

export const statusAtom = atom((get) => get(socketContextAtom)?.state ?? "unconnected");

export const lobbyIdAtom = atom((get) => get(socketContextAtom)?.lobbyId ?? null);

export const initialLobbyAtom = atom((get) => get(socketContextAtom)?.initialLobby ?? null);

export const addCallbackAtom = atom(null, (_, set, update: (message: unknown) => void) =>
  set(updateSocketContext, (prev) => ({
    callbacks: [...prev.callbacks, update],
  })),
);

export const removeCallbackAtom = atom(null, (_, set, update: (message: unknown) => void) =>
  set(updateSocketContext, (prev) => ({
    callbacks: prev.callbacks.filter((callback) => callback !== update),
  })),
);

export const sendAtom = atom(null, (get, _, update: unknown) => {
  const current = get(socketContextAtom);
  if (current !== null && current.state === "connected") {
    current.socket.send(JSON.stringify(update));
  }
});

export const receiveAtom = atom(null, (get, _, update: unknown) => {
  const current = get(socketContextAtom);
  if (current !== null && current.state === "connected") {
    for (const callback of current.callbacks) {
      callback(update);
    }
  }
});
