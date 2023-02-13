import { CommonModule } from '@angular/common';
import {
  Component,
  ComponentRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Subject, Subscription, interval } from 'rxjs';
import { SubSink } from 'subsink';
import { RandomColorService } from '../../services/random-color.service';
import { RandomFeatsService } from '../../services/random-features.service';
import { RandomNumbersService } from '../../services/random-numbers.service';
import { SampleService } from '../../services/samples.service';
import { WindowDimensionsService } from '../../services/window-dimensions.service';
import { CircleComponent } from '../circle/circle.component';
import { ColorButtonComponent } from '../color-button/color-button.component';
import { GreetingBubbleComponent } from '../greeting-bubble/greeting-bubble.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    CircleComponent,
    ColorButtonComponent,
    MatIconModule,
    GreetingBubbleComponent,
  ],
  selector: 'app-bubbles',
  templateUrl: './bubbles.component.html',
  styleUrls: ['./bubbles.component.scss'],
})
export class BubblesComponent {
  private subs = new SubSink();

  @ViewChild('circleContainer', { read: ViewContainerRef })
  container!: ViewContainerRef;

  circleRefArray: ComponentRef<CircleComponent>[] = [];

  createCirclesSub?: Subscription;

  started = false;
  points = 0;

  private bubbleEventStreamSubject = new Subject<true>();
  private bubbleEventStream$ = this.bubbleEventStreamSubject.asObservable();

  private timeouts: number[] = [];

  constructor(
    private winService: WindowDimensionsService,
    private sampleService: SampleService
  ) {
    this.sampleService.preloadAudioFiles();
  }

  onStart() {
    this.started = true;
    this.subs.unsubscribe();
    this.container.clear();
    this.circleRefArray = [];
    this.startCircleCreationLoop();
  }

  stop() {
    this.started = false;
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
    this.timeouts = [];
    this.createCirclesSub?.unsubscribe();
  }

  startCircleCreationLoop() {
    this.subs.sink = this.bubbleEventStream$.subscribe(() => {
      this.createCircle();
    });

    this.createCirclesSub = interval(400).subscribe((index) => {
      const randomDelay = RandomFeatsService.getRandomDelayOfBubbles();
      const timeout = setTimeout(() => {
        this.bubbleEventStreamSubject.next(true);
      }, randomDelay);
      this.timeouts.push(timeout);
    });
  }

  createCircle() {
    const circle = this.container.createComponent(CircleComponent);

    const circleRadius = RandomNumbersService.getRandomNumber(50, 350, 1);

    circle.instance.life = RandomFeatsService.randomLife();
    circle.instance.radius = circleRadius;
    circle.instance.color = RandomColorService.getRandomDarkColor();
    circle.instance.position = {
      x: Math.round(Math.random() * (this.winService.width - circleRadius)),
      y: Math.round(Math.random() * (this.winService.height - circleRadius)),
    };

    this.circleRefArray.push(circle);
    const index = this.circleRefArray.length - 1;

    circle.instance.clicked.subscribe((clicked) => {
      if (clicked) this.points += 100;
    });

    circle.instance.isAlive.subscribe((isAlive) => {
      if (!isAlive) {
        const findIndex = this.circleRefArray.findIndex(
          (ref) => ref === circle
        );
        this.circleRefArray.splice(findIndex, 1);
        circle.destroy();
      }
    });
  }
}
