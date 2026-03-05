import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { BettingService } from '../../betting/services/betting.service';
import { Horse, Race } from '../models/race.model';

@Component({
  selector: 'app-race-card',
  imports: [DecimalPipe, DatePipe],
  templateUrl: './race-card.component.html',
  styleUrls: ['./race-card.component.css'],
})
export class RaceCardComponent {
  race = input.required<Race>();
  bettingService = inject(BettingService);
  betPlaced = output<{ raceId: string; horse: Horse }>();

  onOddsClick(horse: Horse) {
    const raceId = this.race().id;

    if (this.bettingService.hasBet(raceId, horse.id)) {
      this.bettingService.removeBet(raceId, horse.id);
    } else {
      this.bettingService.addOrUpdateBet({
        raceId: raceId,
        horseId: horse.id,
        horseName: horse.name,
        oddAtMomentOfBet: horse.odds,
        stake: 100,
      });
    }

    this.betPlaced.emit({
      raceId: this.race().id,
      horse: horse,
    });
  }
}
