import { Injectable } from '@angular/core';
import { Envelope } from '../model/envelope.interface';

@Injectable({ providedIn: 'root' })
export class WebAudio {
  private context = new window.AudioContext();
  private _volumeNode = this.context.createGain();
  private defaultEnv: Envelope = {
    attack: { value: 1, time: 0 },
    decay: { value: 1, time: 0 },
    sustain: { value: 1, time: 0 },
    release: { value: 0, time: 0 },
  };

  constructor() {
    this._volumeNode.gain.value = 0.4;
    this._volumeNode.connect(this.context.destination);
  }

  get volumeNode() {
    return this._volumeNode;
  }

  public getTime() {
    return this.context.currentTime;
  }

  public createOscillator(options?: OscillatorOptions) {
    return this.context.createOscillator();
  }

  public createGain() {
    return this.context.createGain();
  }

  public createNoteGain(
    { attack, decay, sustain, release }: Envelope = this.defaultEnv
  ) {
    const time = this.context.currentTime;
    const noteGain = this.context.createGain();

    // START
    noteGain.gain.setValueAtTime(0, time);

    // ATTACK
    noteGain.gain.linearRampToValueAtTime(attack.value, time + attack.time);

    if (decay)
      noteGain.gain.linearRampToValueAtTime(decay.value, time + decay.time);

    if (sustain)
      noteGain.gain.linearRampToValueAtTime(sustain.value, time + sustain.time);

    // RELEASE
    noteGain.gain.linearRampToValueAtTime(release.value, time + release.time);

    // CONNECT ENVELOPE TO VOLUME
    noteGain.connect(this._volumeNode);

    return noteGain;
  }

  /**
   *
   * @param value min: 0 - max: 1
   */
  public changeVolume(value: number) {
    this._volumeNode.gain.value = value;
  }

  public createCompressor() {
    return this.context.createDynamicsCompressor();
  }
}
