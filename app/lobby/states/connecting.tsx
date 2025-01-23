import { PlayerList } from "~/lobby/components/player-list";

export function Connecting() {
  return (
    <div className="flex-grow grid grid-rows-2 md:grid-cols-2 md:grid-rows-1 gap-4">
      <PlayerList />
    </div>
  );
}
