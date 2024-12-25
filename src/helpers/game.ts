import {
    BLACK,
    EMPTY,
    Board,
    Move,
    Player,
    WHITE,
    DIRECTIONS,
    Field,
} from '../interfaces/game';

export function getStartGame(): Board {
    const board: Board = [[], [], [], [], [], [], [], []];

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (y === 3 && x === 3) {
                board[x][y] = { type: WHITE };
                continue;
            }

            if (y === 3 && x === 4) {
                board[x][y] = { type: BLACK };
                continue;
            }

            if (y === 4 && x === 3) {
                board[x][y] = { type: BLACK };
                continue;
            }

            if (y === 4 && x === 4) {
                board[x][y] = { type: WHITE };
                continue;
            }

            board[x][y] = { type: EMPTY };
        }
    }

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

export function isValidMove(board: Board, move: Move, player: Player): boolean {
    if (board[move.x][move.y].type !== EMPTY) {
        return false;
    }

    const opponent: Player = player === BLACK ? WHITE : BLACK;
    for (const [dx, dy] of DIRECTIONS) {
        let newX = move.x + dx;
        let newY = move.y + dy;
        let hasOpponentBetween = false;

        while (
            newX >= 0 &&
            newX < board.length &&
            newY >= 0 &&
            newY < board[0].length
        ) {
            if (board[newX][newY].type === opponent) {
                hasOpponentBetween = true;
            } else if (
                board[newX][newY].type === player &&
                hasOpponentBetween
            ) {
                return true;
            } else {
                break;
            }

            newX += dx;
            newY += dy;
        }
    }

    return false;
}

export function getValidMovesForPlayer(board: Board, player: Player): Move[] {
    const validMoves: Move[] = [];
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (isValidMove(board, { x, y }, player)) {
                validMoves.push({
                    x,
                    y,
                });
            }
        }
    }
    return validMoves;
}

export function applyMoveForPlayer(
    board: Board,
    player: Player,
    move: Move,
): Board {
    const newBoard: Board = board.map((fields: Field[]): Field[] => [
        ...fields,
    ]);
    const opponent = player === BLACK ? WHITE : BLACK;
    newBoard[move.x][move.y].type = player;

    for (const [dx, dy] of DIRECTIONS) {
        let newX = move.x + dx;
        let newY = move.y + dy;
        const flipPositions: [number, number][] = [];

        while (
            newX >= 0 &&
            newX < newBoard.length &&
            newY >= 0 &&
            newY < newBoard[0].length
        ) {
            if (newBoard[newX][newY].type === opponent) {
                flipPositions.push([newX, newY]);
            } else if (newBoard[newX][newY].type === player) {
                for (const [fx, fy] of flipPositions) {
                    newBoard[fx][fy].type = player;
                }
                break;
            } else {
                break;
            }

            newX += dx;
            newY += dy;
        }
    }
    return newBoard;
}

export function minimax(
    board: Board,
    depth: number,
    player: Player,
    alpha: number,
    beta: number,
): number {
    const legalMoves: Move[] = getValidMovesForPlayer(board, player);

    if (depth === 0) {
        return countItemsOnBoard(board, player);
    }

    if (legalMoves.length === 0) {
        return countItemsOnBoard(board, player);
    }

    let maxEval = -Infinity;
    for (const move of legalMoves) {
        const newBoard = applyMoveForPlayer(board, player, move);
        const evaluate = minimax(newBoard, depth - 1, player, alpha, beta);
        maxEval = Math.max(maxEval, evaluate);
        alpha = Math.max(alpha, evaluate);
        if (beta <= alpha) {
            break;
        }
    }
    return maxEval;
}

export function findBestMoveForPlayer(
    board: Board,
    player: Player,
    depth: number,
): Move | null {
    let bestMove: Move | null = null;
    let bestScore = -Infinity;
    const legalMoves = getValidMovesForPlayer(board, player);

    for (const move of legalMoves) {
        const newBoard = applyMoveForPlayer(board, player, move);
        const score = minimax(newBoard, depth - 1, player, -Infinity, Infinity);
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    return bestMove;
}
