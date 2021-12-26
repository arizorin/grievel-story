import {
  Scene, ActionManager, ExecuteCodeAction, Scalar,
} from '@babylonjs/core';

export class PlayerInput {
  public inputMap: any;

  public horizontal: number = 0;

  public vertical: number = 0;

  public horizontalAxis: number = 0;

  public verticalAxis: number = 0;

  private readonly scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
    this.scene.actionManager = new ActionManager(this.scene);

    this.inputMap = {};

    this.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
      this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === 'keydown';
    }));

    this.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
      this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === 'keydown';
    }));

    scene.onBeforeRenderObservable.add(() => {
      this.updateFromKeyboard();
    });
  }

  private updateFromKeyboard(): void {
    if (this.inputMap.w) {
      this.vertical = Scalar.Lerp(this.vertical, 1, 0.2);
      this.verticalAxis = 1;
    } else if (this.inputMap.s) {
      this.vertical = Scalar.Lerp(this.vertical, -1, 0.2);
      this.verticalAxis = -1;
    } else {
      this.vertical = 0;
      this.verticalAxis = 0;
    }

    if (this.inputMap.a) {
      this.horizontal = Scalar.Lerp(this.horizontal, -1, 0.2);
      this.horizontalAxis = -1;
    } else if (this.inputMap.d) {
      this.horizontal = Scalar.Lerp(this.horizontal, 1, 0.2);
      this.horizontalAxis = 1;
    } else {
      this.horizontal = 0;
      this.horizontalAxis = 0;
    }
  }
}
