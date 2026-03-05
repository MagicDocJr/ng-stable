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
    for (const bet of bets) {
      this.balance.update((currentBalance) => currentBalance - totalStake);
      this.placedBets.update((currentBets) => [
        ...currentBets,
        {
          ...bet,
          transactionId: Math.random().toString(36).substring(2, 15),
          placedAt: new Date(),
          status: 'pending',
        },
      ]);
    }
    return true;
  }
}
