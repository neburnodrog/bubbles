import { Injectable } from '@angular/core';
import { SAMPLE_NAMES } from '../constants/sample-name';

@Injectable({
  providedIn: 'root',
})
export class SamplesService {
  constructor() {}

  playSound() {
    var audio = new Audio(this.getFileName());
    audio.play();
  }

  private getFileName() {
    const randomIndex = Math.floor(Math.random() * SAMPLE_NAMES.length);
    return SAMPLE_NAMES[randomIndex];
  }
}
