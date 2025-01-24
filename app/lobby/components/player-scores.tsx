import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { adventurerNeutral } from "@dicebear/collection";
import { Crown } from "lucide-react";
import sr from "seedrandom";

import { Card, CardContent, CardFooter, CardHeader } from "~/shadcn/components/card";
import { DESCRIPTIONS } from "~/lobby/constants";

interface PlayerScoresProps {
  results: Record<string, number>;
  created: Date;
}

export function PlayerScores(props: PlayerScoresProps) {
  const players = useMemo(() => {
    return Object.entries(props.results)
      .map(([player, score]) => {
        const seed = `${props.created.toISOString()}-${player}`;
        const description = DESCRIPTIONS[Math.abs(sr(seed).int32()) % DESCRIPTIONS.length];

        return {
          name: player,
          description,
          avatar: createAvatar(adventurerNeutral, { seed }).toDataUri(),
          score,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [props.created, props.results]);

  return (
    <Card className="flex-grow flex flex-col w-2/3">
      <CardHeader>
        <h2 className="font-semibold tracking-wide text-xl text-center">Résultats</h2>
      </CardHeader>
      <div className="flex-grow">
        <CardContent className="grid grid-cols-[1fr,1fr,auto] gap-8 items-center">
          {players.map((player, index) => (
            <>
              <div key={player.name} className="flex items-center">
                <img className="h-12 aspect-square rounded-full" src={player.avatar} alt={player.name} />
                <div className=" flex flex-col ml-4 justify-center">
                  <p className="font-semibold">{player.name}</p>
                  <p className="text-sm text-muted-foreground">{player.description}</p>
                </div>
              </div>
              <p key={player.name} className="text-muted-foreground">
                marque <span className="font-extrabold text-foreground text-lg">{player.score}</span> point
                {player.score > 1 && "s"}
              </p>
              {index === 0 && <Crown className="min-w-6 h-6 aspect-square ml-12 mr-[6px] text-yellow-400" />}
              {index !== 0 && <div />}
            </>
          ))}
        </CardContent>
      </div>
      <CardFooter>
        <p className="w-full text-sm text-muted-foreground text-center">
          {Object.keys(props.results).length} joueur{Object.keys(props.results).length > 1 && "s"}
        </p>
      </CardFooter>
    </Card>
  );
}
