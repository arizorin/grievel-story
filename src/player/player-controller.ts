import {
  AbstractMesh, Quaternion, Scene, SceneLoader, TransformNode, UniversalCamera, Vector3,
} from '@babylonjs/core';
import { PlayerInput } from './input-controller';
import { AnimationController } from './animation-controller';
import { PlayerAnimation, PlayerState } from './player.model';

export class PlayerController extends TransformNode {
  private readonly scene: Scene;

  private camera: UniversalCamera;

  private camRoot: TransformNode;

  private input: PlayerInput;

  private readonly canvas: HTMLCanvasElement;

  private animationController: AnimationController;

  public player: AbstractMesh;

  private playerState: PlayerState = PlayerState.IDLE;

  private playerMaxSpeed = 0.1;

  constructor(scene: Scene, input: PlayerInput, canvas: HTMLCanvasElement) {
    super('player', scene);
    this.scene = scene;
    this.input = input;
    this.canvas = canvas;

    this.createCharacter();
  }

  private async createCharacter() {
    const playerMesh = await SceneLoader.ImportMeshAsync('', './models/', 'Elf.gltf', this.scene);
    const body = playerMesh.meshes[0];
    body.isPickable = false;
    body.getChildMeshes().forEach((mesh) => {
      mesh.isPickable = false;
    });
    this.player = body;

    const playerAnimations: PlayerAnimation = {
      [PlayerState.IDLE]: playerMesh.animationGroups[2],
      [PlayerState.WALKING]: playerMesh.animationGroups[8],
      [PlayerState.JUMPING]: playerMesh.animationGroups[3],
    };
    this.animationController = new AnimationController(playerAnimations);

    this.setCamera();
  }

  private setCamera() {
    this.camRoot = new TransformNode('root');
    this.camRoot.position = new Vector3(0, 0, 0);
    this.camRoot.rotation = new Vector3(0, Math.PI, 0);

    const yTilt = new TransformNode('ytilt');
    yTilt.rotation = new Vector3(0.5934119456780721, 0, 0);
    yTilt.parent = this.camRoot;

    this.camera = new UniversalCamera('cam', new Vector3(0, 0, -30), this.scene);
    this.camera.lockedTarget = this.camRoot.position;
    this.camera.fov = 1;
    this.camera.parent = yTilt;

    this.scene.activeCamera = this.camera;

    this.scene.registerBeforeRender(() => {
      this.animationController.runAnimations(this.playerState);
      this.updatePlayerPosition();
    });
  }

  private updatePlayerPosition() {
    const deltaTime = this.scene.getEngine().getDeltaTime() / 1000.0;

    let moveDirection = Vector3.Zero();
    const h = this.input.horizontal; // right, x
    const v = this.input.vertical; // fwd, z

    // --MOVEMENTS BASED ON CAMERA (as it rotates)--
    const fwd = this.camRoot.forward;
    const { right } = this.camRoot;
    const correctedVertical = fwd.scaleInPlace(v);
    const correctedHorizontal = right.scaleInPlace(h);

    // movement based off of camera's view
    const move = correctedHorizontal.addInPlace(correctedVertical);

    // clear y so that the character doesnt fly up, normalize for next step, taking into account whether we've DASHED or not
    moveDirection = new Vector3((move).normalize().x, 0, (move).normalize().z);

    // clamp the input value so that diagonal movement isn't twice as fast
    const inputMag = Math.abs(h) + Math.abs(v);
    let inputAmt = 0;
    if (inputMag < 0) {
      inputAmt = 0;
    } else if (inputMag > this.playerMaxSpeed) {
      inputAmt = this.playerMaxSpeed;
    } else {
      inputAmt = inputMag;
    }

    // check if there is movement to determine if rotation is needed
    const input = new Vector3(this.input.horizontalAxis, 0, this.input.verticalAxis);
    if (input.length() === 0) {
      this.playerState = PlayerState.IDLE;
      return;
    }
    this.playerState = PlayerState.WALKING;

    // rotation based on input & the camera angle
    const angle = Math.atan2(this.input.horizontalAxis, this.input.verticalAxis);

    const targ = Quaternion.FromEulerAngles(0, angle, 0);
    this.player.rotationQuaternion = Quaternion.Slerp(this.player.rotationQuaternion, targ, 10 * deltaTime);

    this.player.moveWithCollisions(moveDirection.scaleInPlace(inputAmt));
  }
}
