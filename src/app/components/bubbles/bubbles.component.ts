import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Subscription, interval } from 'rxjs';
import { SubSink } from 'subsink';
import { AnimationService } from '../../services/animation.service';
import { RandomColorService } from '../../services/random-color.service';
import { RandomFeatsService } from '../../services/random-features.service';
import { WindowDimensionsService } from '../../services/window-dimensions.service';
import { CircleComponent } from '../circle/circle.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    CircleComponent,
  ],
  selector: 'app-bubbles',
  templateUrl: './bubbles.component.html',
  styleUrls: ['./bubbles.component.scss'],
})
export class BubblesComponent implements OnInit, OnDestroy, AfterViewInit {
  private subs = new SubSink();

  @ViewChild('circleContainer', { read: ViewContainerRef })
  container!: ViewContainerRef;

  @ViewChild('greeting') greetingBubble!: ElementRef<HTMLDivElement>;
  @ViewChild('title') title!: ElementRef<HTMLHeadingElement>;

  circleRefArray: ComponentRef<CircleComponent>[] = [];

  createCirclesSub?: Subscription;

  started = false;
  points = 0;

  constructor(
    private randomColorService: RandomColorService,
    private animationService: AnimationService,
    private winService: WindowDimensionsService,
    private randomLifeService: RandomFeatsService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.greetingBubbleColor();
    this.separateLetterOfTitle();
  }

  greetingBubbleColor() {
    const initialPosition = {
      x: this.winService.width / 3.5,
      y: this.winService.height / 5,
    };

    const titleAnimationKeyFrames =
      this.animationService.getTitleDivAnimationFrames(initialPosition);

    this.greetingBubble.nativeElement.animate(titleAnimationKeyFrames, {
      duration: 30000,
      iterations: Infinity,
      easing: 'ease-in',
    });
  }

  separateLetterOfTitle() {
    const letterFrames = this.animationService.getTitleLetterSeparate();
    this.title.nativeElement.animate(letterFrames, {
      duration: 3000,
      iterations: Infinity,
      easing: 'ease-in',
    });
  }

  start() {
    this.started = true;
    this.subs.unsubscribe();
    this.container.clear();
    this.circleRefArray = [];
    this.createCircles();
  }

  stop() {
    this.started = false;
    this.createCirclesSub?.unsubscribe();
    window.setTimeout(() => {
      this.greetingBubbleColor();
      this.separateLetterOfTitle();
    });
  }

  createCircles() {
    this.createCirclesSub = interval(500).subscribe(() => {
      const circle = this.container.createComponent(CircleComponent);

      const circleRadius = Math.floor(Math.random() * 300);

      circle.instance.life = this.randomLifeService.randomLife();
      circle.instance.radius = circleRadius;
      circle.instance.color = this.randomColorService.getRandomDarkColor();
      circle.instance.position = {
        x: Math.round(Math.random() * (this.winService.width - circleRadius)),
        y: Math.round(Math.random() * (this.winService.height - circleRadius)),
      };

      this.circleRefArray.push(circle);
      const index = this.circleRefArray.length - 1;

      this.subs.sink = circle.instance.clicked.subscribe((clicked) => {
        if (clicked) this.points += 100;
      });

      this.subs.sink = circle.instance.isAlive.subscribe((isAlive) => {
        if (!isAlive) {
          circle.destroy();
          this.circleRefArray.splice(index, 1);
        }
      });
    });
  }

  onInfoClick() {
    confirm(
      'Just click on the bubbles to pop them and see how you score grows.'
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.createCirclesSub?.unsubscribe();
    this.circleRefArray.forEach((instance) => instance.destroy());
  }
}
