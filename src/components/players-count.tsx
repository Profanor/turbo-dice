import { FC } from 'react';

export const PlayersCount: FC<{ count: number }> = ({ count }) => {
  return (
    <div className="text-xs font-medium text-sky-400 bg-sky-400/10 px-3 py-1.5 rounded-full self-start">
      Joins: {count}
    </div>
  );
};
