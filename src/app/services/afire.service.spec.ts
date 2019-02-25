import { TestBed } from '@angular/core/testing';

import { AfireService } from './afire.service';

describe('AfireService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AfireService = TestBed.get(AfireService);
    expect(service).toBeTruthy();
  });
});
