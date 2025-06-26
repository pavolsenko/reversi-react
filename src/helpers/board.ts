import { BOARD_WEIGHTS, CORNERS } from '@/constants/game';
import { BLACK, Board, EMPTY, Field, Player, WHITE } from '@/interfaces/game';
import { getValidMovesForPlayer } from '@/helpers/game';

export function getStartGame(): Board {
    const board: Board = Array.from({ length: 8 }, () =>
        Array.from({ length: 8 }, () => EMPTY),
    );

    board[3][3] = WHITE;
    board[3][4] = BLACK;
    board[4][3] = BLACK;
    board[4][4] = WHITE;

    return board;
}

export function checkIsGameOver(board: Board): boolean {
    const totalPieces =
        countItemsOnBoard(board, WHITE) + countItemsOnBoard(board, BLACK);

    if (totalPieces === 64) return true;

    const whiteMoves = getValidMovesForPlayer(board, WHITE);
    const blackMoves = getValidMovesForPlayer(board, BLACK);

    return whiteMoves.length === 0 && blackMoves.length === 0;
}

export function countItemsOnBoard(board: Board, player: Player): number {
    return board.reduce(
        (total: number, row: Field[]): number =>
            total +
            row.filter((field: Field): boolean => field === player).length,
        0,
    );
}

export function evaluateBoard(board: Board, player: Player): number {
    let score = 0;

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const type: Field = board[x][y];
            if (type === player) {
                score += BOARD_WEIGHTS[x][y];
            } else if (type !== EMPTY) {
                score -= BOARD_WEIGHTS[x][y];
            }
        }
    }

    const mobility = getValidMovesForPlayer(board, player).length;
    score += mobility * 10;

    return score;
}

export function evaluateBoardAdvanced(board: Board, player: Player): number {
    const opponent = player === BLACK ? WHITE : BLACK;

    let score = 0;
    let playerDiscs = 0;
    let opponentDiscs = 0;
    let playerCorners = 0;
    let opponentCorners = 0;

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const type: Field = board[x][y];
            if (type === player) {
                score += BOARD_WEIGHTS[x][y];
                playerDiscs++;
            } else if (type === opponent) {
                score -= BOARD_WEIGHTS[x][y];
                opponentDiscs++;
            }
        }
    }

    for (const corner of CORNERS) {
        if (board[corner.x][corner.y] === player) playerCorners++;
        if (board[corner.x][corner.y] === opponent) opponentCorners++;
    }

    const parity =
        (100 * (playerDiscs - opponentDiscs)) /
        (playerDiscs + opponentDiscs + 1);
    const cornerScore = 100 * (playerCorners - opponentCorners);
    const mobility =
        getValidMovesForPlayer(board, player).length -
        getValidMovesForPlayer(board, opponent).length;

    return score + parity + cornerScore * 5 + mobility * 10;
}
