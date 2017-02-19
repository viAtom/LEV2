/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LivestatsService } from './livestats.service';

describe('LivestatsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LivestatsService]
    });
  });

  it('should ...', inject([LivestatsService], (service: LivestatsService) => {
    expect(service).toBeTruthy();
  }));
});
