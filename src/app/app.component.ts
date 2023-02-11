import { Component, ElementRef, OnInit } from '@angular/core';
import { AnimationService } from './services/animation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private el: ElementRef,
    private animationService: AnimationService
  ) {}

  ngOnInit() {
    const body = this.el.nativeElement.parentNode;
    this.animateBackground(body);
  }

  animateBackground(body: HTMLBodyElement) {
    const bodyFrames = this.animationService.getBodyFrames();
    body.animate(bodyFrames, {
      duration: 10000,
      iterations: Infinity,
    });
  }
}
