import { TestBed } from '@angular/core/testing';

import { MedicalHistoryServiceService } from './medical-history-service.service';

describe('MedicalHistoryServiceService', () => {
  let service: MedicalHistoryServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalHistoryServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
