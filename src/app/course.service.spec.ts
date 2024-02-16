import { TestBed } from '@angular/core/testing';

import { DbexpressService } from './course.service';

describe('DbexpressService', () => {
  let service: DbexpressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbexpressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
