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
