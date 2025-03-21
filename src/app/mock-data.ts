export const ongoingBets = [
  { id: 'BET-001', score: 4, currentWin: 200 },
  { id: 'BET-002', score: 3, currentWin: 150 },
];

export const endedBets = [
  { id: 'BET-003', betAmount: 100, status: 'win' },
  { id: 'BET-004', betAmount: 200, status: 'loss' },
  { id: 'BET-005', betAmount: 500, status: 'win' },
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
