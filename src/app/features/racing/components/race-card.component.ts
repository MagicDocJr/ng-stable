import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Horse, Race } from '../models/race.model';

@Component({
  selector: 'app-race-card',
  imports: [DecimalPipe, DatePipe],
  templateUrl: './race-card.component.html',
  styleUrls: ['./race-card.component.css'],
})
export class RaceCardComponent {
  race = input.required<Race>();

  betPlaced = output<{ raceId: string; horse: Horse }>();

  onOddsClick(horse: Horse) {
    this.betPlaced.emit({
      raceId: this.race().id,
      horse: horse,
    });
  }
}
