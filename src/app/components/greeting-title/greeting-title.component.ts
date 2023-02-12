import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-greeting-title',
  templateUrl: './greeting-title.component.html',
  styleUrls: ['./greeting-title.component.scss'],
})
export class GreetingTitleComponent {
  @ViewChild('title') title!: ElementRef<HTMLHeadingElement>;

  ngAfterViewInit() {
    this.animateTitle();
  }

  animateTitle() {
    const letterFrames = this.getTitleAnimationFrames();
    this.title.nativeElement.animate(letterFrames, {
      duration: 3000,
      iterations: Infinity,
      easing: 'ease-in-out',
    });
  }

  getTitleAnimationFrames() {
    return [
      { letterSpacing: '0.1px', fontSize: '3rem' },
      { letterSpacing: '10px', fontSize: '3.5rem' },
      { letterSpacing: '0.1px', fontSize: '3rem' },
    ];
  }
}
