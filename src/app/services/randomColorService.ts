import randomColor from 'randomcolor';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RandomColorService {
  private _randomColor = randomColor;

  public getRandomHexColor(options?: any) {
    return randomColor(options);
  }
}
