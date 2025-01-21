import { CreateLobbyCard } from "~/components/create-lobby-card";
import { JoinLobbyCard } from "~/components/join-lobby-card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/shadcn/components/tabs";

export function CreateJoinLobbyTabs() {
  return (
    <Tabs defaultValue="create">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="create">Créer</TabsTrigger>
        <TabsTrigger value="join">Rejoindre</TabsTrigger>
      </TabsList>
      <TabsContent value="create">
        <CreateLobbyCard />
      </TabsContent>
      <TabsContent value="join">
        <JoinLobbyCard />
      </TabsContent>
    </Tabs>
  );
}
