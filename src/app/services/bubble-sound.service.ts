import { Injectable } from '@angular/core';
import { Envelope } from '../model/envelope.interface';
import { FrequencyService } from './frequency.service';
import { WebAudio } from './web-audio.service';

@Injectable()
export class BubbleSoundService {
  oscillator: OscillatorNode;
  noteGain: GainNode;

  envelope: Envelope = {
    attack: { value: 0.5, time: 0.1 },
    decay: { value: 0.4, time: 0.2 },
    sustain: { value: 0.3, time: 0.3 },
    release: { value: 0, time: 0.5 },
  };

  soundDuration: number = 0.5;

  constructor(private webAudio: WebAudio) {
    this.oscillator = this.webAudio.createOscillator();
    this.noteGain = this.webAudio.createNoteGain(this.envelope);
    this.oscillator.connect(this.noteGain);
  }

  configureSound(radius: number, color: string, life: number) {
    const currentTime = this.webAudio.getTime();
    const randomBaseHz = (25 / radius) * 500;

    // const frequency = FrequencyService.findClosestFrequency(randomBaseHz);
    const frequency = FrequencyService.getRandomFrequency();

    this.oscillator.frequency.value = frequency;

    console.log('############', { randomBaseHz, frequency }, '############');

    // this.configureCompressor(currentTime);
    this.oscillator.start(currentTime);
    this.oscillator.stop(currentTime + this.soundDuration);
  }

  public stopSound() {
    this.noteGain.gain.cancelScheduledValues(this.webAudio.getTime());
    this.noteGain.gain.setValueAtTime(
      0,
      this.webAudio.getTime() + this.envelope.release.time
    );
    this.oscillator.stop();
    this.oscillator.disconnect();
  }

  public disconnectOscillator() {
    this.oscillator.disconnect();
  }

  // configureCompressor(time: number) {
  //   this.compressor.threshold.setValueAtTime(-50, time);
  //   this.compressor.knee.setValueAtTime(40, time + 0.2);
  //   this.compressor.ratio.setValueAtTime(12, time);
  //   this.compressor.attack.setValueAtTime(0, time + 0.1);
  //   this.compressor.release.setValueAtTime(0.25, time + 0.4);
  // }
}
