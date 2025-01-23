import { useSelector } from "@xstate/react";
import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { adventurerNeutral } from "@dicebear/collection";
import sr from "seedrandom";

import { Input } from "~/shadcn/components/input";
import { Card } from "~/shadcn/components/card";
import { Button } from "~/shadcn/components/button";
import { useLobbyActor } from "~/lobby/hooks/actor";
import { DESCRIPTIONS } from "~/lobby/constants";
import { CheckIcon, XIcon } from "lucide-react";
import { Separator } from "~/shadcn/components/separator";

export function Reviewing() {
  const actor = useLobbyActor();
  const created = useSelector(actor, (state) => state.context.created);

  const player = "Adam";
  const playerDetails = useMemo(
    () => ({
      description: DESCRIPTIONS[Math.abs(sr(`${created.toISOString()}-${player}`).int32()) % DESCRIPTIONS.length],
      avatar: createAvatar(adventurerNeutral, { seed: `${created.toISOString()}-${player}` }).toDataUri(),
    }),
    [created],
  );

  return (
    <div className="flex-grow grid grid-rows-[1fr,1fr] place-items-center gap-2 md:gap-6 p-6">
      <div className="text-center space-y-4">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight">Quel est la capitale de la France ?</h2>
        <Separator />
        <div>
          <p className="scroll-m-20 text-lg font-medium tracking-tight text-muted-foreground">
            La réponse attendue était
          </p>
          <p className="text-4xl font-bold">Paris</p>
        </div>
      </div>

      <Card key={player} className="p-4 space-y-4 w-full max-w-xl self-start">
        <div className="flex items-center space-x-4">
          <img className="h-12 aspect-square rounded-full" src={playerDetails.avatar} alt={player} />
          <div className="flex-grow flex flex-col justify-center">
            <p className="font-semibold">{player}</p>
            <p className="text-sm text-muted-foreground">{playerDetails.description}</p>
          </div>
        </div>
        <Input
          value="Paris"
          className="max-w-xl px-4 py-6 text-xl disabled:opacity-80  md:text-lg font-semibold"
          disabled={true}
        />
        <div className="flex gap-x-4">
          <Button variant="default" className="flex-grow h-12">
            <CheckIcon />
          </Button>
          <Button variant="destructive" className="flex-grow h-12">
            <XIcon />
          </Button>
        </div>
      </Card>
    </div>
  );
}
