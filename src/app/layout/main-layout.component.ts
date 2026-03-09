import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BetSlipSidebarComponent } from '../features/betting/components/bet-slip-sidebar.component';
import { UserService } from '../features/betting/services/user.service';
import { RaceEngineService } from '../features/racing/services/race-engine.service';
import { ProfileModalComponent } from '../features/user/components/profile-modal.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, BetSlipSidebarComponent, CurrencyPipe, ProfileModalComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="logo">
          <h1>NG-STABLE</h1>
        </div>

        <div class="user-nav">
          <div class="balance-badge">
            <span class="balance-label">Balance</span>
            <span class="balance-amount">{{
              userService.balance() | currency: 'NOK' : 'symbol' : '1.0-0'
            }}</span>
          </div>

          <button class="btn-profile" (click)="toggleProfile()">
            👤 Profile
            @if (userService.placedBets().length > 0) {
              <span class="history-count">{{ userService.placedBets().length }}</span>
            }
          </button>
        </div>
      </header>

      <div class="content-body">
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>

        <aside class="sidebar-container">
          <app-bet-slip-sidebar></app-bet-slip-sidebar>
        </aside>
      </div>
    </div>

    @if (showProfile) {
      <app-profile-modal (closeModal)="toggleProfile()"></app-profile-modal>
    }
  `,
  styles: [
    `
      .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
      }

      .content-body {
        display: flex;
        flex: 1;
        overflow: hidden;
      }

      .main-content {
        flex: 1;
        overflow-y: auto;
        background-color: var(--color-bg);
      }

      .app-header {
        background-color: #212121;
        color: white;
        padding: 0 1.5rem;
        height: 64px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 20;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }

      .logo h1 {
        margin: 0;
        font-size: 1.5rem;
        letter-spacing: 1px;
      }

      .user-nav {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }

      .balance-badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.1);
        padding: 0.4rem 1rem;
        border-radius: 20px;
      }

      .balance-label {
        font-size: 0.8rem;
        color: #aaa;
        text-transform: uppercase;
      }

      .balance-amount {
        font-weight: bold;
        font-family: monospace;
        font-size: 1.1rem;
        color: var(--color-success, #4caf50);
      }

      .btn-profile {
        background: transparent;
        border: 1px solid #555;
        color: white;
        padding: 0.4rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .btn-profile:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .history-count {
        background: var(--color-accent, #d32f2f);
        color: white;
        font-size: 0.7rem;
        padding: 2px 6px;
        border-radius: 10px;
        font-weight: bold;
      }

      .sidebar-container {
        width: 320px;
        height: 100%;
        border-left: 1px solid var(--color-border, #ccc);
        box-shadow: -2px 0 5px rgba(0, 0, 0, 0.05);
        z-index: 10;
      }
    `,
  ],
})
export class MainLayoutComponent {
  userService = inject(UserService);
  raceEngineService = inject(RaceEngineService);
  showProfile = false;

  toggleProfile() {
    this.showProfile = !this.showProfile;
  }
}
