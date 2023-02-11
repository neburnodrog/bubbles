import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyRadioChange as MatRadioChange } from '@angular/material/legacy-radio';
import { MatRadioModule } from '@angular/material/radio';
import { WebAudio } from 'src/app/services/web-audio.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatRadioModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
  ],
  selector: 'app-sound-input',
  templateUrl: './sound-input.component.html',
  styleUrls: ['./sound-input.component.scss'],
})
export class SoundInputComponent implements OnInit {
  @Input() index!: string;
  @Output() delete: EventEmitter<string> = new EventEmitter();
  waveOptions: OscillatorType[] = ['square', 'triangle', 'sine', 'sawtooth'];
  waveTypeChosen: OscillatorType = 'sine';
  frequency = 440;
  volume = 50;
  oscillator?: OscillatorNode;

  constructor(private audioService: WebAudio) {}

  onWaveFormChange(event: MatRadioChange) {
    this.waveTypeChosen = event.value;
    this.setWaveForm();
  }

  onVolumeChange(value: string) {
    this.volume = +value;
    this.audioService.changeVolume(+value);
  }

  setWaveForm() {
    if (this.oscillator) {
      this.oscillator.type = this.waveTypeChosen;
    }
  }

  setFrequency() {
    if (this.oscillator) this.oscillator.frequency.value = this.frequency;
  }

  startSound() {
    this.stopSound();
    this.oscillator = this.audioService.createOscillator();
    this.setWaveForm();
    this.setFrequency();
    this.audioService.startSound(this.oscillator);
  }

  stopSound() {
    if (this.oscillator) this.audioService.stopSound(this.oscillator);
  }

  onDelete() {
    this.delete.emit(this.index);
  }

  ngOnInit(): void {}
}
