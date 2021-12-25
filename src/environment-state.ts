import {Mesh, MeshBuilder, Scene, Vector3} from "@babylonjs/core";
import {GameMaterial} from "./game-material";
import {GameMaterialNames, gameMaterials} from "./model";

export class EnvironmentState {
    private readonly scene: Scene;
    private readonly gameMaterials: gameMaterials;
    private props: Mesh[] = [];

    constructor(scene: Scene) {
        this.scene = scene
        this.gameMaterials = new GameMaterial(this.scene).materials
    }

    public load() {
        this.createGround()
        this.createObstacles()
    }

    private createObstacles() {
        for(let i = 0; i < 10; i++) {
            this.createBox((i % 2 * 2), i * 4 + 1)
        }
    }

    private createGround() {
        const ground = MeshBuilder.CreateGround("ground", {}, this.scene);
        ground.scaling = new Vector3(5,.02,100);
        ground.material = this.gameMaterials[GameMaterialNames.GROUND]
    }

    private createBox(x: number, z: number, y: number = 0.5) {
        const box = MeshBuilder.CreateBox(`box-${x}-${z}`, {}, this.scene)
        box.position = new Vector3(x, y, z)
        box.material = this.gameMaterials[GameMaterialNames.BOX]
        this.props.push(box);
    }
}
