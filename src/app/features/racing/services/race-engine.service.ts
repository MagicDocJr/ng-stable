import { effect, inject, Injectable } from '@angular/core';
import { UserService } from '../../betting/services/user.service';
import { RacingService } from './racing.service';

@Injectable({
  providedIn: 'root',
})
export class RaceEngineService {
  private userService = inject(UserService);
  private racingService = inject(RacingService);

  private resolvedRaces = new Set<string>();

  constructor() {
    effect(() => {
      const races = this.racingService
        .races()
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      for (const race of races) {
        if (race.status === 'closed' && !this.resolvedRaces.has(race.id)) {
          this.simulateRace(race);
          this.resolvedRaces.add(race.id);
        }
      }
    });
  }

  simulateRace(race: any): void {
    const probabilities = race.horses.map((horse: any) => 1 / horse.odd);
    const totalProbabilites = probabilities.reduce((sum: number, p: number) => sum + p, 0);
    const normalizedProbabilities = probabilities.map((p: number) => p / totalProbabilites);

    const randomRoll = Math.random();
    let cumulativeProbability = 0;
    let winningHorseId = race.horses[0].id;

    //find winning horse based on random roll and normalized probabilities
    for (let i = 0; i < normalizedProbabilities.length; i++) {
      cumulativeProbability += normalizedProbabilities[i];
      if (randomRoll <= cumulativeProbability) {
        winningHorseId = race.horses[i].id;
        break;
      }
    }

    this.userService.resolveBets(race.id, winningHorseId);
  }
}
