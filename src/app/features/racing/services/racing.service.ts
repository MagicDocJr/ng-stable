import { computed, effect, Injectable, resource, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { Race } from '../models/race.model';
import { MOCK_RACES } from './mock-races';
@Injectable({
  providedIn: 'root',
})
export class RacingService {
  private readonly _races = signal<Race[]>([]);
  private readonly now = signal(Date.now());

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
      }
    });

    interval(5000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.now.set(Date.now());
        if (!this.isLoading()) {
          this.fluctuateOdds();
        }
      });
  }

  private fluctuateOdds(): void {
    this._races.update((currentRaces) =>
      currentRaces.map((race) => {
        if (race.status === 'closed' || race.status === 'running') {
          return race;
        }

        const updatedHorses = race.horses.map((horse) => {
          const fluctuation = 1 + (Math.random() * 0.2 - 0.1); // +/- 10% fluctuation
          const newOdds = Math.max(1.01, Math.round(horse.odds * fluctuation * 100) / 100); // Round to 2 decimals
          return { ...horse, odds: newOdds };
        });
        return { ...race, horses: updatedHorses };
      }),
    );
  }

  readonly races = computed(() => {
    const currentRaces = this._races();
    const currentTime = this.now();

    return currentRaces.map((race) => {
      const startTime = new Date(race.startTime).getTime();
      const diffMinutes = (startTime - currentTime) / (1000 * 60);

      let dynamicStatus: 'open' | 'closed' | 'running' = 'open';

      if (diffMinutes > -5 && diffMinutes <= 0) {
        dynamicStatus = 'running';
      } else if (diffMinutes <= -5) {
        dynamicStatus = 'closed';
      }
      return { ...race, status: dynamicStatus };
    });
  });
}
