import { Component, inject } from '@angular/core';
import { BettingService } from '../../betting/services/betting.service';
import { RaceCardComponent } from '../components/race-card.component';
import { Horse } from '../models/race.model';
import { RacingService } from '../services/racing.service';

@Component({
  selector: 'app-race-dashboard',
  imports: [RaceCardComponent],
  templateUrl: './race-dashboard.component.html',
  styleUrls: ['./race-dashboard.component.css'],
})
export class RaceDashboardComponent {
  racingService = inject(RacingService);
  private bettingService = inject(BettingService);

  handleBetPlaced(event: { raceId: string; horse: Horse }) {
    this.bettingService.addOrUpdateBet({
      raceId: event.raceId,
      horseId: event.horse.id,
      horseName: event.horse.name,
      oddAtMomentOfBet: event.horse.odds,
      stake: 100,
    });
  }
}
