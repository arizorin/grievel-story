import {
  Mesh, MeshBuilder, PhysicsImpostor, Scene, Vector3,
} from '@babylonjs/core';
import { GameMaterialNames, GameMaterials } from './material.model';
import { GameMaterial } from './game-material';

export class EnvironmentController {
  private readonly scene: Scene;

  private readonly gameMaterials: GameMaterials;

  private props: Mesh[] = [];

  constructor(scene: Scene) {
    this.scene = scene;
    this.gameMaterials = new GameMaterial(this.scene).materials;
  }

  public load() {
    this.createGround();
    this.createObstacles();
  }

  private createObstacles() {
    for (let i = 0; i < 5; i++) {
      this.createBox(((i % 2) * 2), i * 4 + 1);
    }
  }

  private createGround() {
    const ground = MeshBuilder.CreateGround('ground', {}, this.scene);
    ground.scaling = new Vector3(50, 0.02, 50);
    ground.material = this.gameMaterials[GameMaterialNames.GROUND];
    ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this.scene);
  }

  private createBox(x: number, z: number, y: number = 0.5) {
    const box = MeshBuilder.CreateBox(`box-${x}-${z}`, {}, this.scene);
    box.position = new Vector3(x, y, z);
    box.material = this.gameMaterials[GameMaterialNames.BOX];
    // box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 5, restitution: 0.9 }, this.scene)
    box.checkCollisions = true;
    this.props.push(box);
  }
}
