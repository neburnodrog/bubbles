import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BubbleSoundService } from 'src/app/services/bubble-sound.service';
import { CircleStyle } from '../../model/circle.interface';
import { RandomColorService } from '../../services/random-color.service';
import { SampleService } from '../../services/samples.service';
import { WindowDimensionsService } from '../../services/window-dimensions.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  providers: [BubbleSoundService],
})
export class CircleComponent implements OnInit {
  @Input() radius!: number;
  @Input() color!: string;
  @Input() position!: { x: number; y: number };
  @Input() life!: number;

  isAlive = new BehaviorSubject<boolean>(true);
  timeOut!: number;

  @Output() clicked = new EventEmitter<boolean>();

  @ViewChild('circle') circle!: ElementRef<HTMLDivElement>;

  style = new BehaviorSubject<CircleStyle>({
    height: '',
    width: '',
    borderRadius: '',
    position: '',
    left: '',
    top: '',
    backgroundColor: '',
    transition: '',
  });

  constructor(
    private bubbleSoundService: BubbleSoundService,
    private winService: WindowDimensionsService,
    private sampleService: SampleService
  ) {}

  ngOnInit(): void {
    this.style.next({
      height: this.radius.toString() + 'px',
      width: this.radius.toString() + 'px',
      borderRadius: '100%',
      position: 'absolute',
      left: this.position.x.toString() + 'px',
      top: this.position.y.toString() + 'px ',
      backgroundColor: this.color,
    });

    this.timeOut = window.setTimeout(() => {
      // this.bubbleSoundService.stopSound();
      this.isAlive.next(false);
    }, this.life);

    this.bubbleSoundService.configureSound(this.radius, this.color, this.life);
    // modify initial sound based on input variables;
  }

  ngAfterViewInit() {
    const animation = this.getBubbleAnimation(this.position);

    this.circle.nativeElement.animate(animation, {
      duration: 30000,
      iterations: Infinity,
      easing: 'ease-in',
    });

    const disappear = [
      {
        transform: 'scale(1)',
        backgroundColor: this.color,
      },
      {
        transform: 'scale(0)',
        backgroundColor: this.color + '00',
      },
    ];

    this.circle.nativeElement.animate(disappear, {
      duration: this.life,
      easing: 'ease-in',
    });
  }

  getBubbleAnimation(position: any) {
    const initialColor = RandomColorService.getRandomLightColor();

    let titleFrames: any = [
      {
        transform: this.getTranslation(position),
        backgroundColor: initialColor,
      },
    ];

    for (let i = 0; i < 10; i++) {
      titleFrames = titleFrames.concat([
        {
          transform: this.getTranslation(),
          backgroundColor: RandomColorService.getRandomLightColor(),
        },
      ]);
    }

    return titleFrames;
  }

  getTranslation(initialPosition?: { x: number; y: number }) {
    if (initialPosition) {
      return `
        translate3D(
          ${initialPosition.x}px,
          ${initialPosition.y}px,
          0
        )
      `;
    }

    return `translate3D(
      ${
        Math.round((Math.random() * this.winService.width) / 8) +
        (4 / 16) * this.winService.width
      }px,
      ${
        Math.round((Math.random() * this.winService.height) / 8) +
        (4 / 16) * this.winService.height
      }px,
      0
    )`;
  }

  onClick() {
    this.clicked.emit(true);
    this.sampleService.playSound();
    this.bubbleSoundService.stopSound();
    this.isAlive.next(false);
  }

  ngOnDestroy() {
    this.bubbleSoundService.disconnectOscillator();
  }
}
