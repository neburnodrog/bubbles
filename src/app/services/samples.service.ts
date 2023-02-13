import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { SAMPLE_FILES, SAMPLE_NAMES } from '../constants/sample-name';

@Injectable({ providedIn: 'root' })
export class SampleService {
  private audioElementMap = {} as AudioElementMap;
  private audioContext = new window.AudioContext();
  private gainNode = this.audioContext.createGain();

  constructor(private httpClient: HttpClient) {
    this.gainNode.connect(this.audioContext.destination);
  }

  public preloadAudioFiles() {
    const observables = Object.entries(SAMPLE_FILES).map(([key, fileName]) => {
      return this.httpClient.get(fileName, { responseType: 'blob' }).pipe(
        mergeMap((data) => data.arrayBuffer()),
        mergeMap((arrayBuffer) =>
          this.audioContext.decodeAudioData(arrayBuffer)
        ),
        map((audioBuffer) => {
          return [key, audioBuffer] as [string, AudioBuffer];
        })
      );
    });

    combineLatest(observables).subscribe((blobs) => {
      blobs.forEach(([key, audioBuffer]) => {
        this.audioElementMap[key] = audioBuffer;
      });
    });
  }

  public playSound() {
    const audioBuffer = this.getAudioBuffer();
    const bufferSource = this.audioContext.createBufferSource();
    bufferSource.buffer = audioBuffer;
    bufferSource.connect(this.gainNode);
    this.gainNode.gain.value = 0.3;
    bufferSource.start();
  }

  private getAudioBuffer(): AudioBuffer {
    const randomIndex = Math.floor(Math.random() * SAMPLE_NAMES.length);
    const randomSampleName = SAMPLE_NAMES[randomIndex];
    return this.audioElementMap[randomSampleName];
  }
}

type AudioElementMap = Record<string, AudioBuffer>;
