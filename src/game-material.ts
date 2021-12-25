import {Scene, StandardMaterial, Texture} from "@babylonjs/core";
import {GameMaterialNames, gameMaterials} from "./model";

export class GameMaterial {
    materials: gameMaterials;

    constructor(scene: Scene) {
        this.materials = {
            ...this.materials,
            [GameMaterialNames.GROUND]: (() => {
               const material = new StandardMaterial(GameMaterialNames.GROUND, scene)
               const texture = new Texture('/textures/ground.jpg', scene)
               texture.uScale = 2.5;
               texture.vScale = 50;
               material.diffuseTexture = texture
               return material
            })(),
            [GameMaterialNames.BOX]: (() => {
                const material = new StandardMaterial(GameMaterialNames.BOX, scene)
                const texture = new Texture('/textures/box.jpg', scene)
                material.diffuseTexture = texture
                return material
            })()
        }
    }
}
