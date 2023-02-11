import { Component, ElementRef, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnimationService } from './services/animation.service';

@Component({
  imports: [RouterOutlet],
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
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
