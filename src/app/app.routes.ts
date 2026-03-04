import { Routes } from '@angular/router';
import { RaceDashboardComponent } from './features/racing/pages/race-dashboard.component';
import { MainLayoutComponent } from './layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: RaceDashboardComponent,
      },
    ],
  },
];
