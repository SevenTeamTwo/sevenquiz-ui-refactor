import { adventurerNeutral } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { Crown, X } from "lucide-react";
import { useMemo } from "react";
import type { ActorRefFrom } from "xstate";
import { useSelector } from "@xstate/react";
import sr from "seedrandom";

import { Button } from "~/shadcn/components/button";
import { Card, CardContent, CardHeader } from "~/shadcn/components/card";

import type { lobbyMachine } from "~/lobby";
import { DESCRIPTIONS } from "~/constants";

export interface PlayerListProps {
  actorRef: ActorRefFrom<typeof lobbyMachine>;
}

export function PlayerList({ actorRef }: PlayerListProps) {
  const lobbyData = useSelector(actorRef, (state) => ({
    username: state.context.username,
    owner: state.context.owner,
    created: state.context.created,
    players: state.context.players,
  }));

  const players = useMemo(() => {
    return lobbyData.players.map((player) => {
      const seed = `${lobbyData.created.toISOString()}-${player}`;
      const description = DESCRIPTIONS[Math.abs(sr(seed).int32()) % DESCRIPTIONS.length];

      return {
        name: player,
        description,
        avatar: createAvatar(adventurerNeutral, { seed }).toDataUri(),
      };
    });
  }, [lobbyData]);

  return (
    <Card className="min-w-60">
      <CardHeader>
        <h2 className="font-semibold tracking-wide text-xl">Liste des joueurs</h2>
      </CardHeader>
      {players.map((player) => (
        <CardContent key={player.name} className="flex items-center">
          <img className="h-12 aspect-square rounded-full" src={player.avatar} alt={player.name} />
          <div className="flex-grow flex flex-col ml-4 justify-center">
            <p className="font-semibold">{player.name}</p>
            <p className="text-sm text-muted-foreground">{player.description}</p>
          </div>
          {player.name === lobbyData.owner && <Crown className="min-w-6 h-6 aspect-square mr-[6px] text-yellow-400" />}
          {player.name !== lobbyData.username && lobbyData.username === lobbyData.owner && (
            <Button variant="ghost" size="icon" className="text-red-400/50 hover:text-red-400">
              <X className="text-inherit" />
            </Button>
          )}
        </CardContent>
      ))}
    </Card>
  );
}
