import { Component, ElementRef, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RandomColorService } from './services/random-color.service';

@Component({
  imports: [RouterOutlet],
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit() {
    const body = this.el.nativeElement.parentNode;
    this.animateBackground(body);
  }

  animateBackground(body: HTMLBodyElement) {
    const bodyFrames = this.getBodyFrames();
    body.animate(bodyFrames, {
      duration: 10000,
      iterations: Infinity,
    });
  }

  getBodyFrames() {
    const initialColor = RandomColorService.getRandomLightColor();
    const backgroundAnimationKeyFrames = [
      { backgroundColor: initialColor },
      { backgroundColor: RandomColorService.getRandomLightColor() },
      { backgroundColor: RandomColorService.getRandomLightColor() },
      { backgroundColor: RandomColorService.getRandomLightColor() },
      { backgroundColor: RandomColorService.getRandomLightColor() },
      { backgroundColor: initialColor },
    ];

    return backgroundAnimationKeyFrames;
  }
}
