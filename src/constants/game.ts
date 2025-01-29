import { Move } from '../interfaces/game';

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

export const CORNERS: Move[] = [
    { x: 0, y: 0 },
    { x: 0, y: 7 },
    { x: 7, y: 0 },
    { x: 7, y: 0 },
    { x: 7, y: 7 },
];
