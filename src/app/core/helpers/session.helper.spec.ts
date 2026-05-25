import { TestBed } from '@angular/core/testing';

import { SessionHelper } from './session.helper';

describe('SessionHelper', () => {
  let service: SessionHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
