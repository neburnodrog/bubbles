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

  startSound(osc: OscillatorNode) {
    osc.connect(this.gainNode);
    osc.start(0);
  }

  stopSound(osc: OscillatorNode) {
    osc.stop(0);
  }

  changeVolume(value: number) {
    const volume = Number(value) / 100;
    this.gainNode.gain.value = volume;
  }

  createCompressor() {
    const compressor = this.context.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-50, this.context.currentTime);
    compressor.knee.setValueAtTime(40, this.context.currentTime);
    compressor.ratio.setValueAtTime(12, this.context.currentTime);
    compressor.attack.setValueAtTime(0, this.context.currentTime);
    compressor.release.setValueAtTime(0.25, this.context.currentTime);
    return compressor;
  }
}
