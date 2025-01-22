import type { Route } from "./+types/main.index";

import { Hero } from "~/components/hero";
import { CreateJoinLobbyTabs } from "~/lobby/components/create-join-lobby-card";

export function meta({}: Route.MetaArgs) {
  return [{ title: "SevenQuiz" }, { name: "description", content: "Welcome to SevenQuiz!" }];
}

export default function () {
  return (
    <div className="flex-grow grid grid-rows-[auto,1fr] gap-8 lg:grid-cols-[3fr,2fr] lg:grid-rows-1 items-center">
      <div>
        <Hero />
      </div>
      <div className="self-start lg:self-center">
        <CreateJoinLobbyTabs />
      </div>
    </div>
  );
}
