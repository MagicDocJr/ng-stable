import { Injectable, signal } from '@angular/core';
import { BetSlipItem } from '../models/bet-slip-model';

export interface PlacedBet extends BetSlipItem {
  transactionId: number | string;
  placedAt: Date;
  status: 'pending' | 'won' | 'lost';
}
const hoursAgo = (hours: number) => new Date(Date.now() - 1000 * 60 * 60 * hours);
const MOCK_HISTORY: PlacedBet[] = [
  {
    raceId: 'R99-OSL',
    horseId: 901,
    horseName: 'Historic Winner',
    stake: 500,
    oddAtMomentOfBet: 3.2,
    transactionId: 'WIN-7A3B9',
    placedAt: hoursAgo(24),
    status: 'won',
  },
  {
    raceId: 'R98-BER',
    horseId: 805,
    horseName: 'Slowpoke',
    stake: 200,
    oddAtMomentOfBet: 15.0,
    transactionId: 'LST-2X9P1',
    placedAt: hoursAgo(48),
    status: 'lost',
  },
];

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly balance = signal<number>(1000);
  readonly placedBets = signal<PlacedBet[]>(MOCK_HISTORY);

  updateBalance(amount: number): void {
    this.balance.update((currentBalance) => currentBalance + amount);
  }

  placeBet(bets: BetSlipItem[], totalStake: number): boolean {
    if (totalStake > this.balance()) {
      return false;
    }

    this.updateBalance(-totalStake);
    const newbets: PlacedBet[] = bets.map((bet) => ({
      ...bet,
      transactionId: Math.random().toString(36).substring(2, 15),
      placedAt: new Date(),
      status: 'pending',
    }));
    this.placedBets.update((currentBets) => [...newbets, ...currentBets]);
    return true;
  }

  resolveBets(raceId: string, winningHorseId: number): void {
    this.placedBets.update((currentBets) => {
      let totalWinnings = 0;

      const resolvedBets = currentBets.map((bet) => {
        if (bet.raceId !== raceId || bet.status !== 'pending') {
          return bet;
        }

        if (bet.horseId === winningHorseId) {
          totalWinnings += bet.stake * bet.oddAtMomentOfBet;
          return { ...bet, status: 'won' as const };
        } else {
          return { ...bet, status: 'lost' as const };
        }
      });

      if (totalWinnings > 0) {
        this.updateBalance(totalWinnings);
      }
      return resolvedBets;
    });
  }
}
