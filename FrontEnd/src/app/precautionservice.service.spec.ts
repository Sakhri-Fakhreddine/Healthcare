import { TestBed } from '@angular/core/testing';

import { PrecautionserviceService } from './precautionservice.service';

describe('PrecautionserviceService', () => {
  let service: PrecautionserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrecautionserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
