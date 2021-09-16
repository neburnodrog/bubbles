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
import { BubbleSoundService } from 'src/app/services/bubbleSound.service';
import { SubSink } from 'subsink';

type CircleStyle = {
  backgroundColor?: string;
  borderRadius?: string;
  height?: string;
  width?: string;
  position?: string;
  left?: string;
  top?: string;
  transition?: string;
};

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss'],
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

  private subs = new SubSink();

  constructor(private bubbleSoundService: BubbleSoundService) {}

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

    this.bubbleSoundService.configureSound(this.radius, this.color);
    // modify initial sound based on input variables;
  }

  ngAfterViewInit() {
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

  onClick() {
    this.clicked.emit(true);
    this.isAlive.next(false);
  }

  ngOnDestroy() {
    window.clearTimeout(this.timeOut);
  }
}
