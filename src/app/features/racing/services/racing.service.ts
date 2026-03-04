import { Injectable, resource } from '@angular/core';
import { MOCK_RACES } from './mock-races';
@Injectable({
  providedIn: 'root',
})
export class RacingService {
  readonly raceResource = resource({
    loader: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return MOCK_RACES;
    },
  });
  readonly races = this.raceResource.value;
  readonly isLoading = this.raceResource.isLoading;
  readonly error = this.raceResource.error;
}
