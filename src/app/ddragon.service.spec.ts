/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DdragonService } from './ddragon.service';

describe('DdragonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DdragonService]
    });
  });

  it('should ...', inject([DdragonService], (service: DdragonService) => {
    expect(service).toBeTruthy();
  }));
});
