import { isPlatformBrowser } from '@angular/common';
import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { BetSlipItem } from '../models/bet-slip-model';

@Injectable({
  providedIn: 'root',
})
export class BettingService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _items = signal<BetSlipItem[]>(this.loadFromStorage());
  readonly items = this._items.asReadonly();

  readonly count = computed(() => this._items().length);
  readonly totalStake = computed(() =>
    this._items().reduce((total, item) => total + item.stake, 0),
  );

  readonly potentialGain = computed(() =>
    this._items().reduce((total, item) => total + item.stake * item.oddAtMomentOfBet, 0),
  );

  constructor() {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('bet-slip-cart', JSON.stringify(this._items()));
      }
    });
  }

  addOrUpdateBet(newItem: BetSlipItem): void {
    this._items.update((currentItems) => {
      const index = currentItems.findIndex(
        (item) => item.raceId === newItem.raceId && item.horseId === newItem.horseId,
      );

      if (index > -1) {
        const updatedItems = [...currentItems];
        updatedItems[index] = {
          ...updatedItems[index],
          stake: updatedItems[index].stake + newItem.stake,
        };
        return updatedItems;
      }
      return [...currentItems, newItem];
    });
  }

  removeBet(raceId: string, horseId: number): void {
    this._items.update((items) =>
      items.filter((item) => !(item.raceId === raceId && item.horseId === horseId)),
    );
  }

  clearSlip(): void {
    this._items.set([]);
  }

  private loadFromStorage(): BetSlipItem[] {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('bet-slip-cart');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  }
}
