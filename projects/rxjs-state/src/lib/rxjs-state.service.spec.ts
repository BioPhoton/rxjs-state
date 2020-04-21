import { TestBed } from '@angular/core/testing';

import { RxjsStateService } from './rxjs-state.service';

describe('RxjsStateService', () => {
  let service: RxjsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RxjsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
