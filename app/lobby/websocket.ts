import { atom, createStore } from "jotai";

import { type LobbyEvent, lobbyEventSchema } from "~/lobby/events/lobby";

interface SocketContext {
  socket: WebSocket;
  abortController: AbortController;
  lobbyId: string;
  state: "connecting" | "connected";
  initialLobby: LobbyEvent | null;
  callback: ((message: unknown) => void) | null;
}

export const store = createStore();

const socketContextAtom = atom<SocketContext | null>(null);

const updateSocketContext = atom(null, (_, set, update: Partial<SocketContext>) => {
  set(socketContextAtom, (prev) => (prev === null ? null : { ...prev, ...update }));
});

export const connectAtom = atom(null, (get, set, update: { id: string }) => {
  const current = get(socketContextAtom);

  if (current !== null) {
    if (current.lobbyId === update.id) {
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
  socket.addEventListener("close", () => set(socketContextAtom, null), {
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
        get(socketContextAtom)?.callback?.(message);

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
    callback: null,
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

export const statusAtom = atom((get) => get(socketContextAtom)?.state ?? "disconnected");

export const lobbyIdAtom = atom((get) => get(socketContextAtom)?.lobbyId ?? null);

export const initialLobbyAtom = atom((get) => get(socketContextAtom)?.initialLobby ?? null);

export const setCallbackAtom = atom(null, (_, set, update: ((message: unknown) => void) | null) =>
  set(updateSocketContext, { callback: update }),
);

export const sendAtom = atom(null, (get, _, update: unknown) => {
  const current = get(socketContextAtom);
  if (current !== null && current.state === "connected") {
    current.socket.send(JSON.stringify(update));
  }
});
