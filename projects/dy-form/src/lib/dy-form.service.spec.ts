import { TestBed } from '@angular/core/testing';

import { DyFormService } from './dy-form.service';

describe('DyFormService', () => {
  let service: DyFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DyFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
