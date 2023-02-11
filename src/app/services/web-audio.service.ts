import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WebAudio {
  private context: AudioContext;
  private gainNode: GainNode;

  constructor() {
    this.context = new window.AudioContext();
    this.gainNode = this.context.createGain();
    this.configureGain();
  }

  private configureGain() {
    this.gainNode.gain.value = 0.5;
    this.gainNode.connect(this.context.destination);
  }

  public getTime() {
    return this.context.currentTime;
  }

  public createOscillator(options?: OscillatorOptions) {
    if (!this.context) this.context = new window.AudioContext();
    return this.context.createOscillator();
  }

  createGain() {
    const gain = this.context.createGain();
    gain.connect(this.context.destination);
    return gain;
  }

  startSound(oscillator: OscillatorNode) {
    oscillator.connect(this.gainNode);
    oscillator.start(0);
  }

  stopSound(oscillator: OscillatorNode) {
    oscillator.stop(0);
  }

  changeVolume(value: number) {
    const volume = Number(value) / 100;
    this.gainNode.gain.value = volume;
  }

  createCompressor(time: number) {
    return this.context.createDynamicsCompressor();
  }
}
