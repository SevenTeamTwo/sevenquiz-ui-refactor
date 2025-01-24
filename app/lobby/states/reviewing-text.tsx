import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { adventurerNeutral } from "@dicebear/collection";
import { CheckIcon, XIcon } from "lucide-react";
import sr from "seedrandom";

import { Input } from "~/shadcn/components/input";
import { Card } from "~/shadcn/components/card";
import { Button } from "~/shadcn/components/button";
import { Separator } from "~/shadcn/components/separator";

import type { Review } from "~/lobby/machine";
import { DESCRIPTIONS } from "~/lobby/constants";
import { useLobbyActor } from "~/lobby/hooks/actor";

export interface ReviewingTextProps {
  created: Date;
  review: Review;
  canReview: boolean;
}

export function ReviewingText(props: ReviewingTextProps) {
  const actor = useLobbyActor();

  const playerDetails = useMemo(() => {
    const seed = `${props.created.toISOString()}-${props.review.player}`;
    return {
      description: DESCRIPTIONS[Math.abs(sr(seed).int32()) % DESCRIPTIONS.length],
      avatar: createAvatar(adventurerNeutral, { seed }).toDataUri(),
    };
  }, [props.created, props.review]);

  return (
    <div className="flex-grow grid grid-rows-[1fr,1fr] place-items-center gap-2 md:gap-6 p-6">
      <div className="text-center space-y-4">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight">{props.review.question.title}</h2>
        <Separator />
        <div>
          <p className="scroll-m-20 text-lg font-medium tracking-tight text-muted-foreground">
            La réponse attendue était
          </p>
          <p className="text-4xl font-bold">{props.review.question.answer}</p>
        </div>
      </div>
      <Card key={props.review.player} className="p-4 space-y-4 w-full max-w-xl self-start">
        <div className="flex items-center space-x-4">
          <img className="h-12 aspect-square rounded-full" src={playerDetails.avatar} alt={props.review.player} />
          <div className="flex-grow flex flex-col justify-center">
            <p className="font-semibold">{props.review.player}</p>
            <p className="text-sm text-muted-foreground">{playerDetails.description}</p>
          </div>
        </div>
        <Input
          value={props.review.answer}
          className="max-w-xl px-4 py-6 text-xl disabled:opacity-80  md:text-lg font-semibold"
          disabled={true}
        />
        {props.canReview && (
          <div className="flex gap-x-4">
            <Button
              variant="default"
              className="flex-grow h-12"
              onClick={() => actor.send({ type: "actionReview", validate: true })}
            >
              <CheckIcon />
            </Button>
            <Button
              variant="destructive"
              className="flex-grow h-12"
              onClick={() => actor.send({ type: "actionReview", validate: false })}
            >
              <XIcon />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
