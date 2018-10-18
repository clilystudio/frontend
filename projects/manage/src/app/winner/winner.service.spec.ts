import { TestBed } from '@angular/core/testing';

import { WinnerService } from './winner.service';

describe('WinnerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WinnerService = TestBed.get(WinnerService);
    expect(service).toBeTruthy();
  });
});
