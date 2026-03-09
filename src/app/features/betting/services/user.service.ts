import { Injectable, signal } from '@angular/core';
import { BetSlipItem } from '../models/bet-slip-model';

export interface PlacedBet extends BetSlipItem {
  transactionId: number | string;
  placedAt: Date;
  status: 'pending' | 'won' | 'lost';
}
@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly balance = signal<number>(1000);
  readonly placedBets = signal<PlacedBet[]>([]);

  placeBet(bets: BetSlipItem[], totalStake: number): boolean {
    if (totalStake > this.balance()) {
      return false;
    }

    this.balance.update((currentBalance) => currentBalance - totalStake);

    const newbets: PlacedBet[] = bets.map((bet) => ({
      ...bet,
      transactionId: Math.random().toString(36).substring(2, 15),
      placedAt: new Date(),
      status: 'pending',
    }));
    this.placedBets.update((currentBets) => [...currentBets, ...newbets]);
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
        this.balance.update((currentBalance) => currentBalance + totalWinnings);
      }
      return resolvedBets;
    });
  }
}
