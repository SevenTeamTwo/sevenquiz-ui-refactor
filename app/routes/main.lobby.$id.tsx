import { Lobby } from "~/components/lobby";
import type { Route } from "./+types/main.lobby.$id";
import { useWebSocket } from "~/websocket";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `SevenQuiz - ${params.id}` }, { name: "description", content: "Welcome to SevenQuiz!" }];
}

export default function ({ params }: Route.ComponentProps) {
  const [socket, lobby] = useWebSocket(params.id);

  if (socket !== null && lobby !== null) {
    return <Lobby socket={socket} lobby={lobby} />;
  }

  return <div>Loading...</div>;
}
