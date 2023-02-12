export class RandomNumbersService {
  public static getRandomNumber(min = 0, max = 100, step = 1) {
    const numbersSet = [];

    for (let i = min; i <= max; i += step) {
      numbersSet.push(i);
    }

    const randomIndex = Math.floor(Math.random() * numbersSet.length);

    return numbersSet[randomIndex];
  }
}
