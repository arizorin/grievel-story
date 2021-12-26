import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';
import '@babylonjs/loaders/glTF';
import {
  CannonJSPlugin, Color3, DirectionalLight,
  Engine, FreeCamera,
  HemisphericLight, Mesh,
  Scene, ShadowGenerator, Sound,
  Vector3,
} from '@babylonjs/core';
import * as cannon from 'cannon';
import { GameState } from './model';
import { EnvironmentController } from './environment-controller';
import { PlayerController } from './player/player-controller';
import { PlayerInput } from './player/input-controller';
import { GameMaterial } from './game-material';
import { GameMaterialNames } from './material.model';

class App {
  private engine: Engine;

  private canvas: HTMLCanvasElement;

  private scene: Scene;

  private gameState: GameState = GameState.START;

  private shadowGenerator: ShadowGenerator;

  constructor() {
    this.canvas = App.createCanvas();
    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);
    window.CANNON = cannon;
    this.scene.enablePhysics(new Vector3(0, -10, 0), new CannonJSPlugin());
    this.scene.collisionsEnabled = true;

    const light = new DirectionalLight('sun', new Vector3(-10, -2, -1), this.scene);
    light.diffuse = new Color3(0.08627450980392157, 0.10980392156862745, 0.15294117647058825);
    light.intensity = 35;
    light.radius = 15;

    this.shadowGenerator = new ShadowGenerator(1024, light);
    this.shadowGenerator.darkness = 0.4;
    this.shadowGenerator.useExponentialShadowMap = true;

    const camera = new FreeCamera('free-camera', Vector3.Zero(), this.scene);

    this.initializeGameAsync();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  private initializeGameAsync() {
    // this.playMusic();
    this.initSkybox();

    const environmentState = new EnvironmentController(this.scene);
    environmentState.load();

    const input = new PlayerInput(this.scene);
    const player = new PlayerController(this.scene, input, this.canvas, this.shadowGenerator);
  }

  private static createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.id = 'gameCanvas';
    document.body.appendChild(canvas);
    return canvas;
  }

  private initSkybox() {
    const { materials } = new GameMaterial(this.scene);
    const skyBox = Mesh.CreateBox('skyBox', 11000.0, this.scene);
    skyBox.material = materials[GameMaterialNames.SKY_BOX];
  }

  private playMusic() {
    fetch('./background.mp3')
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const sound = new Sound('background-music', data, this.scene, null, { loop: true, autoplay: true });
        console.log('MUSIC PLAYING...');
      });
  }

  public initDebug() {
    window.addEventListener('keydown', (ev) => {
      // F2
      if (ev.keyCode === 113) {
        if (this.scene.debugLayer.isVisible()) {
          this.scene.debugLayer.hide();
        } else {
          this.scene.debugLayer.show();
        }
      }
    });
  }
}

const app = new App();
app.initDebug();
