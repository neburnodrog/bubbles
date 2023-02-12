import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WindowDimensionsService {
  height!: number;
  width!: number;

  constructor() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;

    fromEvent(window, 'resize').subscribe((event: Event) => {
      const window = event.target as Window;
      this.height = window.innerHeight;
      this.width = window.innerWidth;
    });
  }
}
