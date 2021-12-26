import {
  BaseTexture,
  Color4,
  GPUParticleSystem,
  Mesh, MeshBuilder, ParticleSystem, PhysicsImpostor, Scene, SceneLoader, StandardMaterial, Texture, Vector3,
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
    this.createFog();
    this.createMoon();
  }

  private createObstacles() {
    for (let i = 0; i < 5; i++) {
      this.createBox(((i % 2) * 2), i * 4 + 1);
    }
  }

  private createFog() {
    const fountain = Mesh.CreateBox('foutain', 0.01, this.scene);
    fountain.visibility = 0;

    let particleSystem;
    const fogTexture = new Texture('/textures/fog.png ', this.scene);

    const createNewSystem = () => {
      if (particleSystem) {
        particleSystem.dispose();
      }

      if (GPUParticleSystem.IsSupported) {
        particleSystem = new GPUParticleSystem('particles', { capacity: 5000 }, this.scene);
        particleSystem.activeParticleCount = 5000;
        particleSystem.manualEmitCount = particleSystem.activeParticleCount;
        particleSystem.minEmitBox = new Vector3(-100, 1, -100);
        particleSystem.maxEmitBox = new Vector3(100, -10, 100);
      }

      particleSystem.particleTexture = fogTexture.clone();
      particleSystem.emitter = fountain;

      particleSystem.color1 = new Color4(0.8, 0.8, 0.8, 0.1);
      particleSystem.color2 = new Color4(0.95, 0.95, 0.95, 0.15);
      particleSystem.colorDead = new Color4(0.9, 0.9, 0.9, 0.1);
      particleSystem.minSize = 3.5;
      particleSystem.maxSize = 5.0;
      particleSystem.minLifeTime = Number.MAX_SAFE_INTEGER;
      particleSystem.emitRate = 5000;
      particleSystem.blendMode = ParticleSystem.BLENDMODE_STANDARD;
      particleSystem.gravity = new Vector3(0, 0, 0);
      particleSystem.direction1 = new Vector3(0, 1, 3);
      particleSystem.direction2 = new Vector3(5, 1, 0);
      particleSystem.minAngularSpeed = -2;
      particleSystem.maxAngularSpeed = 2;
      particleSystem.minEmitPower = 0.5;
      particleSystem.maxEmitPower = 1;
      particleSystem.updateSpeed = 0.005;

      particleSystem.start();
    };

    createNewSystem();
  }

  private createGround() {
    const ground = MeshBuilder.CreateCylinder('ground', {
      height: 0.1,
      diameter: 25,
    }, this.scene);
    ground.position.y = -0.1;
    // ground.scaling = new Vector3(50, 0.02, 50);
    ground.material = this.gameMaterials[GameMaterialNames.GROUND];
    ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.CylinderImpostor, { mass: 0, restitution: 0.9 }, this.scene);
  }

  private createBox(x: number, z: number, y: number = 0.5) {
    const box = MeshBuilder.CreateBox(`box-${x}-${z}`, {}, this.scene);
    box.position = new Vector3(x, y, z);
    box.material = this.gameMaterials[GameMaterialNames.BOX];
    box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 5, restitution: 0.9 }, this.scene);
    box.checkCollisions = true;
    box.receiveShadows = true;
    this.props.push(box);
  }

  private async createMoon() {
    const { meshes } = await SceneLoader.ImportMeshAsync('', './models/environment/', 'SmallMoon.obj', this.scene);
    const mat = new StandardMaterial('moon-material', this.scene);
    mat.diffuseTexture = new Texture('/textures/MoonTexture.png', this.scene);

    meshes[0].material = mat;
    meshes[0].position = new Vector3(-15, 7, -80);
    meshes[0].scaling = new Vector3(10, 10, 10);
  }
}
