import { TestBed } from '@angular/core/testing';

import { JoboyService } from './joboy.service';

describe('JoboyService', () => {
  let service: JoboyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JoboyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
