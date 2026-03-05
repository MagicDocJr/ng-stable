import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { BetSlipItem } from '../models/bet-slip-model';
import { BettingService } from '../services/betting.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-bet-slip-sidebar',
  imports: [CurrencyPipe],
  templateUrl: './bet-slip-sidebar.component.html',
  styleUrls: [`./bet-slip-sidebar.component.css`],
})
export class BetSlipSidebarComponent {
  private bettingService = inject(BettingService);
  private userService = inject(UserService);
  checkoutSuccess = signal<string>('');
  checkoutError = signal<string>('');

  isProcessing = signal<boolean>(false);
  items = this.bettingService.items;
  total = this.bettingService.totalStake;
  count = this.bettingService.count;
  potentialGain = this.bettingService.potentialGain;

  private messageTimeout: any;

  removeBet(raceId: string, horseId: number): void {
    this.bettingService.removeBet(raceId, horseId);
  }

  clearSlip(): void {
    this.bettingService.clearSlip();
  }

  updateStake(item: BetSlipItem, event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = parseFloat(input.value);

    if (!isNaN(newValue) && newValue >= 0) {
      const difference = newValue - item.stake;

      this.bettingService.addOrUpdateBet({ ...item, stake: difference });
    }
  }

  placeBets(): void {
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    this.checkoutError.set('');
    this.checkoutSuccess.set('');
    this.isProcessing.set(true);

    setTimeout(() => {
      const success = this.userService.placeBet(this.items(), this.total());
      if (success) {
        this.checkoutSuccess.set('Bet placed successfully!');
        this.bettingService.clearSlip();
      } else {
        this.checkoutError.set('Failed to place bet.  Please check your balance and try again.');
      }
      this.messageTimeout = setTimeout(() => {
        this.checkoutSuccess.set('');
        this.checkoutError.set('');
      }, 3000);
      this.isProcessing.set(false);
    }, 1000);
  }
}
