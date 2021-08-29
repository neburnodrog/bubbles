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
import { ɵBrowserAnimationFactory } from '@angular/platform-browser/animations';
import { fromEvent, interval, Subscription } from 'rxjs';
import { SubSink } from 'subsink';
import { CircleComponent } from './components/circle/circle.component';
import { RandomColorService } from './services/randomColorService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  winWidth = window.innerWidth;
  winHeight = window.innerHeight;

  @ViewChild('circleContainer', { read: ViewContainerRef })
  container!: ViewContainerRef;

  @ViewChild('greeting') greeting!: ElementRef<HTMLHeadingElement>;

  circleFactory!: ComponentFactory<CircleComponent>;
  circleRefArray: ComponentRef<CircleComponent>[] = [];

  title = 'pop the circles';

  windowResizeSubscription!: Subscription;
  createCirclesSub?: Subscription;

  started = false;
  points = 0;

  constructor(
    private resolver: ComponentFactoryResolver,
    private randomColorService: RandomColorService,
    private el: ElementRef
  ) {}

  ngOnInit() {
    console.log('app onInit');
    this.windowResizeSubscription = fromEvent(window, 'resize').subscribe(
      (event: Event) => {
        console.log('window resized');
        const window = event.target as Window;
        this.winWidth = window.innerWidth;
        this.winHeight = window.innerHeight;
      }
    );
  }

  ngAfterViewInit() {
    console.log('app afterViewInit');
    this.circleFactory = this.resolver.resolveComponentFactory(CircleComponent);
    const body = this.el.nativeElement.parentNode;
    console.log(body);
    this.animateBackground(body);
  }

  animateBackground(body: HTMLBodyElement) {
    const backgroundAnimation = [
      { backgroundColor: this.randomColorService.getRandomHexColor() },
      { backgroundColor: this.randomColorService.getRandomHexColor() },
      { backgroundColor: this.randomColorService.getRandomHexColor() },
      { backgroundColor: this.randomColorService.getRandomHexColor() },
      { backgroundColor: this.randomColorService.getRandomHexColor() },
      { backgroundColor: this.randomColorService.getRandomHexColor() },
    ];

    body.animate(backgroundAnimation, {
      duration: 10000,
      iterations: Infinity,
    });
  }

  moveTitle() {}

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
        x: Math.round(Math.random() * (this.winWidth - circleRadius)),
        y: Math.round(Math.random() * (this.winHeight - circleRadius)),
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
