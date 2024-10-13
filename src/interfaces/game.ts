export type Fields = Field[][];

export interface Field {
    type: FieldType;
    coordinates?: Coordinates;
}

export const EMPTY = 'empty';
export const WHITE = 'white';
export const BLACK = 'black';

export type FieldType =  typeof EMPTY | typeof BLACK | typeof WHITE;

export type Player = typeof BLACK | typeof WHITE;

export interface Coordinates {
    x: number;
    y: number;
}

export type Direction = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

export interface LegalMove {
    coordinates: Coordinates;
    direction: Direction;
}

export enum Difficulty {
    EASY,
    MEDIUM,
    HARD,
}
