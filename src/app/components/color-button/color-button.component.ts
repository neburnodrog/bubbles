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
  @ViewChild('button') private button!: ElementRef<HTMLButtonElement>;

  constructor() {}

  ngAfterViewInit() {
    console.log(this.button);
    this.animateButton();
  }

  animateButton() {
    const buttonFrames = this.getButtonAnimationFrames();
    this.button.nativeElement.animate(buttonFrames, {
      duration: 200,
      iterations: Infinity,
      easing: 'linear',
    });
  }

  getButtonAnimationFrames() {
    const initialColor = RandomColorService.getRandomDarkColor();

    const buttonFrames = [
      { backgroundColor: initialColor },
      { backgroundColor: RandomColorService.getRandomDarkColor() },
      { backgroundColor: RandomColorService.getRandomDarkColor() },
      { backgroundColor: RandomColorService.getRandomDarkColor() },
      { backgroundColor: RandomColorService.getRandomDarkColor() },
      { backgroundColor: RandomColorService.getRandomDarkColor() },
      { backgroundColor: initialColor },
    ];

    return buttonFrames;
  }
}
