'use client';

import { Card } from '@/components/ui/card';
import { PlayersCount } from '@/components/players-count';
import { TabContent } from '@/components/leaderboard';

export type LeaderboardTab = 'leaderboard' | 'mybets' | 'top';
export type MyBetsSubTab = 'ongoing' | 'ended';
export type TopSubTab = 'day' | 'month' | 'year';

// const logo = '/assets/images/sv-logo.svg';

type LeaderboardItem = {
  name: string;
  score: number;
  position: number;
  status: 'active' | 'win' | 'loss';
};

interface OngoingBet {
  id: string;
  betid: number | string;
  score: number;
  currentWin: number;
}

interface EndedBet {
  id: string;
  betid: number | string;
  betAmount: number;
  status: 'win' | 'loss';
}

interface TopPlayers {
  [key: string]: {
    date: string;
    avatar: string;
    betAmount: number;
    winAmount: number;
    round: number;
  }[];
}

interface LeaderboardProps {
  activeTab: LeaderboardTab;
  setActiveTab: (tab: LeaderboardTab) => void;
  myBetsSubTab: MyBetsSubTab;
  setMyBetsSubTab: React.Dispatch<React.SetStateAction<MyBetsSubTab>>;
  topSubTab: TopSubTab;
  setTopSubTab: React.Dispatch<React.SetStateAction<TopSubTab>>;
  leaderboard: LeaderboardItem[];
  ongoingBets: OngoingBet[];
  endedBets: EndedBet[];
  topPlayers: TopPlayers;
}

export default function Leaderboard({
  activeTab,
  setActiveTab,
  myBetsSubTab,
  setMyBetsSubTab,
  topSubTab,
  setTopSubTab,
  leaderboard,
  ongoingBets,
  endedBets,
  topPlayers,
}: LeaderboardProps) {
  const renderTabContent = () => (
    <TabContent
      activeTab={activeTab}
      ongoingBets={ongoingBets}
      endedBets={endedBets}
      topPlayers={topPlayers}
      leaderboard={leaderboard}
      myBetsSubTab={myBetsSubTab}
      setMyBetsSubTab={setMyBetsSubTab}
      topSubTab={topSubTab}
      setTopSubTab={setTopSubTab}
    />
  );

  return (
    <Card className="w-full flex flex-col bg-gray-800/80 backdrop-blur-sm rounded-lg border-1 border-sky-500/30 shadow-lg shadow-sky-500/10 p-4 min-h-[665px] mb-2">
      {/* Tab Navigation */}
      <div className="bg-[#1E1E1E] backdrop-blur-sm rounded-full border-1 border-sky-500/30 p-1 flex mb-2">
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`cursor-pointer flex-1 py-2 text-sm font-medium rounded-full transition-all ${
            activeTab === 'leaderboard' ? 'bg-[#005574] text-white' : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Leaderboard
        </button>
        <button
          onClick={() => setActiveTab('mybets')}
          className={`cursor-pointer flex-1 py-2 text-sm font-medium rounded-full transition-all ${
            activeTab === 'mybets' ? 'bg-[#005574] text-white' : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          My Bets
        </button>
        <button
          onClick={() => setActiveTab('top')}
          className={`cursor-pointer flex-1 py-2 text-sm font-medium rounded-full transition-all ${
            activeTab === 'top' ? 'bg-[#005574] text-white' : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Top
        </button>
      </div>

      {/* Players Count */}
      <PlayersCount count={leaderboard.length} />

      {/* Tab Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-col h-full justify-between">{renderTabContent()}</div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
        <span className="text-xs text-gray-400">This game is powered by</span>
        <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-white">
          Smatvirtual
        </div>
      </div>
    </Card>
  );
}
