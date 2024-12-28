import {
    BLACK,
    Board,
    EMPTY,
    Field,
    Move,
    Player,
    WHITE,
} from '../interfaces/game';
import { getValidMovesForPlayer } from './game';

export function getStartGame(): Board {
    const board: Board = Array.from({ length: 8 }, (): Field[] =>
        Array.from({ length: 8 }, (): Field => ({ type: EMPTY })),
    );

    board[3][3].type = WHITE;
    board[3][4].type = BLACK;
    board[4][3].type = BLACK;
    board[4][4].type = WHITE;

    return board;
}

export function checkIsGameOver(board: Board): boolean {
    const white: number = countItemsOnBoard(board, WHITE);
    const black: number = countItemsOnBoard(board, BLACK);

    if (white + black === 64) {
        return true;
    }

    const whiteValidMoves: Move[] = getValidMovesForPlayer(board, WHITE);
    const blackValidMoves: Move[] = getValidMovesForPlayer(board, BLACK);

    return whiteValidMoves.length === 0 && blackValidMoves.length === 0;
}

export function countItemsOnBoard(board: Board, player: Player): number {
    let count: number = 0;

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (board[x][y].type === player) {
                count++;
            }
        }
    }

    return count;
}

export function evaluateBoard(board: Board, player: Player): number {
    const weights = [
        [100, -20, 10, 5, 5, 10, -20, 100],
        [-20, -50, -2, -2, -2, -2, -50, -20],
        [10, -2, 5, 1, 1, 5, -2, 10],
        [5, -2, 1, 0, 0, 1, -2, 5],
        [5, -2, 1, 0, 0, 1, -2, 5],
        [10, -2, 5, 1, 1, 5, -2, 10],
        [-20, -50, -2, -2, -2, -2, -50, -20],
        [100, -20, 10, 5, 5, 10, -20, 100],
    ];

    let score = 0;
    let mobility = 0;

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (board[x][y].type === player) {
                score += weights[x][y];
            } else if (board[x][y].type !== EMPTY) {
                score -= weights[x][y];
            }
        }
    }

    mobility += getValidMovesForPlayer(board, player).length;
    score += mobility * 10;

    return score;
}
