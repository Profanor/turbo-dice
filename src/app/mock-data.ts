interface EndedBet {
  id: string;
  betid: number | string;
  betAmount: number;
  status: 'win' | 'loss';
}

export const ongoingBets = [
  { id: '1', betid: 'A1', score: 100, currentWin: 50 },
  { id: '2', betid: 'A2', score: 200, currentWin: 100 },
  { id: '3', betid: 'A3', score: 300, currentWin: 150 },
];

export const endedBets: EndedBet[] = [
  { id: '1', betid: '101', betAmount: 100, status: 'win' },
  { id: '2', betid: '102', betAmount: 200, status: 'loss' },
  { id: '3', betid: '103', betAmount: 300, status: 'win' },
];

export const topPlayers = {
  day: [
    { date: 'Today', avatar: 'U1', betAmount: 1000, winAmount: 2500, round: 5 },
    { date: 'Today', avatar: 'U2', betAmount: 800, winAmount: 1600, round: 3 },
  ],
  month: [
    { date: 'March', avatar: 'U3', betAmount: 5000, winAmount: 12000, round: 15 },
    { date: 'March', avatar: 'U4', betAmount: 3500, winAmount: 8000, round: 10 },
  ],
  year: [
    { date: '2025', avatar: 'U5', betAmount: 25000, winAmount: 75000, round: 50 },
    { date: '2025', avatar: 'U6', betAmount: 18000, winAmount: 45000, round: 35 },
  ],
};
