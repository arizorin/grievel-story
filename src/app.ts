import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import {
    Engine, FreeCamera,
    HemisphericLight,
    Scene, Sound,
    Vector3
} from "@babylonjs/core";
import {GameState} from "./model";
import {EnvironmentState} from "./environment-state";
import {PlayerController} from "./player-controller";
import {PlayerInput} from "./input-controller";
import * as cannon from "cannon";

class App {
    private engine: Engine;
    private canvas: HTMLCanvasElement;
    private scene: Scene;

    private gameState: GameState = GameState.START;

    constructor() {
        this.canvas = App.createCanvas()
        this.engine = new Engine(this.canvas, true)
        this.scene = new Scene(this.engine)
        window.CANNON = cannon

        const light = new HemisphericLight('sun', Vector3.Left(), this.scene)
        const camera = new FreeCamera('free-camera', Vector3.Zero(), this.scene)

        this.initializeGameAsync();

        this.engine.runRenderLoop(() => {
            this.scene.render()
        })
    }

    private initializeGameAsync() {
        const environmentState = new EnvironmentState(this.scene)
        environmentState.load()

        const input = new PlayerInput(this.scene);
        const player = new PlayerController(this.scene, input, this.canvas);
    }

    private static createCanvas(): HTMLCanvasElement {
        const canvas = document.createElement('canvas')
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas)
        return canvas
    }

    public initDebug() {
        window.addEventListener("keydown", (ev) => {
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

    public playMusic() {
        fetch('./background.mp3')
            .then((response) => {
                return response.arrayBuffer()
            })
            .then((data) => {
                const sound = new Sound('background-music', data, this.scene, null, { loop: true, autoplay: true });
                console.log('MUSIC PLAYING...')
            });
    }
}

const app = new App()
app.initDebug()
app.playMusic()

