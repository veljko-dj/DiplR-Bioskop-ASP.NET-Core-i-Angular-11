import { TestBed } from '@angular/core/testing';

import { MojStripeService } from './moj-stripe.service';

describe('MojStripeService', () => {
  let service: MojStripeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MojStripeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
