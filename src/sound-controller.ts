import { Scene, Sound } from '@babylonjs/core';

export class SoundController {
  stepSound: Sound;

  constructor(scene: Scene) {
    this.stepSound = new Sound('step', '/sounds/step.mp3', scene, (() => {
    }), {
      volume: 0.008,
      playbackRate: 1.5,
    });
  }
}
