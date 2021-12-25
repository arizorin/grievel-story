import {StandardMaterial} from "@babylonjs/core";

export enum GameState {
    START,
    GAME,
    LOST,
    CUTSCENE
}

export enum GameMaterialNames {
    GROUND = 'ground-material',
    BOX = 'box-material'
}

export type gameMaterials = Record<string, StandardMaterial>
