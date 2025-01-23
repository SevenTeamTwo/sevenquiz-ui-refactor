import { useState } from "react";
import { clsx } from "clsx";

import { Card } from "~/shadcn/components/card";
import { Timer } from "~/lobby/components/timer";

export interface PlayingChoicesProps {
  title: string;
  choices: string[];
  duration: number;
}

export function PlayingChoices(props: PlayingChoicesProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  return (
    <div className="flex-grow grid grid-rows-[auto,3fr,7fr] place-items-center gap-2 md:gap-6 p-6">
      <Timer duration={props.duration} />
      <div className="text-center">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight">{props.title}</h2>
        <p className="text-muted-foreground text-sm">Une seule réponse est attendue</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {props.choices.map((option, index) => (
          <Card
            key={index}
            className={clsx(
              "border-2 p-6 md:p-8 lg:p-12 shadow-md rounded-lg hover:shadow-lg transition-all cursor-pointer",
              { "border-green-400": selected.has(index) },
            )}
            onClick={() => {
              setSelected((selected) => {
                const copy = new Set([...selected]);
                (copy.has(index) && copy.delete(index)) || copy.add(index);
                return copy;
              });
            }}
          >
            <p className="leading-7 [&:not(:first-child)]:mt-6 text-center font-medium">{option}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
