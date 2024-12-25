import { TestBed } from '@angular/core/testing';

import { ServiceOAuthService } from './service-oauth.service';

describe('ServiceOAuthService', () => {
  let service: ServiceOAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceOAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
