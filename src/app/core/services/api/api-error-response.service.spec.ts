import { TestBed } from '@angular/core/testing';

import { ApiErrorResponseService } from './api-error-response.service';

describe('ApiErrorResponseService', () => {
  let service: ApiErrorResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiErrorResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
