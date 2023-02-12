import { RandomNumbersService } from './random-numbers.service';

export class RandomFeatsService {
  public static randomLife() {
    const randomLife = RandomNumbersService.getRandomNumber(5000, 10000, 500);
    return randomLife;
  }

  public static getRandomDelayOfBubbles() {
    return RandomNumbersService.getRandomNumber(50, 500, 50);
  }
}
