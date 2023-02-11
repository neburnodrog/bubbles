import { Injectable } from '@angular/core';
import { WebAudio } from './web-audio.service';

@Injectable()
export class BubbleSoundService {
  sound: OscillatorNode;
  gain: GainNode;

  constructor(private webAudio: WebAudio) {
    this.sound = this.webAudio.createOscillator();
    this.gain = this.webAudio.createGain();
  }

  configureSound(radius: number, color: string) {
    const currentTime = this.webAudio.getTime();
    this.sound.frequency.value = radius * 2;
    this.sound.connect(this.gain);
    this.sound.start(currentTime);
    this.sound.stop(currentTime + 0.2);
  }

  stopSound() {
    this.sound.stop();
  }
  // context: AudioContext;
  // sound: OscillatorNode;
  // gain: GainNode;

  // constructor() {
  //   this.context = new AudioContext();
  //   this.sound = this.context.createOscillator();
  //   this.gain = this.context.createGain();
  //   console.log(this.gain);
  // }

  // configureSound(radius: number, color: string) {
  //   const time = this.context.currentTime;
  //   this.sound.connect(this.context.destination);
  //   this.sound.frequency.value = radius * 3;
  //   this.sound.start(time);
  //   this.sound.stop(time + 0.2);
  // }
}
