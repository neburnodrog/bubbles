import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RandomFeatsService {
  constructor() {}

  public randomLife() {
    return Math.random() * 5 * 1000 + 5000;
  }
}
