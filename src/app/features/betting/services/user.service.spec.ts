import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { BetSlipItem } from '../models/bet-slip-model';

const makeBet = (overrides: Partial<BetSlipItem> = {}): BetSlipItem => ({
  raceId: 'R1',
  horseId: 1,
  horseName: 'Thunder',
  oddAtMomentOfBet: 4.0,
  stake: 100,
  ...overrides,
});

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with balance of 1000', () => {
    expect(service.balance()).toBe(1000);
  });

  it('updateBalance adds to the current balance', () => {
    service.updateBalance(200);
    expect(service.balance()).toBe(1200);
  });

  it('updateBalance can subtract from the current balance', () => {
    service.updateBalance(-300);
    expect(service.balance()).toBe(700);
  });

  it('placeBet deducts stake and returns true', () => {
    const result = service.placeBet([makeBet({ stake: 250 })], 250);
    expect(result).toBe(true);
    expect(service.balance()).toBe(750);
  });

  it('placeBet adds bets with pending status', () => {
    const before = service.placedBets().length;
    service.placeBet([makeBet(), makeBet({ horseId: 2, horseName: 'Storm' })], 200);
    const added = service.placedBets().slice(0, 2);
    expect(service.placedBets().length).toBe(before + 2);
    expect(added.every((b) => b.status === 'pending')).toBe(true);
  });

  it('placeBet returns false when stake exceeds balance', () => {
    const result = service.placeBet([makeBet({ stake: 5000 })], 5000);
    expect(result).toBe(false);
    expect(service.balance()).toBe(1000);
  });

  it('resolveBets marks winning bets as won and credits winnings', () => {
    service.placeBet([makeBet({ raceId: 'R10', horseId: 5, oddAtMomentOfBet: 3.0, stake: 100 })], 100);
    const balanceAfterBet = service.balance();

    service.resolveBets('R10', 5);

    const resolvedBet = service.placedBets().find((b) => b.raceId === 'R10' && b.horseId === 5);
    expect(resolvedBet?.status).toBe('won');
    expect(service.balance()).toBeCloseTo(balanceAfterBet + 300);
  });

  it('resolveBets marks losing bets as lost with no balance change', () => {
    service.placeBet([makeBet({ raceId: 'R11', horseId: 1, stake: 100 })], 100);
    const balanceAfterBet = service.balance();

    service.resolveBets('R11', 99);

    const resolvedBet = service.placedBets().find((b) => b.raceId === 'R11' && b.horseId === 1);
    expect(resolvedBet?.status).toBe('lost');
    expect(service.balance()).toBe(balanceAfterBet);
  });

  it('resolveBets does not affect bets from other races', () => {
    service.placeBet([makeBet({ raceId: 'R12', horseId: 1, stake: 100 })], 100);
    service.resolveBets('R99', 1);

    const bet = service.placedBets().find((b) => b.raceId === 'R12');
    expect(bet?.status).toBe('pending');
  });
});
