import { isPlatformBrowser } from '@angular/common';
import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  PLATFORM_ID,
  resource,
  signal,
} from '@angular/core';
import { MOCK_RACES } from './mock-races';
@Injectable({
  providedIn: 'root',
})
export class RacingService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly now = signal(Date.now());

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const intervalId = setInterval(() => this.now.set(Date.now()), 5000);
      // Mem leak prevention
      this.destroyRef.onDestroy(() => clearInterval(intervalId));
    }
  }

  readonly raceResource = resource({
    loader: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return MOCK_RACES;
    },
  });

  readonly isLoading = this.raceResource.isLoading;
  readonly error = this.raceResource.error;

  readonly races = computed(() => {
    const rawRaces = this.raceResource.value() ?? [];
    const currentTime = this.now();

    return rawRaces.map((race) => {
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
