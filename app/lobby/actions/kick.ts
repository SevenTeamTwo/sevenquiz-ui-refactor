export function kick(socket: WebSocket, username: string) {
  socket.send(
    JSON.stringify({
      type: "kick",
      data: { username },
    }),
  );
}
