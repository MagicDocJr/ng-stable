import { Component, inject } from '@angular/core';
import { RaceCardComponent } from '../components/race-card.component';
import { RacingService } from '../services/racing.service';

@Component({
  selector: 'app-race-dashboard',
  imports: [RaceCardComponent],
  templateUrl: './race-dashboard.component.html',
  styleUrls: ['./race-dashboard.component.css'],
})
export class RaceDashboardComponent {
  racingService = inject(RacingService);

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.racingService.searchQuery.set(input.value);
  }
}
