import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { SubSink } from 'subsink';
import { CircleComponent } from './components/circle/circle.component';
import { AnimationService } from './services/animationService';
import { RandomColorService } from './services/randomColorService';
import { WindowDimensionsService } from './services/windowDimensionsService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private subs = new SubSink();

  @ViewChild('circleContainer', { read: ViewContainerRef })
  container!: ViewContainerRef;

  @ViewChild('greeting') greetingBubble!: ElementRef<HTMLDivElement>;
  @ViewChild('title') title!: ElementRef<HTMLHeadingElement>;

  circleFactory!: ComponentFactory<CircleComponent>;
  circleRefArray: ComponentRef<CircleComponent>[] = [];

  windowResizeSubscription!: Subscription;
  createCirclesSub?: Subscription;

  started = false;
  points = 0;

  constructor(
    private resolver: ComponentFactoryResolver,
    private randomColorService: RandomColorService,
    private el: ElementRef,
    private animationService: AnimationService,
    private winService: WindowDimensionsService
  ) {}

  ngAfterViewInit() {
    this.circleFactory = this.resolver.resolveComponentFactory(CircleComponent);
    const body = this.el.nativeElement.parentNode;
    this.animateBackground(body);
    this.greetingBubbleColor();
    this.separateLetterOfTitle();
  }

  animateBackground(body: HTMLBodyElement) {
    const bodyFrames = this.animationService.getBodyFrames();
    body.animate(bodyFrames, {
      duration: 10000,
      iterations: Infinity,
    });
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
      easing: 'linear',
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
    this.createCirclesSub = interval(100).subscribe(() => {
      const circle = this.container.createComponent(this.circleFactory);

      const circleLife = Math.random() * 5 * 1000 + 5000;
      const circleColor = this.randomColorService.getRandomHexColor();
      const circleRadius = Math.random() * 300;
      const circlePosition = {
        x: Math.round(Math.random() * (this.winService.width - circleRadius)),
        y: Math.round(Math.random() * (this.winService.height - circleRadius)),
      };

      circle.instance.color = circleColor;
      circle.instance.radius = circleRadius;
      circle.instance.position = circlePosition;
      circle.instance.life = circleLife;

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

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.windowResizeSubscription.unsubscribe();
    this.createCirclesSub?.unsubscribe();
    this.circleRefArray.forEach((instance) => instance.destroy());
  }
}
