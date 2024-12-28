import {
    BLACK,
    Board,
    Difficulty,
    DIRECTIONS,
    EMPTY,
    Move,
    Player,
    WHITE,
} from '../interfaces/game';
import { countItemsOnBoard, evaluateBoard } from './board';

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
    const newBoard: Board = board.map((row) =>
        row.map((field) => ({ ...field })),
    );

    const opponent: Player = player === BLACK ? WHITE : BLACK;
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

export function orderMoves(
    moves: Move[],
    board: Board,
    player: Player,
): Move[] {
    const corners: Move[] = [
        { x: 0, y: 0 },
        { x: 0, y: 7 },
        { x: 7, y: 0 },
        { x: 7, y: 7 },
    ];

    const isCorner = (move: Move): boolean =>
        corners.some(
            (corner: Move): boolean =>
                corner.x === move.x && corner.y === move.y,
        );

    return moves.sort((a: Move, b: Move): number => {
        if (isCorner(b)) {
            return 1;
        }

        if (isCorner(a)) {
            return -1;
        }

        const evalA: number = evaluateBoard(
            applyMoveForPlayer(board, player, a),
            player,
        );

        const evalB: number = evaluateBoard(
            applyMoveForPlayer(board, player, b),
            player,
        );

        return evalB - evalA;
    });
}

export function minmax(
    board: Board,
    depth: number,
    player: Player,
    alpha: number,
    beta: number,
): number {
    const opponent = player === BLACK ? WHITE : BLACK;
    const validMoves: Move[] = getValidMovesForPlayer(board, player);

    if (depth === 0 || validMoves.length === 0) {
        return quiescenceSearch(board, player, alpha, beta);
    }

    if (player === BLACK) {
        let maxEval = -Infinity;
        for (const move of validMoves) {
            const newBoard = applyMoveForPlayer(board, player, move);
            const evaluation = minmax(
                newBoard,
                depth - 1,
                opponent,
                alpha,
                beta,
            );
            maxEval = Math.max(maxEval, evaluation);
            alpha = Math.max(alpha, evaluation);
            if (beta <= alpha) {
                break;
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of validMoves) {
            const newBoard = applyMoveForPlayer(board, player, move);
            const evaluation = minmax(
                newBoard,
                depth - 1,
                opponent,
                alpha,
                beta,
            );
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) {
                break;
            }
        }
        return minEval;
    }
}

function isQuietPosition(board: Board, move: Move, player: Player): boolean {
    const opponent = player === BLACK ? WHITE : BLACK;

    for (const [dx, dy] of DIRECTIONS) {
        const x = move.x + dx;
        const y = move.y + dy;

        if (
            x >= 0 &&
            x < 8 &&
            y >= 0 &&
            y < 8 &&
            board[x][y].type === opponent
        ) {
            return false;
        }
    }
    return true;
}

function quiescenceSearch(
    board: Board,
    player: Player,
    alpha: number,
    beta: number,
): number {
    const evaluation = countItemsOnBoard(board, player);
    if (evaluation >= beta) {
        return beta;
    }
    if (evaluation > alpha) {
        alpha = evaluation;
    }

    const noisyMoves: Move[] = getValidMovesForPlayer(board, player).filter(
        (move: Move): boolean => !isQuietPosition(board, move, player),
    );

    for (const move of noisyMoves) {
        const newBoard = applyMoveForPlayer(board, player, move);
        const opponent = player === BLACK ? WHITE : BLACK;
        const score = -quiescenceSearch(newBoard, opponent, -beta, -alpha);

        if (score >= beta) return beta;
        if (score > alpha) alpha = score;
    }

    return alpha;
}

export async function minmaxParallel(
    board: Board,
    depth: number,
    player: Player,
    alpha: number,
    beta: number,
): Promise<number> {
    const opponent = player === BLACK ? WHITE : BLACK;
    const validMoves: Move[] = getValidMovesForPlayer(board, player);

    if (depth === 0 || validMoves.length === 0) {
        return quiescenceSearch(board, player, alpha, beta);
    }

    const workerPromises = validMoves.map((move) => {
        const worker = new Worker(
            new URL('./minmax.worker.ts', import.meta.url),
            { type: 'module' },
        );
        const newBoard = applyMoveForPlayer(board, player, move);

        return new Promise<number>((resolve, reject) => {
            worker.onmessage = (event) => {
                resolve(event.data);
                worker.terminate();
            };
            worker.onerror = (error) => {
                reject(error);
                worker.terminate();
            };

            worker.postMessage({
                board: newBoard,
                depth: depth - 1,
                player: opponent,
                alpha,
                beta,
            });
        });
    });

    if (player === BLACK) {
        const scores = await Promise.all(workerPromises);
        return Math.max(...scores);
    } else {
        const scores = await Promise.all(workerPromises);
        return Math.min(...scores);
    }
}

export async function findBestMoveForPlayer(
    board: Board,
    player: Player,
    depth: number,
): Promise<Move | null> {
    const opponent = player === BLACK ? WHITE : BLACK;
    let bestMove: Move | null = null;
    let bestScore = -Infinity;

    const validMoves: Move[] = orderMoves(
        getValidMovesForPlayer(board, player),
        board,
        player,
    );

    for (const move of validMoves) {
        const newBoard: Board = applyMoveForPlayer(board, player, move);
        const score: number = -(await minmaxParallel(
            newBoard,
            depth - 1,
            opponent,
            -Infinity,
            Infinity,
        ));

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    return bestMove;
}

export function getDifficultyDepth(
    difficulty: Difficulty,
    numberOfMoves: number,
): number {
    const EARLY_GAME_MOVES = 16;
    const MID_GAME_MOVES = 32;

    const depthMapping = {
        [Difficulty.EASY]: { early: 1, mid: 1, late: 1 },
        [Difficulty.MEDIUM]: { early: 2, mid: 3, late: 4 },
        [Difficulty.HARD]: { early: 3, mid: 4, late: 5 },
    };

    const stage =
        numberOfMoves < EARLY_GAME_MOVES
            ? 'early'
            : numberOfMoves < MID_GAME_MOVES
              ? 'mid'
              : 'late';

    const depth = depthMapping[difficulty][stage];

    const dynamicAdjustment = Math.max(
        0,
        Math.min(2, Math.floor(64 - numberOfMoves) / 10),
    );

    return depth + dynamicAdjustment;
}
