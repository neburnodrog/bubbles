import { Injectable } from '@angular/core';
import { RandomColorService } from './randomColorService';
import { WindowDimensionsService } from './windowDimensionsService';

@Injectable({ providedIn: 'root' })
export class AnimationService {
  constructor(
    private randomColorService: RandomColorService,
    private winService: WindowDimensionsService
  ) {}

  getTitleDivAnimationFrames(initialPosition: any) {
    const initialColor = this.randomColorService.getRandomLightColor();

    let titleFrames: any = [
      {
        transform: this.getTranslation(initialPosition),
        backgroundColor: initialColor,
      },
    ];

    for (let i = 0; i < 10; i++) {
      titleFrames = titleFrames.concat([
        {
          transform: this.getTranslation(),
          backgroundColor: this.randomColorService.getRandomLightColor(),
        },
      ]);
    }

    titleFrames.push({
      transform: this.getTranslation(initialPosition),
      backgroundColor: initialColor,
    });
    // const titleFrames = [
    //   { backgroundColor: initialColor },
    //   { backgroundColor: this.randomColorService.getRandomDarkColor() },
    //   { backgroundColor: this.randomColorService.getRandomDarkColor() },
    //   { backgroundColor: this.randomColorService.getRandomDarkColor() },
    //   { backgroundColor: this.randomColorService.getRandomDarkColor() },
    //   { backgroundColor: this.randomColorService.getRandomDarkColor() },
    //   { backgroundColor: initialColor },
    // ];

    return titleFrames;
  }

  getTitleLetterSeparate() {
    return [
      { letterSpacing: '0.1px', fontSize: '3rem' },
      { letterSpacing: '10px', fontSize: '3.5rem' },
      { letterSpacing: '0.1px', fontSize: '3rem' },
    ];
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

  getBodyFrames() {
    const initialColor = this.randomColorService.getRandomLightColor();
    const backgroundAnimationKeyFrames = [
      { backgroundColor: initialColor },
      { backgroundColor: this.randomColorService.getRandomLightColor() },
      { backgroundColor: this.randomColorService.getRandomLightColor() },
      { backgroundColor: this.randomColorService.getRandomLightColor() },
      { backgroundColor: this.randomColorService.getRandomLightColor() },
      { backgroundColor: initialColor },
    ];

    return backgroundAnimationKeyFrames;
  }

  getScoreAnimationFrames() {}
}
