import { Race } from '../models/race.model';

// Helper to generate future times
const fromNow = (mins: number) => new Date(Date.now() + 1000 * 60 * mins).toISOString();
export const MOCK_RACES: Race[] = [
  // RACE 1: BJERKE (DONE)
  {
    id: 'R1-BJE',
    trackName: 'Bjerke',
    startTime: fromNow(-20), // 5 mins
    status: 'open',
    horses: [
      { id: 101, name: 'Flash Gordon', driver: 'O. M. Kjell', odds: 2.5 },
      { id: 102, name: 'Thunder Bolt', driver: 'A. Tengsareid', odds: 15.0 },
      { id: 103, name: 'Slow Mover', driver: 'P. Buer', odds: 45.0 },
      { id: 104, name: 'Lucky Strike', driver: 'E. Høitomt', odds: 8.2 },
      { id: 105, name: 'Midnight Sun', driver: 'V. Hop', odds: 12.5 },
      { id: 106, name: 'Polar Bear', driver: 'F. Hamre', odds: 3.8 },
    ],
  },
  // RACE 2: MOMARKEN
  {
    id: 'R2-MOM',
    trackName: 'Momarken',
    startTime: fromNow(0),
    status: 'open',
    horses: [
      { id: 201, name: 'Super Star', driver: 'E. Høitomt', odds: 1.8 },
      { id: 202, name: 'Dark Horse', driver: 'V. Hop', odds: 8.5 },
      { id: 203, name: 'Iron Lady', driver: 'K. Malmin', odds: 22.0 },
      { id: 204, name: 'Golden Boy', driver: 'D. Dalen', odds: 5.5 },
    ],
  },
  // RACE 3: FORUS
  {
    id: 'R3-FOR',
    trackName: 'Forus',
    startTime: fromNow(55),
    status: 'open',
    horses: [
      { id: 301, name: 'Viking Spirit', driver: 'T. Erga', odds: 4.2 },
      { id: 302, name: 'Fjord Queen', driver: 'G. Mikkelsen', odds: 6.8 },
      { id: 303, name: 'Mountain King', driver: 'P. Buer', odds: 3.1 },
      { id: 304, name: 'Sea Storm', driver: 'S. Wassberg', odds: 18.0 },
      { id: 305, name: 'Northern Light', driver: 'Å. Tengsareid', odds: 9.5 },
      { id: 306, name: 'Snow Storm', driver: 'B. Steine', odds: 11.0 },
      { id: 307, name: 'Ice Breaker', driver: 'O. J. Östre', odds: 25.0 },
      { id: 308, name: 'Winter Tale', driver: 'M. T. Gundersen', odds: 33.0 },
    ],
  },
  // RACE 4: JARLSBERG
  {
    id: 'R4-JAR',
    trackName: 'Jarlsberg',
    startTime: fromNow(90),
    status: 'open',
    horses: [
      { id: 401, name: 'Speed Demon', driver: 'F. Hamre', odds: 1.5 },
      { id: 402, name: 'Slow Coach', driver: 'L. Kolle', odds: 50.0 },
      { id: 403, name: 'Average Joe', driver: 'H. T. Ydersbond', odds: 10.0 },
    ],
  },
];
