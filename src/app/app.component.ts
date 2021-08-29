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

  @ViewChild('greeting') greeting!: ElementRef<HTMLDivElement>;

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
    // this.moveTitle();
  }

  animateBackground(body: HTMLBodyElement) {
    const bodyFrames = this.animationService.getBodyFrames();
    body.animate(bodyFrames, {
      duration: 10000,
      iterations: Infinity,
    });
  }

  // moveTitle() {
  //   const initialPosition = {
  //     x: this.greeting.nativeElement.offsetWidth,
  //     y: this.greeting.nativeElement.offsetHeight,
  //   };
  //   const titleAnimationKeyFrames =
  //     this.animationService.getTitleAnimationFrames(initialPosition);

  //   console.log({ titleAnimationKeyFrames });

  //   this.greeting.nativeElement.animate(titleAnimationKeyFrames, {
  //     duration: 30000,
  //     iterations: Infinity,
  //     easing: 'ease-in',
  //   });
  // }

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
  }

  createCircles() {
    this.createCirclesSub = interval(100).subscribe(() => {
      const circle = this.container.createComponent(this.circleFactory);

      const circleLife = Math.random() * 5 * 1000 + 5000;
      const circleColor = this.randomColorService.getRandomHexColor();
      const circleRadius = Math.random() * 200;
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
