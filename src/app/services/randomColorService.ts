import randomColor from 'randomcolor';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RandomColorService {
  private _randomColor = randomColor;

  public getRandomHexColor() {
    return randomColor();
  }

  public getRandomLightColor() {
    return randomColor({ luminosity: 'light' });
  }

  public getRandomDarkColor() {
    return randomColor({ luminosity: 'dark' });
  }
}
