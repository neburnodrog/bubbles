import { Injectable } from '@angular/core';
import { RandomColorService } from './randomColorService';
import { WindowDimensionsService } from './windowDimensionsService';

@Injectable({ providedIn: 'root' })
export class AnimationService {
  constructor(
    private randomColorService: RandomColorService,
    private winService: WindowDimensionsService
  ) {}

  getTitleAnimationFrames(initialPosition: { x: number; y: number }) {
    const initialColor = this.randomColorService.getRandomDarkColor();

    let titleFrames: { color: string; transform?: string }[] = [
      { transform: this.getTranslation(initialPosition), color: initialColor },
    ];

    for (let i = 0; i < 10; i++) {
      titleFrames = titleFrames.concat([
        {
          color: this.randomColorService.getRandomDarkColor(),
        },
        {
          color: this.randomColorService.getRandomDarkColor(),
        },
        {
          transform: this.getTranslation(),
          color: this.randomColorService.getRandomDarkColor(),
        },
      ]);
    }

    titleFrames.push({
      transform: this.getTranslation(initialPosition),
      color: initialColor,
    });

    return titleFrames;
  }

  getTranslation(initialPosition?: { x: number; y: number }) {
    if (initialPosition) {
      return `
        translate3D(
          ${initialPosition.x},
          ${initialPosition.y},
          0
        )
      `;
    }

    return `translate3D(
      ${
        Math.round((Math.random() * this.winService.width) / 8) +
        (8 / 16) * this.winService.width
      }px,
      ${
        Math.round((Math.random() * this.winService.height) / 8) +
        (8 / 16) * this.winService.height
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
}
