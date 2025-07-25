export type Board = Field[][];

export const EMPTY = 'empty';
export const WHITE = 'white';
export const BLACK = 'black';

export type Field = typeof EMPTY | typeof BLACK | typeof WHITE;

export type Player = typeof BLACK | typeof WHITE;

export interface Move {
    x: number;
    y: number;
}

export enum Difficulty {
    EASY,
    MEDIUM,
    HARD,
}

export interface MinMaxWorkerData {
    board: Board;
    depth: number;
    player: Player;
    alpha: number;
    beta: number;
}

export interface MinMaxWorkerResult {
    score?: number;
    error?: string;
}
