import { Routes } from '@angular/router';
import { authGuard } from './features/auth/auth.guard';
import { LoginComponent } from './features/auth/login.component';
import { RaceDashboardComponent } from './features/racing/pages/race-dashboard.component';
import { MainLayoutComponent } from './layout/main-layout.component';
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: RaceDashboardComponent,
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
