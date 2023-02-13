import { Component, ElementRef, ViewChild } from '@angular/core';
import { RandomColorService } from '../../services/random-color.service';

@Component({
  standalone: true,
  providers: [RandomColorService],
  selector: 'app-color-button',
  templateUrl: './color-button.component.html',
  styleUrls: ['./color-button.component.scss'],
})
export class ColorButtonComponent {
  @ViewChild('startButton') startButton!: ElementRef<HTMLButtonElement>;

  constructor() {}

  ngAfterViewInit() {
    this.animateButton();
  }

  animateButton() {
    const buttonFrames = this.getButtonAnimationFrames();

    console.log({ button: this.startButton, buttonFrames });

    this.startButton.nativeElement.animate(buttonFrames, {
      duration: 2000,
      iterations: Infinity,
      easing: 'linear',
    });
  }

  getButtonAnimationFrames() {
    const initialColor = RandomColorService.getRandomLightColor();

    const buttonFrames = [
      { backgroundColor: initialColor },
      { backgroundColor: RandomColorService.getRandomLightColor() },
      { backgroundColor: initialColor },
    ];

    return buttonFrames;
  }
}
