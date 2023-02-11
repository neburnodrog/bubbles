import { Injectable } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WindowDimensionsService {
  height!: number;
  width!: number;
  windowResizeSubscription?: Subscription;

  constructor() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;

    this.windowResizeSubscription = fromEvent(window, 'resize').subscribe(
      (event: Event) => {
        const window = event.target as Window;
        this.height = window.innerHeight;
        this.width = window.innerWidth;
      }
    );
  }

  ngOnDestroy() {
    this.windowResizeSubscription?.unsubscribe();
  }
}
