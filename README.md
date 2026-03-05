# ng-stable

**Angular Learning Project**

This repository is a proof-of-concept designed to explore modern Angular features and patterns. The goal is to simulate a real-world, high-performance dashboard (specifically for the horse racing domain) to practice advanced state management and component architecture.

## Key Features Under Construction

- **Race Schedule:** A real-time list of upcoming events using the new control flow syntax to manage DOM updates efficiently.
- **Betting Slip (Kupong):** A complex, interactive component that manages shared state across the application using Computed Signals.
- **Dynamic Rendering:** A simulation of a CMS-driven page layout, where components are rendered dynamically based on JSON configuration.

## Technical Context

- **Framework:** Angular 21+
- **Styling:** Standard CSS (Scalable Component Architecture)

**If time:**

- **RxJS:** Implementing advanced race conditions for live odds.
- **SignalR:** Real-time server push integration.

## Considerations

- **Smart vs. Dumb Components:** There was some back-and-forth regarding component responsibilities. Initially, the `RaceCardComponent` was designed as a "dumb" presentational component, with the `RaceDashboardComponent` handling all bet placements. However, I refactored this so the `RaceCardComponent` is now "smart" (injecting the `BettingService` directly) and the dashboard is "dumb" (responsible only for layout and rendering). This prevents the dashboard from becoming a bloated "god component" and makes the race cards self-contained and highly reusable.
