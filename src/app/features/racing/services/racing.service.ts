import { effect, Injectable, resource, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { Race } from '../models/race.model';
import { MOCK_RACES } from './mock-races';
@Injectable({
  providedIn: 'root',
})
export class RacingService {
  private readonly _races = signal<Race[]>([]);
  readonly races = this._races.asReadonly();

  readonly raceResource = resource({
    loader: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return MOCK_RACES;
    },
  });
  readonly isLoading = this.raceResource.isLoading;
  readonly error = this.raceResource.error;

  constructor() {
    effect(() => {
      const loadedRaces = this.raceResource.value();
      if (loadedRaces) {
        this._races.set(loadedRaces);
        this.processRaceTick();
      }
    });

    // fun fact: RxJs was created by the same person who created Linq in C# hence the similarities (Erik Meijer)
    // The difference is mainly in the fact that RxJs is push based and Linq is pull based.
    interval(6000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        if (!this.isLoading()) {
          this.processRaceTick();
        }
        setTimeout(() => this.clearTrends(), 1500);
      });
  }

  private processRaceTick(): void {
    const currentTime = Date.now();

    this._races.update((currentRaces) =>
      currentRaces.map((race) => {
        const startTime = new Date(race.startTime).getTime();
        const diffMinutes = (startTime - currentTime) / (1000 * 60);

        let currentStatus: 'open' | 'closed' | 'running' = 'open';
        if (diffMinutes > -5 && diffMinutes <= 0) {
          currentStatus = 'running';
        } else if (diffMinutes <= -5) {
          currentStatus = 'closed';
        }

        if (currentStatus !== 'open') {
          return { ...race, status: currentStatus };
        }

        const updatedHorses = race.horses.map((horse) => {
          const fluctuation = 1 + (Math.random() * 0.2 - 0.1); // +/- 10% fluctuation
          const newOdds = Math.max(1.01, Math.round(horse.odds * fluctuation * 100) / 100); // Round to 2 decimals
          let currentTrend: 'up' | 'down' | 'stable' = 'stable';
          if (newOdds > horse.odds) {
            currentTrend = 'up';
          } else if (newOdds < horse.odds) {
            currentTrend = 'down';
          }
          return { ...horse, odds: newOdds, trend: currentTrend };
        });
        return { ...race, status: currentStatus, horses: updatedHorses };
      }),
    );
  }

  // need to clear trends for animations in css to be ran on next tick.
  private clearTrends(): void {
    this._races.update((currentRaces) =>
      currentRaces.map((race) => {
        if (race.status !== 'open') {
          return race;
        }

        const resetHorses = race.horses.map((horse) => ({
          ...horse,
          trend: 'stable' as const,
        }));

        return { ...race, horses: resetHorses };
      }),
    );
  }
}
