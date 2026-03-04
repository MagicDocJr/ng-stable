import { Component, inject } from '@angular/core';
import { BetSlipItem } from '../../models/bet-slip-model';
import { BettingService } from '../../services/betting.service';

@Component({
  selector: 'app-bet-slip-sidebar',
  imports: [],
  templateUrl: './bet-slip-sidebar.component.html',
  styleUrls: [`./bet-slip-sidebar.component.css`],
})
export class BetSlipSidebarComponent {
  private bettingService = inject(BettingService);

  items = this.bettingService.items;
  total = this.bettingService.totalStake;
  count = this.bettingService.count;

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
}
