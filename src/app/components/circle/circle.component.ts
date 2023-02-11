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
import { SubSink } from 'subsink';
import { CircleStyle } from '../../model/circle.interface';
import { SamplesService } from '../../services/samples.service';

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

  private subs = new SubSink();

  constructor(
    private bubbleSoundService: BubbleSoundService,
    private sampleService: SamplesService
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
    this.sampleService.playSound();
    this.bubbleSoundService.stopSound();
    this.isAlive.next(false);
  }

  ngOnDestroy() {
    window.clearTimeout(this.timeOut);
  }
}
