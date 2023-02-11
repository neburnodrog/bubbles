import {
  AfterViewInit,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  Component,
} from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { SubSink } from 'subsink';
import { CircleComponent } from '../circle/circle.component';
import { AnimationService } from '../../services/animation.service';
import { RandomColorService } from '../../services/random-color.service';
import { WindowDimensionsService } from '../../services/windowDimensionsService';

@Component({
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

  circleFactory!: ComponentFactory<CircleComponent>;
  circleRefArray: ComponentRef<CircleComponent>[] = [];

  createCirclesSub?: Subscription;

  started = false;
  points = 0;

  constructor(
    private resolver: ComponentFactoryResolver,
    private randomColorService: RandomColorService,
    private animationService: AnimationService,
    private winService: WindowDimensionsService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.circleFactory = this.resolver.resolveComponentFactory(CircleComponent);
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
    this.createCirclesSub = interval(200).subscribe(() => {
      console.log(this.winService.width);
      const circle = this.container.createComponent(this.circleFactory);

      const circleLife = Math.random() * 5 * 1000 + 5000;
      const circleColor = this.randomColorService.getRandomDarkColor();
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
