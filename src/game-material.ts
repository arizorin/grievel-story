import { Scene, StandardMaterial, Texture } from '@babylonjs/core';
import { GameMaterialNames, GameMaterials } from './material.model';

export class GameMaterial {
  materials: GameMaterials;

  constructor(scene: Scene) {
    this.materials = {
      ...this.materials,
      [GameMaterialNames.GROUND]: (() => {
        const material = new StandardMaterial(GameMaterialNames.GROUND, scene);
        const texture = new Texture('/textures/ground.jpg', scene);
        texture.uScale = 15;
        texture.vScale = 15;
        material.diffuseTexture = texture;
        return material;
      })(),
      [GameMaterialNames.BOX]: (() => {
        const material = new StandardMaterial(GameMaterialNames.BOX, scene);
        material.diffuseTexture = new Texture('/textures/box.jpg', scene);
        return material;
      })(),
    };
  }
}
