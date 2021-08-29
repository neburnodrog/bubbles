import { Injectable } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WindowDimensionsService {
  height = window.innerHeight;
  width = window.innerWidth;
  windowResizeSubscription?: Subscription;

  constructor() {
    this.windowResizeSubscription = fromEvent(window, 'resize').subscribe(
      (event: Event) => {
        const window = event.target as Window;
        this.height = window.innerWidth;
        this.width = window.innerHeight;
      }
    );
  }

  ngOnDestroy() {
    this.windowResizeSubscription?.unsubscribe();
  }
}
