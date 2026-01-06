import { CORNERS, DIRECTIONS } from '@/constants/game';
import { getOpponent } from '@/helpers/game';
import {
    BLACK,
    Board,
    EMPTY,
    Field,
    Move,
    Player,
    WHITE,
} from '@/interfaces/game';

export function isCorner(move: Move): boolean {
    return CORNERS.some((corner) => corner.x === move.x && corner.y === move.y);
}

export function getStartGame(): Board {
    const board: Board = Array.from({ length: 8 }, () => Array(8).fill(EMPTY));
    board[3][3] = WHITE;
    board[3][4] = BLACK;
    board[4][3] = BLACK;
    board[4][4] = WHITE;
    return board;
}

export function countItemsOnBoard(board: Board, player: Player): number {
    return board.reduce(
        (total: number, row: Field[]): number =>
            total +
            row.filter((field: Field): boolean => field === player).length,
        0,
    );
}

export function isValidMove(board: Board, move: Move, player: Player): boolean {
    if (board[move.x][move.y] !== EMPTY) {
        return false;
    }

    const opponent = getOpponent(player);
    for (const [dx, dy] of DIRECTIONS) {
        let x: number = move.x + dx;
        let y: number = move.y + dy;
        let seenOpponent: boolean = false;

        while (x >= 0 && y >= 0 && x < 8 && y < 8) {
            const current = board[x][y];
            if (current === opponent) {
                seenOpponent = true;
            } else if (current === player && seenOpponent) {
                return true;
            } else {
                break;
            }
            x += dx;
            y += dy;
        }
    }
    return false;
}

export function getValidMovesForPlayer(board: Board, player: Player): Move[] {
    const moves: Move[] = [];
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if (isValidMove(board, { x, y }, player)) {
                moves.push({ x, y });
            }
        }
    }
    return moves;
}
