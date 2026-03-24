// generate-db.js
// This script runs before json-server starts and writes a fresh db.json
// with race times relative to "now", just like the fromNow() helper
// in your original mock-races.ts.
import { writeFileSync } from 'fs';

// Replicates the fromNow() helper from mock-races.ts
const fromNow = (mins) =>
  new Date(Date.now() + 1000 * 60 * mins).toISOString();

const db = {
  races: [
    {
      id: 'R1-BJE',
      trackName: 'Bjerke',
      startTime: fromNow(-20), // already closed
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
    {
      id: 'R2-MOM',
      trackName: 'Momarken',
      startTime: fromNow(0), // closing now / running
      status: 'open',
      horses: [
        { id: 201, name: 'Super Star', driver: 'E. Høitomt', odds: 1.8 },
        { id: 202, name: 'Dark Horse', driver: 'V. Hop', odds: 8.5 },
        { id: 203, name: 'Iron Lady', driver: 'K. Malmin', odds: 22.0 },
        { id: 204, name: 'Golden Boy', driver: 'D. Dalen', odds: 5.5 },
      ],
    },
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
        { id: 307, name: 'Ice Breaker', driver: 'O. J. Østre', odds: 25.0 },
        { id: 308, name: 'Winter Tale', driver: 'M. T. Gundersen', odds: 33.0 },
      ],
    },
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
    {
      id: 'R5-KLO',
      trackName: 'Klosterskogen',
      startTime: fromNow(3), // closes in 3 minutes - good for testing
      status: 'open',
      horses: [
        { id: 501, name: 'Testing Time', driver: 'T. Borg', odds: 2.2 },
        { id: 502, name: 'Quick Cash', driver: 'G. Austevoll', odds: 4.5 },
        { id: 503, name: 'Last Minute', driver: 'V. Hop', odds: 7.0 },
        { id: 504, name: 'Patience', driver: 'E. Høitomt', odds: 12.0 },
      ],
    },
    {
      id: 'R6-LEA',
      trackName: 'Leangen',
      startTime: fromNow(-4), // should appear as RUNNING
      status: 'open',
      horses: [
        { id: 601, name: 'Mid Race', driver: 'A. Stensen', odds: 3.5 },
        { id: 602, name: 'Pacing Fast', driver: 'B. Garberg', odds: 5.0 },
        { id: 603, name: 'Trotter', driver: 'J. Blekkan', odds: 6.5 },
      ],
    },
    {
      id: 'R7-BIR',
      trackName: 'Biri',
      startTime: fromNow(15),
      status: 'open',
      horses: [
        { id: 701, name: 'Alpha', driver: 'F. Hamre', odds: 4.0 },
        { id: 702, name: 'Bravo', driver: 'O. M. Kjell', odds: 6.0 },
        { id: 703, name: 'Charlie', driver: 'P. Buer', odds: 8.5 },
        { id: 704, name: 'Delta', driver: 'E. Høitomt', odds: 12.0 },
        { id: 705, name: 'Echo', driver: 'V. Hop', odds: 15.0 },
        { id: 706, name: 'Foxtrot', driver: 'D. Dalen', odds: 20.0 },
        { id: 707, name: 'Golf', driver: 'K. Malmin', odds: 25.0 },
        { id: 708, name: 'Hotel', driver: 'S. Wassberg', odds: 30.0 },
        { id: 709, name: 'India', driver: 'T. Erga', odds: 45.0 },
        { id: 710, name: 'Juliet', driver: 'A. Tengsareid', odds: 60.0 },
      ],
    },
    {
      id: 'R8-SOR',
      trackName: 'Sørlandets',
      startTime: fromNow(120),
      status: 'open',
      horses: [
        { id: 801, name: 'Sure Thing', driver: 'E. Høitomt', odds: 1.1 },
        { id: 802, name: 'Underdog', driver: 'V. Hop', odds: 25.0 },
        { id: 803, name: 'No Chance', driver: 'P. Buer', odds: 50.0 },
        { id: 804, name: 'Miracle', driver: 'F. Hamre', odds: 100.0 },
      ],
    },
  ],
};

// Write the generated data to db.json
writeFileSync('db.json', JSON.stringify(db, null, 2));
console.log('✓ db.json generated with fresh timestamps');
