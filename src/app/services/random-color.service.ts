import randomColor from 'randomcolor';
import { COLORS } from '../constants/colors';

export class RandomColorService {
  public static getRandomSematicColor() {
    const length = COLORS.length;
    const randomIndex = Math.floor(Math.random() * length);

    return COLORS[randomIndex];
  }

  public static getRandomHexColor() {
    return randomColor();
  }

  public static getRandomLightColor() {
    return randomColor({ luminosity: 'light' });
  }

  public static getRandomDarkColor() {
    return randomColor({ luminosity: 'dark' });
  }
}
