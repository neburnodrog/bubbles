import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { RandomColorService } from '../../services/random-color.service';
import { SampleService } from '../../services/samples.service';
import { WindowDimensionsService } from '../../services/window-dimensions.service';
import { ColorButtonComponent } from '../color-button/color-button.component';
import { GreetingTitleComponent } from '../greeting-title/greeting-title.component';

@Component({
  standalone: true,
  imports: [CommonModule, ColorButtonComponent, GreetingTitleComponent],
  selector: 'app-greeting-bubble',
  templateUrl: './greeting-bubble.component.html',
  styleUrls: ['./greeting-bubble.component.scss'],
})
export class GreetingBubbleComponent {
  private initialPosition = {
    x: this.winService.width / 3.5,
    y: this.winService.height / 5,
  };

  @ViewChild('greetingBubble') greetingBubble!: ElementRef<HTMLDivElement>;

  @Output() start: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private winService: WindowDimensionsService,
    private sampleService: SampleService
  ) {}

  ngAfterViewInit() {
    this.animateStartingBubble();
  }

  onClick() {
    this.start.emit(true);
    this.sampleService.preloadAudioFiles();
  }

  animateStartingBubble() {
    const bubleAnimationFrames = this.getBubbleAnimationFrames(
      this.initialPosition
    );

    this.greetingBubble.nativeElement.animate(bubleAnimationFrames, {
      duration: 50000,
      iterations: Infinity,
      easing: 'ease-in-out',
    });
  }

  getBubbleAnimationFrames(initialPosition?: any): Keyframe[] {
    const initialColor = RandomColorService.getRandomLightColor();
    const initialFrame = {
      transform: this.getTransformationVal(initialPosition),
      backgroundColor: initialColor,
    };

    const transformations = new Array(20).fill(null).map(() => ({
      transform: this.getTransformationVal(),
      backgroundColor: RandomColorService.getRandomLightColor(),
    }));

    const frames = [initialFrame, ...transformations, initialFrame];

    return frames;
  }

  getTransformationVal(initialPosition?: { x: number; y: number }): string {
    const xValue = initialPosition
      ? initialPosition.x
      : Math.round((Math.random() * this.winService.width) / 8) +
        (4 / 16) * this.winService.width;

    const yValue = initialPosition
      ? initialPosition.y
      : Math.round((Math.random() * this.winService.height) / 8) +
        (4 / 16) * this.winService.height;

    return `translate(${xValue}px, ${yValue}px)`;
  }
}
