import { TestBed } from '@angular/core/testing';
import { BettingService } from './betting.service';
import { BetSlipItem } from '../models/bet-slip-model';

const makeBet = (overrides: Partial<BetSlipItem> = {}): BetSlipItem => ({
  raceId: 'R1',
  horseId: 1,
  horseName: 'Thunder',
  oddAtMomentOfBet: 3.5,
  stake: 100,
  ...overrides,
});

describe('BettingService', () => {
  let service: BettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty items', () => {
    expect(service.items()).toEqual([]);
    expect(service.count()).toBe(0);
    expect(service.totalStake()).toBe(0);
  });

  it('should add a new bet', () => {
    service.addOrUpdateBet(makeBet());
    expect(service.count()).toBe(1);
    expect(service.totalStake()).toBe(100);
  });

  it('should accumulate stake for duplicate raceId + horseId', () => {
    service.addOrUpdateBet(makeBet({ stake: 100 }));
    service.addOrUpdateBet(makeBet({ stake: 50 }));
    expect(service.count()).toBe(1);
    expect(service.totalStake()).toBe(150);
  });

  it('should add separate bets for different horses', () => {
    service.addOrUpdateBet(makeBet({ horseId: 1 }));
    service.addOrUpdateBet(makeBet({ horseId: 2, horseName: 'Storm' }));
    expect(service.count()).toBe(2);
    expect(service.totalStake()).toBe(200);
  });

  it('should remove a specific bet', () => {
    service.addOrUpdateBet(makeBet({ horseId: 1 }));
    service.addOrUpdateBet(makeBet({ horseId: 2, horseName: 'Storm' }));
    service.removeBet('R1', 1);
    expect(service.count()).toBe(1);
    expect(service.items()[0].horseId).toBe(2);
  });

  it('should clear all bets', () => {
    service.addOrUpdateBet(makeBet());
    service.clearSlip();
    expect(service.count()).toBe(0);
    expect(service.items()).toEqual([]);
  });

  it('hasBet returns true for an existing bet', () => {
    service.addOrUpdateBet(makeBet({ raceId: 'R2', horseId: 7 }));
    expect(service.hasBet('R2', 7)).toBe(true);
  });

  it('hasBet returns false when no matching bet exists', () => {
    service.addOrUpdateBet(makeBet({ raceId: 'R2', horseId: 7 }));
    expect(service.hasBet('R2', 99)).toBe(false);
  });

  it('potentialGain reflects stake × odds', () => {
    service.addOrUpdateBet(makeBet({ stake: 100, oddAtMomentOfBet: 4.0 }));
    expect(service.potentialGain()).toBeCloseTo(400);
  });
});
