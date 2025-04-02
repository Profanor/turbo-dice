import { useGameSocket } from '@/app/socketService';

export const PlayersCount = () => {
  const { userSelectedActiveGame } = useGameSocket();

  return (
    <div className="text-xs font-medium text-sky-400 bg-sky-400/10 px-3 py-1.5 rounded-full self-start">
      Joins: {userSelectedActiveGame?.noOfPlayersJoined ?? 0}
    </div>
  );
};
