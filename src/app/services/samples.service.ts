import { SAMPLE_NAMES } from '../constants/sample-name';

export class SamplesService {
  public static playSound() {
    var audio = new Audio(this.getFileName());
    audio.volume = 0.3;
    audio.play();
  }

  private static getFileName() {
    const randomIndex = Math.floor(Math.random() * SAMPLE_NAMES.length);
    return SAMPLE_NAMES[randomIndex];
  }
}
