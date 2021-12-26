import { AnimationGroup } from '@babylonjs/core';
import { PlayerAnimation, PlayerState } from './player.model';

export class AnimationController {
  protected playerAnimations: PlayerAnimation;

  protected prevAnimation: AnimationGroup;

  protected currAnimation: AnimationGroup;

  constructor(availableAnimations: PlayerAnimation) {
    this.playerAnimations = availableAnimations;
  }

  public runAnimations(playerState: PlayerState) {
    switch (playerState) {
      case PlayerState.IDLE:
        this.currAnimation = this.playerAnimations[PlayerState.IDLE];
        break;
      case PlayerState.WALKING:
        this.currAnimation = this.playerAnimations[PlayerState.WALKING];
        break;
    }

    if (this.currAnimation != null && this.currAnimation !== this.prevAnimation) {
      this.prevAnimation?.stop();
      this.currAnimation?.play(true);
      this.prevAnimation = this.currAnimation;
    }
  }
}
