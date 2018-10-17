import { TestBed } from '@angular/core/testing';

import { PrizeService } from './prize.service';

describe('PrizeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrizeService = TestBed.get(PrizeService);
    expect(service).toBeTruthy();
  });
});
