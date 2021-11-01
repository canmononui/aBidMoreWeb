import { TestBed } from '@angular/core/testing';

import { KeySearchService } from './key-search.service';

describe('KeySearchService', () => {
  let service: KeySearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeySearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
