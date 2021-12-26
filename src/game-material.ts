import {
  Color3, CubeTexture, Scene, StandardMaterial, Texture,
} from '@babylonjs/core';
import { GameMaterialNames, GameMaterials } from './material.model';

export class GameMaterial {
  materials: GameMaterials;

  constructor(scene: Scene) {
    this.materials = {
      ...this.materials,
      [GameMaterialNames.GROUND]: (() => {
        const material = new StandardMaterial(GameMaterialNames.GROUND, scene);
        const texture = new Texture('/textures/ground.jpg', scene);
        texture.uScale = 5;
        texture.vScale = 5;
        material.diffuseTexture = texture;
        return material;
      })(),
      [GameMaterialNames.BOX]: (() => {
        const material = new StandardMaterial(GameMaterialNames.BOX, scene);
        material.diffuseTexture = new Texture('/textures/box.jpg', scene);
        return material;
      })(),
      [GameMaterialNames.SKY_BOX]: (() => {
        const skyboxMaterial = new StandardMaterial('skyBox', scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new CubeTexture('/textures/skybox/', scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        return skyboxMaterial;
      })(),
    };
  }
}
