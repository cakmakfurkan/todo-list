import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventProxyService {

  constructor() { }

  private eventSubject = new BehaviorSubject<any>(undefined);

  triggerSomeEvent(param: any) {
      this.eventSubject.next(param);
  }

  getEventSubject(): BehaviorSubject<any> {
     return this.eventSubject;
  }

}
