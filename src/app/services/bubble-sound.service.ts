import { Injectable } from '@angular/core';
import { FrequencyService } from './frequency.service';
import { WebAudio } from './web-audio.service';

@Injectable()
export class BubbleSoundService {
  sound: OscillatorNode;
  gain: GainNode;
  compressor: DynamicsCompressorNode;
  time: number;

  constructor(private webAudio: WebAudio) {
    this.sound = this.webAudio.createOscillator();
    this.gain = this.webAudio.createGain();
    this.time = this.webAudio.getTime();
    this.compressor = this.webAudio.createCompressor(this.time);
  }

  configureSound(radius: number, color: string, life: number) {
    const baseHz = (100 / radius) * 500;

    const tooHighDiscarded = baseHz > 2000 ? baseHz - baseHz / 2 : baseHz;

    console.log('############', { target: tooHighDiscarded }, '############');

    const frequency = FrequencyService.findClosestFrequency(tooHighDiscarded);

    console.log({ frequency });

    const currentTime = this.webAudio.getTime();
    this.sound.frequency.value = frequency;
    this.configureGain(currentTime, life);
    // this.configureCompressor(currentTime);

    this.sound.connect(this.gain);
    this.sound.start(currentTime);
    this.sound.stop(currentTime + 0.5);
  }

  stopSound() {
    this.sound.stop();
  }

  configureGain(time: number, life: number) {
    // this.gain.gain.linearRampToValueAtTime(0, time);
    // this.gain.gain.linearRampToValueAtTime(0.4, time + 0.05);
    // this.gain.gain.linearRampToValueAtTime(0.2, time + life - 0.1);
    // this.gain.gain.linearRampToValueAtTime(0, time + life);

    this.gain.gain.linearRampToValueAtTime(0, time);
    this.gain.gain.linearRampToValueAtTime(0.5, time + 0.1);
    // this.gain.gain.linearRampToValueAtTime(0.5, time + 0.4);
    // this.gain.gain.linearRampToValueAtTime(0.2, time + 0.6);
    this.gain.gain.linearRampToValueAtTime(0, time + 0.6);
  }

  configureCompressor(time: number) {
    this.compressor.threshold.setValueAtTime(-50, time);
    this.compressor.knee.setValueAtTime(40, time + 0.2);
    this.compressor.ratio.setValueAtTime(12, time);
    this.compressor.attack.setValueAtTime(0, time + 0.1);
    this.compressor.release.setValueAtTime(0.25, time + 0.4);
  }
}
