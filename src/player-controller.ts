import {
    AbstractMesh, AnimationGroup, AnimationPropertiesOverride,
    ArcRotateCamera, Color3, Color4,
    Matrix,
    Mesh,
    MeshBuilder, Quaternion,
    Scene, SceneLoader, SceneLoaderAnimationGroupLoadingMode,
    ShadowGenerator, StandardMaterial,
    TransformNode, UniversalCamera,
    Vector3
} from "@babylonjs/core";
import {PlayerInput} from "./input-controller";

export class PlayerController extends TransformNode {
    private readonly scene: Scene;
    private camera: ArcRotateCamera;
    private input: PlayerInput;
    private canvas: HTMLCanvasElement;

    public player: AbstractMesh;
    private _deltaTime: number = 0;
    private _h: number;
    private _v: number;
    private _moveDirection: Vector3 = new Vector3();
    private _inputAmt: number;

    private _animations: AnimationGroup[];
    private _prevAnimation: AnimationGroup;
    private _currAnimation: AnimationGroup;

    constructor(scene: Scene, input: PlayerInput, canvas: HTMLCanvasElement) {
        super('player', scene);
        this.scene = scene;
        this.input = input;
        this.canvas = canvas;

        this.createCharacter()
    }

    private beforeRenderUpdate(): void {
        this.updateFromControls();
        this.player.moveWithCollisions(this._moveDirection);
    }

    private updateFromControls() {
        this._moveDirection = Vector3.Zero();
        this._h = this.input.horizontal;
        this._v = this.input.vertical;

        let fwd = this.player.forward;
        let right = this.player.right;
        let correctedVertical = fwd.scaleInPlace(this._v);
        let correctedHorizontal = right.scaleInPlace(this._h);

        let move = correctedHorizontal.addInPlace(correctedVertical);
        this._moveDirection = new Vector3((move).normalize().x, 0, (move).normalize().z);

        let inputMag = Math.abs(this._h) + Math.abs(this._v);
        if (inputMag < 0) {
            this._inputAmt = 0;
        } else if (inputMag > 0.15) {
            this._inputAmt = 0.1;
        } else {
            this._inputAmt = inputMag;
        }

        this._moveDirection = this._moveDirection.scaleInPlace(this._inputAmt * 0.5);

        let input = new Vector3(this.input.horizontalAxis, 0, this.input.verticalAxis); //along which axis is the direction
        if (input.length() == 0) {//if there's no input detected, prevent rotation and keep player in same rotation
            return;
        }

        // //rotation based on input & the camera angle
        // let angle = Math.atan2(this.input.horizontalAxis, this.input.verticalAxis);
        // angle += this.camera.rotation.y;
        // let targ = Quaternion.FromEulerAngles(0, angle, 0);
        // this.player.rotationQuaternion = Quaternion.Slerp(this.player.rotationQuaternion, targ, 10 * this._deltaTime);
    }


    private animate() {
        if (this.input.inputMap["w"] || this.input.inputMap["s"] || this.input.inputMap["a"] || this.input.inputMap["d"] ) {
            this._currAnimation = this._animations[8]
        } else {
            this._currAnimation = this._animations[2]
        }

        if(this._currAnimation != null && this._currAnimation !== this._prevAnimation){
            this._prevAnimation?.stop()
            this._currAnimation.play(true);
            this._prevAnimation = this._currAnimation
        }
    }

    private async createCharacter() {
        const playerMesh = await SceneLoader.ImportMeshAsync("", "./models/", "Elf.gltf", this.scene);
        this.player = playerMesh.meshes[0]
        this._animations = playerMesh.animationGroups
        console.log(this._animations)
        this.setCamera();
    }

    private setCamera() {
        this.camera = new ArcRotateCamera("arc", -Math.PI/2, Math.PI/2, 40, new Vector3(0,3,0), this.scene);
        this.camera.attachControl(this.canvas, true);
        this.camera.setTarget(this.player)
        this.scene.activeCamera = this.camera

        this.scene.registerBeforeRender(() => {
            this.beforeRenderUpdate();
            this.updateFromControls();
            this.animate();
        })
    }
}
