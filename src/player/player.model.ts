import { AnimationGroup } from '@babylonjs/core';

export enum PlayerState {
    IDLE,
    WALKING,
    JUMPING
}

export type PlayerAnimation = Record<PlayerState, AnimationGroup>
