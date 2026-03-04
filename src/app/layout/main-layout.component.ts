import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BetSlipSidebarComponent } from '../features/betting/components/bet-slip-sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, BetSlipSidebarComponent],
  template: `
    <div class="app-container">
      <main class="main-content">
        <header class="app-header">
          <h1>NG-STABLE</h1>
        </header>

        <router-outlet></router-outlet>
      </main>

      <aside class="sidebar-container">
        <app-bet-slip-sidebar></app-bet-slip-sidebar>
      </aside>
    </div>
  `,
  styles: [
    `
      .app-container {
        display: flex;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
      }

      .main-content {
        flex: 1;
        overflow-y: auto;
        background-color: var(--color-bg);
        display: flex;
        flex-direction: column;
      }

      .app-header {
        background-color: #333;
        color: white;
        padding: 1rem;
      }

      .sidebar-container {
        width: 320px; /* Fixed width for the betting slip */
        height: 100%;
        box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
        z-index: 10;
      }
    `,
  ],
})
export class MainLayoutComponent {}
