import randomColor from 'randomcolor';
import { Injectable } from '@angular/core';
import { COLORS } from '../constants/colors';

@Injectable({ providedIn: 'root' })
export class RandomColorService {
  private colors = COLORS;

  public getRandomSematicColor() {
    const length = this.colors.length;
    const randomIndex = Math.floor(Math.random() * length);

    return this.colors[randomIndex];
  }

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
