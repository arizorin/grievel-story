import { StandardMaterial } from '@babylonjs/core';

export enum GameMaterialNames {
    GROUND = 'ground-material',
    BOX = 'box-material'
}

export type GameMaterials = Record<string, StandardMaterial>
