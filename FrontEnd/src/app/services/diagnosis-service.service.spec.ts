import { TestBed } from '@angular/core/testing';

import { DiagnosisServiceService } from './diagnosis-service.service';

describe('DiagnosisServiceService', () => {
  let service: DiagnosisServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiagnosisServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
