# ng-stable

**Sportsbook Dashboard Simulation**

A proof-of-concept exploring **Angular 21+** features and high-performance state management for a real-time horse racing dashboard.

## 🚀 Key Features

- **Live Odds "Game Loop":** Centralized heartbeat using **RxJS `interval`** to process race statuses and odds fluctuations.
- **Unidirectional Data Flow:** Services process domain logic to update a single source of truth (`_races` signal).
- **Reactive Betting Slip:** Supports odds snapshotting (`oddAtMomentOfBet`) to lock prices at placement, managed via `BettingService` with `localStorage` persistence.
- **Automated Race Lifecycle:** Automatic transitions between `open`, `running`, and `closed` states based on start times, with automated result simulation and payout resolution.

## 🛠 Tech Stack

- **Framework:** Angular 21 (Standalone Components).
- **State Management:** Angular Signals (Writable, Computed, and Effects).
- **Reactivity:** RxJS Interop for memory-safe timers using `takeUntilDestroyed`.
- **Data Fetching:** Managed async states via **`resource` API**.

## 🏗 Architecture Decisions

- **Smart Components:** `RaceCardComponent` is "Smart", injecting `BettingService` to manage its own state.
  Preventing the dashboard from becoming a "God Component".
- RxJS is used strictly for **events over time** (tickers), while Signals manage **UI state**.

## 🛠 How to Run

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```
2.  **Start the development server:**
    ```bash
    pnpm start
    ```
3.  **Build the project:**
    ```bash
    pnpm build
    ```
