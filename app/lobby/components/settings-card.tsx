import type { ActorRefFrom } from "xstate";
import { useSelector } from "@xstate/react";

import { Label } from "~/shadcn/components/label";
import { Card, CardContent, CardFooter, CardHeader } from "~/shadcn/components/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/shadcn/components/select";
import { Input } from "~/shadcn/components/input";
import type { lobbyMachine } from "~/lobby/machine";
import { Button } from "~/shadcn/components/button";

export interface SettingsCardProps {
  actor: ActorRefFrom<typeof lobbyMachine>;
}

export function SettingsCard(props: SettingsCardProps) {
  const lobby = useSelector(props.actor, (state) => state.context);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <h2 className="font-semibold tracking-wide text-xl">Paramètres de la partie</h2>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <Label className="mb-1 font-semibold">Quiz</Label>
        <Select
          value={lobby.currentQuiz}
          disabled={lobby.owner !== lobby.username}
          onValueChange={(value) => props.actor.send({ type: "actionConfigure", quiz: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Quiz" />
          </SelectTrigger>
          <SelectContent>
            {lobby.quizzes.map((quiz) => (
              <SelectItem key={quiz} value={quiz}>
                {quiz}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Label className="mt-4 mb-1 font-semibold">Nombre maximum de joueurs</Label>
        <Input type="text" value={lobby.maxPlayers} disabled={true} className="border rounded px-2 py-1" />
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={lobby.owner !== lobby.username}
          onClick={() => props.actor.send({ type: "actionStart" })}
        >
          Commencer la partie
        </Button>
      </CardFooter>
    </Card>
  );
}
