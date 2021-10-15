import { TestBed } from '@angular/core/testing';

import { EventProxyService } from './event-proxy.service';

describe('EventProxyService', () => {
  let service: EventProxyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventProxyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
