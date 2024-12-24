export type Board = Field[][];

export interface Field {
    type: FieldType;
    coordinates?: Move;
}

export const EMPTY = 'empty';
export const WHITE = 'white';
export const BLACK = 'black';

export type FieldType = typeof EMPTY | typeof BLACK | typeof WHITE;

export type Player = typeof BLACK | typeof WHITE;

export interface Move {
    x: number;
    y: number;
}

export const DIRECTIONS: number[][] = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
];

export enum Difficulty {
    EASY,
    MEDIUM,
    HARD,
}
