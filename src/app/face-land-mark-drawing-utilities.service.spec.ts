import { TestBed } from '@angular/core/testing';

import { FaceLandMarkDrawingUtilitiesService } from './face-land-mark-drawing-utilities.service';

describe('FaceLandMarkDrawingUtilitiesService', () => {
  let service: FaceLandMarkDrawingUtilitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaceLandMarkDrawingUtilitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
